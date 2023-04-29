const express = require("express");

const Auth = require("../middlewares/Auth");
const Collection = require("../models/Collections");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const collections = await Collection.find({});
    return res.status(200).json({ collections });
  } catch (error) {
    next(error);
  }
});

router.post("/", Auth.isLoggedIn, async function (req, res, next) {
  try {
    const data = req.body;
    data.createdBy = req.user._id;

    if (!data.name) {
      return res.json({ error: "Collection name is required" });
    }
    const newCollection = await Collection.create(data);

    return res.status(200).json({ collection: newCollection });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
