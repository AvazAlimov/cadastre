const express = require("express");
const router = express.Router();
const controller = require("../controllers/inspector");
const auth = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, req.inspector.id + "_" + file.fieldname + "_" + Date.now() + ".jpg");
  }
});
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 20 * 1024 * 1024
  }
});

router.post("/login", controller.register, controller.login);

router.post(
  "/report",
  auth,
  upload.fields([
    { name: "request", maxCount: 1 },
    { name: "photos", maxCount: 20 }
  ]),
  controller.report
);

module.exports = router;
