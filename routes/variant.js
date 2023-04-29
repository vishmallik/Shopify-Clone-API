const express = require("express");

const Auth = require("../middlewares/Auth");
const Product = require("../models/Product");
const Variant = require("../models/Variant");

var router = express.Router();

router.get("/", Auth.isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const variants = await Variant.find({ createdBy: userId });

    res.json({ variants });
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", Auth.isLoggedIn, async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId).populate("variants");

    res.json({ variants: product.variants });
  } catch (error) {
    next(error);
  }
});

router.post("/", Auth.isLoggedIn, async (req, res, next) => {
  try {
    const data = req.body;
    const preVariant = await Variant.findOne(data);
    if (preVariant) {
      return res.json({ error: "This variant is already present." });
    }
    const product = await Product.findOne({ name: data.productName });
    if (!product) {
      return res.json({ error: "Can't find product" });
    }
    data.product = product._id;
    data.createdBy = req.user._id;

    const variant = await Variant.create(data);

    await Product.findOneAndUpdate(
      { name: variant.productName },
      { $push: { variants: variant._id } }
    );

    return res.status(200).json({ variant });
  } catch (error) {
    next(error);
  }
});

router.delete("/remove/:id", Auth.isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;

    const variant = await Variant.findById(id);
    if (!variant) {
      return res.json({ error: "Variant not found" });
    }

    const deletedVariant = await Variant.findByIdAndDelete(id);

    await Product.findOneAndUpdate(
      { name: deletedVariant.productName },
      { $pull: { variants: deletedVariant._id } }
    );

    return res.status(200).json({ variant: deletedVariant });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
