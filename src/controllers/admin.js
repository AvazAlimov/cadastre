const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Inspector = require("../models/Inspector");
const Report = require("../models/Report");

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

exports.deleteInspector = (req, res) => {
  Inspector.remove({
    _id: req.body._id
  }).then(() => {
    res.status(200).json({ message: "Deleted" });
  });
};

exports.loadInspectors = (req, res) => {
  Inspector.find().then(inspectors => {
    res.status(200).json(inspectors);
  });
};

exports.loadReports = (req, res) => {
  Report.find().then(inspectors => {
    res.status(200).json(inspectors);
  });
};

exports.getReport = (req, res) => {
  Report.find({
    _id: req.params.id
  }).then(reports => {
    if (reports.length > 0) {
      res.status(200).json(reports[0]);
    } else {
      res.status(404).json({ message: "not found" });
    }
  });
};

exports.getInspector = (req, res) => {
  Inspector.find({
    _id: req.params.id
  }).then(reports => {
    if (reports.length > 0) {
      res.status(200).json(reports[0]);
    } else {
      res.status(404).json({ message: "not found" });
    }
  });
};

exports.confirmReport = (req, res) => {
  console.log(req);
  Report.update(
    {
      _id: req.body.id
    },
    {
      $set: {
        number: req.body.number,
        actuality: req.files["actuality"],
        document: req.files["document"],
        application: req.files["application"],
        sentence: req.files["sentence"],
        mib: req.files["mib"],
        post_photos: req.files["post_photos"].map(p => p.filename)
      }
    }
  )
    .exec()
    .then(() => res.status(200).json({ message: "updated" }))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
