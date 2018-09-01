const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Inspector = require("../models/Inspector");

exports.signup = (req, res) => {
  Admin.find({
    login: req.body.login
  })
    .exec()
    .then(admins => {
      if (admins.length > 0) {
        return res.status(409).json({ message: "Login exists" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ message: "Internal error" });
          } else {
            const admin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              login: req.body.login,
              password: hash
            });
            admin.save().then(() => {
              res.status(201).json({ message: "Admin created" });
            });
          }
        });
      }
    });
};

exports.login = (req, res) => {
  Admin.find({
    login: req.body.login
  })
    .exec()
    .then(admins => {
      if (admins.length < 1) {
        return res.status(404).json({ message: "Auth failed" });
      } else {
        bcrypt.compare(req.body.password, admins[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({ message: "Auth failed" });
          }
          if (result) {
            const token = jwt.sign(
              {
                _id: admins[0]._id
              },
              "secret"
            );
            return res.status(200).json({
              token: token
            });
          }
          return res.status(401).json({ message: "Auth failed" });
        });
      }
    });
};

exports.addInspector = (req, res) => {
  Inspector.find({
    phone: req.body.phone
  })
    .exec()
    .then(inspectors => {
      if (inspectors.length > 0) {
        return res.status(409).json({ message: "Phone exists" });
      } else {
        const inspector = new Inspector({
          _id: new mongoose.Types.ObjectId(),
          fullname: req.body.fullname,
          phone: req.body.phone
        });
        inspector.save().then(() => {
          res.status(201).json({ message: "Inspector created" });
        });
      }
    });
};

exports.loadInspectors = (req, res) => {
  Inspector.find().then(inspectors => {
    res.status(200).json(inspectors);
  });
};
