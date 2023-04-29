const mongoose = require("mongoose");
const slugger = require("slugger");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, unique: true },
  slug: { type: String },
  tax_percentage: { type: Number, default: 18 },
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
});

CategorySchema.pre("save", async (_req, _res, next) => {
  try {
    this.slug = await slugger(this.name);
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
