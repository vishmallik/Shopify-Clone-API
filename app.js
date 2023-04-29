var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var categoryRouter = require("./routes/category");
var productsRouter = require("./routes/products");
var collectionRouter = require("./routes/collection");
var variantRouter = require("./routes/variant");

const mongoose = require("mongoose");

var app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URL, function (err) {
  console.log(err ? err : "Connected to DB");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes handler

app.use("/api/v1", indexRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/collection", collectionRouter);
app.use("/api/v1/variant", variantRouter);

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
  res.render("error");
});

module.exports = app;
