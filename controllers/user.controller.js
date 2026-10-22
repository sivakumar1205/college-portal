const userService = require("../services/user.services");

const handleError = (res, error) => {
  if (error.name === "CastError" || error.name === "BSONError") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "Email or ID already exists" });
  }

  const knownErrors = [
    "Name, email and password are required",
    "Password must contain at least 8 characters",
    "Invalid role",
    "Email already registered",
    "Email and password are required",
    "Invalid email or password",
    "At least one valid field is required",
  ];

  if (knownErrors.includes(error.message)) {
    const status = error.message === "Email already registered" ? 409 : 400;
    return res.status(status).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

const sendResult = (res, data, message = "Success") => {
  if (!data) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message, data });
};

exports.signup = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    return res.status(201).json({
      message: "Signup successful",
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.login = async (req, res) => {
  try {
    const result = await userService.loginUser(
      req.body.email,
      req.body.password
    );

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudents();
    return res.status(200).json({ data: students });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await userService.getStudentById(req.params.id);
    return sendResult(res, student);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await userService.getAllTeachers();
    return res.status(200).json({ data: teachers });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await userService.getTeacherById(req.params.id);
    return sendResult(res, teacher);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(
      req.user.id,
      req.body
    );

    return sendResult(res, user, "Profile updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await userService.updateStudent(
      req.params.id,
      req.body
    );

    return sendResult(res, student, "Student updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
};
