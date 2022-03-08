const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  tagline: {
    type: String,
    required: false,
    default: "This is a Default Tagline",
  },
  avatar: {
    type: String,
    required: false,
    default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
  },
  openSeaAcctLink: {
    type: String,
    required: false,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
