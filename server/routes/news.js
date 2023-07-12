const { verifyUser } = require("../middleware/authMiddleware");
const newsService = require("../services/NewsService");
const { fileUpload } = require("../utils/multer");
const router = require("express").Router();

router.get("/print-news", async (req, res, next) => {
  try {
    let rslt = await newsService.printNewsByCategory(req.query.category);

    res.type("pdf").send(rslt);
  } catch (error) {
    next(error);
  }
});
router.get("/shortNews", async (req, res, next) => {
  try {
    let rslt = await newsService.getShortNews();
    res.status(200).json(rslt);
  } catch (err) {
    next(err);
  }
});

router.get("/", verifyUser, async (req, res, next) => {
  try {
    let rslt;

    if (req.query.location) {
      console.log("bylocation");
      rslt = await newsService.getNewsByLocation(req.query.location);
    } else {
      rslt = await newsService.getInterestedNews(
        req.user.uid,
        req.query.category
      );
    }
    res.status(200).json(rslt);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", verifyUser, async (req, res, next) => {
  try {
    let rslt = await newsService.getNewsById(req.params.id);
    res.status(200).json(rslt);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  verifyUser,
  fileUpload.single("banner"),
  async (req, res, next) => {
    try {
      let rslt = await newsService.createNews(req.user, req.body, req.file);
      return rslt;
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
