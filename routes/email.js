const express = require("express");

const emailController = require('../controllers/email');

const router = express.Router();

router.post("/email", emailController.postEmail);
// router.get("/", adminController.getLogin);

module.exports = router;
