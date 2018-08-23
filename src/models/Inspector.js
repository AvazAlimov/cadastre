const mongoose = require("mongoose");

const inspectorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  imei: {
    type: String
  }
});

module.exports = mongoose.model("Inspector", inspectorSchema);
