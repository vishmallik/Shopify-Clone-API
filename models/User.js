const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  bio: { type: String, default: null },
  image: { type: String, default: null },
  listedProducts: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
});

userSchema.pre("save", async (_req, _res, next) => {
  try {
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.SECRET)
    );
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    next(error);
  }
};

userSchema.methods.createToken = async function () {
  try {
    const payload = {
      email: this.email,
      username: this.username,
      bio: this.bio,
      image: this.image,
      _id: this._id,
    };

    const token = await jwt.sign(payload, process.env.SECRET_TOKEN);
    return token;
  } catch (error) {
    return error;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
