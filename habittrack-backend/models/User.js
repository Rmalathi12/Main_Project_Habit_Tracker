// import mongoose  to define User models and schemas
const mongoose = require("mongoose");
// create schema for user name,email and password
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true, //ensures no 2 users can register with the same email
      lowercase: true, //automatically save email in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, //automatically adds createdAt and updatedAt fields
  },
);
// export User model(model name should be start with capital letter)
module.exports = mongoose.model("User", userSchema);
