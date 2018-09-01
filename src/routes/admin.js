const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin");
const checkAuth = require("../middleware/checkauth");

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.post("/add/inspector", checkAuth, controller.addInspector);

router.post("/delete/inspector", checkAuth, controller.deleteInspector);

router.get("/load/inspector", checkAuth, controller.loadInspectors);

router.get("/load/report", checkAuth, controller.loadReports);

module.exports = router;
