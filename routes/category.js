const express = require("express");

const Auth = require("../middlewares/Auth");
const Category = require("../models/Category");

const router = express.Router();

// get all categories
router.get("/", async (_req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, productCategories: categories });
  } catch (error) {
    next(error);
  }
});

//create category
router.post("/", Auth.isLoggedIn, async (req, res, next) => {
  try {
    const data = req.body;
    data.name = data.name.toLowerCase();

    const category = await Category.findOne({ name: data.name });
    if (category) {
      return res.json({ error: "Category already exists" });
    }

    const createdCategory = await Category.create(data);

    return res.json({ isSucess: true, productCategory: createdCategory });
  } catch (error) {
    next(error);
  }
});

//delete Category
router.delete("/:slug", Auth.isLoggedIn, async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }
    const deletedCategory = await Category.findOneAndDelete({ slug });

    res.status(200).json({ category: deletedCategory });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
