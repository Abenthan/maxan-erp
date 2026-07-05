require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const MONTHS = {
  'ene': 1, 'feb': 2, 'mar': 3, 'abr': 4, 'may': 5, 'jun': 6,
  'jul': 7, 'ago': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dic': 12,
};

function parseDate(str) {
  const parts = str.trim().split('-');
  if (parts.length < 2) throw new Error(`Formato fecha inválido: "${str}"`);
  const day = parseInt(parts[0], 10);
  const monthAbbr = parts[1].toLowerCase().slice(0, 3);
  const month = MONTHS[monthAbbr];
  if (!month) throw new Error(`Mes no reconocido: "${parts[1]}"`);
  const year = new Date().getFullYear();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseValue(str) {
  let s = str.trim();
  s = s.replace(/^\$\s*/, '');
  s = s.replace(/\./g, '');
  s = s.replace(',', '.');
  return parseFloat(s);
}

async function main() {
  const csvDir = path.join(__dirname, '..', '..', 'Archivos');
  const csvName = 'Bancolombia Mayo y junio.csv';
  const csvPath = path.join(csvDir, csvName);

  if (!fs.existsSync(csvPath)) {
    console.error(`ERROR: No se encuentra el archivo: ${csvPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  const dataLines = lines.slice(1).filter(l => l.trim());

  let inserted = 0;
  const errors = [];

  console.log(`Importando ${dataLines.length} gastos desde "${csvName}"...\n`);

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    const parts = line.split(';');
    if (parts.length < 3) {
      errors.push(`Línea ${i + 2}: se esperaban 3 columnas, se encontraron ${parts.length}`);
      continue;
    }

    const [fechaStr, descripcion, valorStr] = parts;

    try {
      const fecha = parseDate(fechaStr);
      const valorTotal = parseValue(valorStr);

      if (isNaN(valorTotal) || valorTotal <= 0) {
        errors.push(`Línea ${i + 2}: valor inválido "${valorStr}"`);
        continue;
      }

      await pool.query(
        `INSERT INTO gastos.gastos
           (descripcion, clasificacion, cantidad, valor_unitario, valor_total, fecha)
         VALUES ($1, 'Administrativo', 1, $2, $2, $3)`,
        [descripcion.trim(), valorTotal, fecha]
      );

      inserted++;
      const desc = descripcion.trim().length > 45
        ? descripcion.trim().slice(0, 42) + '...'
        : descripcion.trim().padEnd(45);
      console.log(`  ✓ [${fecha}]  ${desc}  $ ${valorTotal.toLocaleString('es-CO')}`);
    } catch (err) {
      errors.push(`Línea ${i + 2} "${descripcion?.trim()}": ${err.message}`);
    }
  }

  console.log(`\n--- Resumen ---`);
  console.log(`  Insertados: ${inserted}`);
  if (errors.length > 0) {
    console.log(`  Errores:    ${errors.length}`);
    errors.forEach(e => console.log(`    ✗ ${e}`));
  }

  await pool.end();
  console.log('\nImportación finalizada.');
}

main().catch(err => {
  console.error('Error general:', err);
  process.exit(1);
});
