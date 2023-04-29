const express = require("express");

const Category = require("../models/Category");
const Auth = require("../middlewares/Auth");
const Product = require("../models/Product");
const User = require("../models/User");
const Collection = require("../models/Collections");

const router = express.Router();

router.get("/getList", Auth.isLoggedIn, async (req, res, next) => {
  try {
    const { selectedView } = req.query;
    const username = req.user.username;

    if (
      selectedView === "draft" ||
      selectedView === "active" ||
      selectedView === "archived"
    ) {
      const activeProducts = await Product.find({
        product_status: selectedView,
        vendor: username,
      }).populate("category_id");

      return res.status(200).json({ products: activeProducts });
    }

    const allProducts = await Product.find({}).populate("category_id");
    return res.status(200).json({ products: allProducts, vendor: username });
  } catch (error) {
    next(error);
  }
});

router.post("/", Auth.isLoggedIn, async (req, res, next) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res.json({ error: "Name is required." });
    }
    data.tags = data.tags.split(",").map((ele) => {
      return ele.trim().toLowerCase();
    });

    const product = await Product.findOne({ name: data.name });
    if (product) {
      return res.json({ error: "Product already exists." });
    }

    const newProduct = await Product.create(data);

    await Category.findByIdAndUpdate(
      {
        _id: data.category_id,
      },
      { $push: { products: newProduct._id } }
    );
    await Collection.findOneAndUpdate(
      {
        name: data.collections,
      },
      { $push: { products: newProduct._id } }
    );

    await User.findOneAndUpdate(
      { username: newProduct.vendor },
      { $push: { listedProducts: newProduct._id } }
    );

    res.status(200).json({ product: newProduct });
  } catch (error) {
    next(error);
  }
});

router.delete("/:slug", Auth.isLoggedIn, async (req, res, next) => {
  const slug = req.params.slug;

  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(400).json({ error: "Product not found." });
    }

    const deletedProduct = await Product.findOneAndDelete({ slug });

    await Category.findByIdAndUpdate(
      {
        _id: deletedProduct.category_id,
      },
      { $pull: { products: deletedProduct._id } }
    );
    await Collection.findByIdAndUpdate(
      {
        name: deletedProduct.collections,
      },
      { $pull: { products: deletedProduct._id } }
    );

    await User.findOneAndUpdate(
      { username: deletedProduct.vendor },
      { $pull: { listedProducts: deletedProduct._id } }
    );

    return res.status(200).json({ product: deletedProduct });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
