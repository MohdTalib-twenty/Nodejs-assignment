const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is Require"],
    },
    email: {
      type: String,
      required: [true, "Email is Require"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is Require"],
      minLength: [6, "Password length should be greather than 6"],
      select : true
    },
    resetPasswordToken : String,
    resetPasswordExpire : String
  },
  { timestamps: true }
);
userSchema.pre("save", async function () {
  if(!this.isModified)return ;
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

module.exports = new mongoose.model("User", userSchema);
