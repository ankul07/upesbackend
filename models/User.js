const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};
module.exports = mongoose.model("User", UserSchema);
