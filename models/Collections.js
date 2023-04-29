const mongoose = require("mongoose");
const slugger = require("slugger");

const Schema = mongoose.Schema;

const CollectionSchema = new Schema(
  {
    name: { type: String, unique: true },
    slug: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

CollectionSchema.pre("save", async function (req, res, next) {
  try {
    this.slug = await slugger(this.name);
    next();
  } catch (error) {
    next(error);
  }
});

const Collection = mongoose.model("Collection", CollectionSchema);

module.exports = Collection;
