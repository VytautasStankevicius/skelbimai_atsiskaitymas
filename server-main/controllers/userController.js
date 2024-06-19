const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Ad = require("../models/adModel");
const Comment = require("../models/commentModel");

//Vartotojo registracija
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//Vartotojo prisijungimas
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

//Vartotojas pagal ID
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Visi vartotojai
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//Vartotojo trinimas pagal ID
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  try {
    // Trinam skelbimus ir komentarus susijusius su vartotoju
    await Ad.deleteMany({ user: user._id });
    await Comment.deleteMany({ user: user._id });

    // Istrinam vartotoja
    await User.deleteOne({ _id: user._id });

    res.json({ message: "User removed" });
  } catch (error) {
    console.error("Error while deleting user:", error);
    res
      .status(500)
      .json({ message: "Error while deleting user", error: error.message });
  }
});

//Gaunam visus palaikintus skelbimus nurodyto autentikuoto vartotojo
const getUserLikes = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("likes");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user.likes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  deleteUser,
  getUserLikes,
};
