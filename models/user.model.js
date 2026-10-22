
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["Student", "Teacher"],
      required: true,
      default: "Student",
    },

    year: {
      type: Number,
      min: 1,
      max: 4,
    },

    section: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },
    
    isActive: {
        type: Boolean,
        default: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
