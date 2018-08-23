const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Inspector = require("../models/Inspector");

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
      token: token
    });
  } else {
      res.status(401).json({
          message: "Auth Failed"
      })
  }
};
