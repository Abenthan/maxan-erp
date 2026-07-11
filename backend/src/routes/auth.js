const { Router } = require("express");
const { authenticate } = require("../middleware/auth");
const {
  checkFirstRun, register, login, me, changePassword,
} = require("../controllers/authController");

const router = Router();

router.get("/check-first-run", checkFirstRun);
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/change-password", authenticate, changePassword);

module.exports = router;
