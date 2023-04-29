const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VariantSchema = new Schema(
  {
    productName: { type: String, require: true },
    size: { type: String, default: null },
    colour: { type: String, default: null },
    style: { type: String, default: null },
    material: { type: String, default: null },

    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

const Variant = mongoose.model("Variant", VariantSchema);

module.exports = Variant;
