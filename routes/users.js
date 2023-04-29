const express = require("express");

const auth = require("../middlewares/Auth");
const User = require("../models/User");

const router = express.Router();

/* User registeration */
router.post("/register", async (req, res, next) => {
  const data = req.body;
  if (!data.username || !data.password || !data.email) {
    return res.json({
      error: {
        username: "Username can't be empty",
        email: "Email can't be empty",
        password: "Password can't be empty",
      },
    });
  }

  try {
    const user = await User.findOne({ email: data.email });
    if (user) {
      return res.json({
        error: { email: "User already exists", username: "", password: "" },
      });
    }

    const newUser = await User.create(data);

    res.json({ user: newUser });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      error: { email: "Email is required", password: "Password is required" },
    });
  }
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ error: { email: "No User found.", password: "" } });
    }
    const result = await user.verifyPassword(password);
    if (!result) {
      return res.json({
        error: { email: "", password: "Password is incorrect." },
      });
    }

    const token = await user.createToken();

    return res.status(200).json({ user: user, token: token });
  } catch (error) {
    next(error);
  }
});

router.get("/user", auth.isLoggedIn, async function (req, res, next) {
  res.json({ user: req.user });
});

module.exports = router;
