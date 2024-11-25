import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateToken } from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc   Register User
// @route  POST /api/v1/users/register
// @access Private/Admin
export const registeredUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  //CHECK IF USER EXISTS
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // CREATE THE USER
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "Successfull",
    message: "User registered successfully",
    data: user,
  });
});

// @desc   Login User
// @route  GET /api/v1/users/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //FIND THE USER IN THE DB
  const userFound = await User.findOne({
    email,
  });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "success",
      message: "User Login successfully",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid Login credentials");
  }
});

// @desc   GET USER PROFILE
// @route  GET /api/v1/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "Success",
    message: "User profile fetched successfully",
    user,
  });
});

// @desc   DELETE USER PROFILE
// @route  GET /api/v1/users/delete
// @access Private
export const updateShippingAddress = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, province, phone } =
    req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "successful",
    message: "User shipping address updated successfully",
    user,
  });
});
