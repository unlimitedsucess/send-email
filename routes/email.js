const express = require("express");

const emailController = require('../controllers/email');

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

router.post("/email", emailController.postEmail);
// router.get("/", adminController.getLogin);

module.exports = router;
