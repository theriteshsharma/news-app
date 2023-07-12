var express = require("express");
var router = express.Router();
var userService = require("../services/UserServices");
const { ApiBadRequestError } = require("../utils/errors");
const { verifyUser } = require("../middleware/authMiddleware");
const { sendEmail } = require("../utils/mail");
const { FollowedCategory } = require("../models/Category");

/* GET users listing. */
router.post("/register", async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.email)
      throw new ApiBadRequestError("username or email cannot be null");
    let user = await userService.register(req.body);
    sendEmail(
      user.email,
      "Welcome",
      `Thanks! ${user.username} \n Now you are a Part of our news App`
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new ApiBadRequestError("Email or Password should be present");
    let payload = await userService.signin(email, password);

    res.cookie("token", payload.token, {
      expires: new Date(
        Date.now() + process.env.NODE_ENV !== "production" ? 100 : 604800000
      ),
      secure: false, // set to true if your using https
      httpOnly: true,
    });

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
});

router.get("/interests", verifyUser, async (req, res, next) => {
  try {
    let rslt = await userService.getInterests(req.user.uid);
    res.status(200).json(rslt);
  } catch (err) {
    next(err);
  }
});
router.post("/interests", verifyUser, async (req, res, next) => {
  try {
    let rslt = await userService.addInterests(req.user.uid, req.body);

    res.status(200).json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
