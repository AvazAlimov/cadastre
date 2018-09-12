const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin");
const checkAuth = require("../middleware/checkauth");
const multer = require("multer");
const mime = require("mime");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + "." + mime.getExtension(file.mimetype)
    );
  }
});
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 20 * 1024 * 1024
  }
});

router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.post("/add/inspector", checkAuth, controller.addInspector);

router.post("/delete/inspector", checkAuth, controller.deleteInspector);

router.get("/load/inspector", checkAuth, controller.loadInspectors);

router.get("/load/report", checkAuth, controller.loadReports);

router.get("/report/:id", checkAuth, controller.getReport);

router.get("/inspector/:id", checkAuth, controller.getInspector);

router.post(
  "/report/confirm",
  checkAuth,
  upload.fields([
    { name: "actuality", maxCount: 1 },
    { name: "document", maxCount: 1 },
    { name: "application", maxCount: 1 },
    { name: "sentence", maxCount: 1 },
    { name: "mib", maxCount: 1 },
    { name: "post_photos[]", maxCount: 20 }
  ]),
  controller.confirmReport
);

module.exports = router;
