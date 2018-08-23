module.exports = app => {
  app.use("/admin", require("./admin"));
  app.use("/inspector", require("./inspector"));
};
