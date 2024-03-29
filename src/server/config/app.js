let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let logger = require("morgan");
let cors = require("cors");

let app = express();

//database setup
let mongoose = require("mongoose");
let DB = require("./db");

//point mongoose to the DB URI
mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });
let mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error: "));
mongoDB.once("open", () => {
  console.log("Connected to mongoDB...");
});

//cors middleware
app.use(cors());

//Bodypasrser
app.use(express.urlencoded({ extended: false }));

//import routes
let incidentsRouter = require("../routes/incidents");
let auth = require("../routes/auth");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", incidentsRouter);
app.use("/api/auth", auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Error" });
});

module.exports = app;
