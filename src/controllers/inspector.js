const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Inspector = require("../models/Inspector");
const Report = require("../models/Report");

exports.register = (req, res, next) => {
  Inspector.find({
    phone: req.body.phone
  })
    .exec()
    .then(inspectors => {
      if (inspectors.length === 0) {
        res.status(404).json({ message: "Not found" });
      } else {
        req.inspector = inspectors[0];
        if (!req.inspector.imei) {
          Inspector.updateOne(
            {
              phone: req.body.phone
            },
            { $set: { imei: req.body.imei } }
          )
            .exec()
            .then(() => {
              req.inspector.imei = req.body.imei;
              next();
            });
        } else {
          next();
        }
      }
    });
};

exports.login = (req, res) => {
  if (req.inspector.imei === req.body.imei) {
    const token = jwt.sign(
      {
        id: req.inspector._id
      },
      "secret"
    );
    res.status(200).json({
      token: token,
      full_name: req.inspector.fullname
    });
  } else {
    res.status(401).json({
      message: "Auth Failed"
    });
  }
};

exports.report = (req, res) => {
  const report = new Report({
    _id: new mongoose.Types.ObjectId(),
    ownerfullname: req.body.ownerfullname,
    ownerphone: req.body.ownerphone,
    address: req.body.address,
    buildingarea: req.body.buildingarea,
    groundarea: req.body.groundarea,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    request: req.files["request"][0].filename,
    photos: req.files["photos"].map(p => p.filename),
    inspector: req.inspector.id,
    created_at: Date.now()
  });
  report.save().then(() => {
    res.status(201).json({ message: "Report accepted" });
  });
};
