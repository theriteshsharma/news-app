var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cors = require("cors");
var indexRouter = require("./routes/index");
const { logError, returnError } = require("./utils/errors");
const { fetchNews } = require("./newsScript");
const newsService = require("./services/NewsService");
const schedule = require("node-schedule");

var app = express();

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", indexRouter);

app.get("/fetchNews", async (req, res, next) => {
  //await fetchNews();
  await newsService.sendAllTopHeadlines();
  res.send();
});
fetchNews();
const job = schedule.scheduleJob("*/30 * * * *", function () {
  fetchNews();
});

app.use(logError);
app.use(returnError);

module.exports = app;
