const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ownerfullname: {
    type: String,
    required: true
  },
  ownerphone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  buildingarea: {
    type: Number,
    required: true
  },
  groundarea: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  request: {
    type: String,
    required: true
  },
  photos: [
    {
      type: String
    }
  ],
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inspector"
  },
  created_at: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Report", reportSchema);
