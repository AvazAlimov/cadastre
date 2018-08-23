const express = require("express");
const router = express.Router();
const controller = require("../controllers/inspector");
const checkAuth = require("../middleware/checkauth");

router.post("/login", controller.register, controller.login);

module.exports = router;
