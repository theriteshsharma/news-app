var express = require("express");
var router = express.Router();
var userRouter = require("./users");
var newsRouter = require("./news");
let categoryService = require("../services/CategoryService");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/allCategories", async (req, res, next) => {
  try {
    let cat = await categoryService.getAll();
    res.status(200).send(cat);
  } catch (err) {
    next(err);
  }
});

router.use("/user", userRouter);
router.use("/news", newsRouter);

module.exports = router;
