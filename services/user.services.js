const mongoose = require('mongoose');
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const tokenService = require("../jwt/tokens.services");

const PUBLIC_FIELDS =
  "name email role year section designation department phone profileImage createdAt updatedAt";

const buildUpdates = (data, allowedFields) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("At least one valid field is required");
  }

  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("At least one valid field is required");
  }

  return updates;
};

const registerUser = async (data) => {
  const { name, email, password, role = "Student" } = data;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters");
  }

  if (!["Student", "Teacher"].includes(role)) {
    throw new Error("Invalid role");
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    ...data,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
  });

  return User.findById(user._id).select(PUBLIC_FIELDS);
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = tokenService.generateToken(
    {
      id: user._id.toString(),
      role: user.role,
    },
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getAllStudents = async () => {
  return User.find({ role: "Student" }).select(PUBLIC_FIELDS);
};

const getStudentById = async (id) => {
  return User.findOne({
    _id: id,
    role: "Student",
  }).select(PUBLIC_FIELDS);
};

const getAllTeachers = async () => {
  return User.find({ role: "Teacher" }).select(PUBLIC_FIELDS);
};

const getTeacherById = async (id) => {
  return User.findOne({
    _id: id,
    role: "Teacher",
  }).select(PUBLIC_FIELDS);
};

const updateProfile = async (userId, data) => {
  const allowedFields = [
    "name",
    "phone",
    "department",
    "year",
    "section",
    "designation",
    "profileImage",
  ];

  const updates = buildUpdates(data, allowedFields);

  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select(PUBLIC_FIELDS);
};

const updateStudent = async (userId, data) => {
  const allowedFields = [
    "name",
    "email",
    "phone",
    "department",
    "year",
    "section",
    "profileImage",
  ];

  const updates = buildUpdates(data, allowedFields);

  if (updates.email !== undefined) {
    updates.email = updates.email.toLowerCase().trim();
  }

  return User.findOneAndUpdate(
    { _id: userId, role: "Student" },
    updates,
    { new: true, runValidators: true }
  ).select(PUBLIC_FIELDS);
};

module.exports = {
  registerUser,
  loginUser,
  getAllStudents,
  getStudentById,
  getAllTeachers,
  getTeacherById,
  updateProfile,
  updateStudent,
};
