const mongoose = require("mongoose");
const slugger = require("slugger");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: { type: String, unique: true, require: true },
    slug: { type: String },
    description: { type: String },
    image: {
      type: String,
      default:
        "https://media.istockphoto.com/vectors/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-vector-id1128826884?k=20&m=1128826884&s=612x612&w=0&h=3GMtsYpW6jmRY9L47CwA-Ou0yYIc5BXRQZmcc81MT78=",
    },
    product_status: { type: String, default: "draft" },
    vendor: { type: String },
    manufactured_in: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    cost_per_item: { type: Number },
    weight: { type: Number },
    is_taxable: { type: Boolean, default: false },
    is_physical: { type: Boolean, default: true },
    tags: [{ type: String }],
    collections: { type: String },
    category_id: { type: mongoose.Types.ObjectId, ref: "Category" },
    sku: { type: String },
    barcode: { type: String },
    has_variants: { type: Boolean, default: false },
    variants: [{ type: mongoose.Types.ObjectId, ref: "Variant" }],
  },
  { timestamps: true }
);

ProductSchema.pre("save", async function (req, res, next) {
  try {
    this.slug = slugger(this.name);
    if (this.vendor === "") {
      this.vendor = req.user.username;
    }
    console.log(req.user);

    next();
  } catch (error) {
    return next(error);
  }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
