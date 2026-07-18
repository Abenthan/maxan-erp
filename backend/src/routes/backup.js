const { Router } = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { spawn } = require("child_process");
const { Transform } = require("stream");

const router = Router();

router.use(authenticate, authorize("usuarios.gestionar"));

const DB_CONTAINER = process.env.DB_DOCKER_CONTAINER || "maxan_db_dev";
const USE_DOCKER = process.env.DB_USE_DOCKER !== "false";

const SCHEMAS_TO_DROP = ["helpdesk", "cartera", "usuarios", "gastos", "compras", "inventario", "facturacion", "generales"];

function buildPgDumpArgs() {
  const dbUser = process.env.DB_USER || "maxan_user";
  const dbName = process.env.DB_NAME || "maxan_erp";
  return ["-U", dbUser, "--column-inserts", "--no-owner", "--no-acl", dbName];
}

function spawnPgDump() {
  if (USE_DOCKER) {
    return spawn("docker", [
      "exec", "-i", DB_CONTAINER,
      "pg_dump", ...buildPgDumpArgs(),
    ], { stdio: ["ignore", "pipe", "pipe"] });
  }
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "5432";
  const dbPassword = process.env.DB_PASSWORD || "";
  return spawn("pg_dump", [
    "-h", dbHost, "-p", String(dbPort), ...buildPgDumpArgs(),
  ], {
    env: { ...process.env, PGPASSWORD: dbPassword },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

router.get("/descargar", (req, res) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `maxan_backup_${timestamp}.sql`;

  res.setHeader("Content-Type", "application/sql; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  const dropSchemas = SCHEMAS_TO_DROP.map((s) => `DROP SCHEMA IF EXISTS ${s} CASCADE;`).join("\n");
  res.write(dropSchemas + "\n\n");

  const proc = spawnPgDump();

  let buf = "";
  const filterRestrict = new Transform({
    transform(chunk, encoding, callback) {
      buf += chunk.toString();
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("\\restrict") && !line.startsWith("\\unrestrict")) this.push(line + "\n");
      }
      callback();
    },
    flush(callback) {
      if (buf && !buf.startsWith("\\restrict") && !buf.startsWith("\\unrestrict")) this.push(buf);
      callback();
    },
  });

  proc.stdout.pipe(filterRestrict).pipe(res);

  let stderr = "";
  proc.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

  proc.on("error", (err) => {
    console.error("Error al ejecutar pg_dump:", err.message);
    if (!res.headersSent) {
      const hint = USE_DOCKER
        ? "Verifique que Docker esté corriendo y el contenedor '" + DB_CONTAINER + "' exista."
        : "Verifique que pg_dump esté instalado en el servidor.";
      res.status(500).json({ error: "Error al generar backup. " + hint });
    }
  });

  proc.on("close", (code) => {
    if (code !== 0 && !res.headersSent) {
      console.error("pg_dump exit code:", code, "stderr:", stderr);
      res.status(500).json({ error: `pg_dump terminó con código ${code}.` });
    }
  });
});

router.get("/verificar", (req, res) => {
  if (USE_DOCKER) {
    const proc = spawn("docker", ["exec", DB_CONTAINER, "pg_dump", "--version"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    proc.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    proc.on("close", (code) => {
      res.json({ disponible: code === 0, version: stdout.trim(), modo: "docker" });
    });
    proc.on("error", () => {
      res.json({ disponible: false, version: null, modo: "docker" });
    });
  } else {
    const proc = spawn("pg_dump", ["--version"], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    proc.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    proc.on("close", (code) => {
      res.json({ disponible: code === 0, version: stdout.trim(), modo: "directo" });
    });
    proc.on("error", () => {
      res.json({ disponible: false, version: null, modo: "directo" });
    });
  }
});

module.exports = router;
