
import asyncHandler from "express-async-handler";
import Color from "../model/color.js";

// @DESC   CREATE NEW COLOR
// @ROUTE  POST /api/v1/colors
// @ACCESS PRIVATE/ADMIN
export const createColor = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // CHECK IF COLOR EXISTS
  const colorCheck = await Color.findOne({ name });
  if (colorCheck) {
    throw new Error("Color already exists");
  }
  // CREATE
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "Success",
    message: "Color created successfully",
    color,
  });
});

// @DESC   GET ALL COLORS
// @ROUTE  GET /api/v1/colors
// @ACCESS PUBLIC
export const getColors = asyncHandler(async (req, res) => {
  try {
    const color = await Color.find();
    res.json({
      status: "Success",
      color,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @DESC   GET SINGLE COLOR
// @ROUTE  GET /api/v1/colors
// @ACCESS PUBLIC
export const getColor = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (!color) {
    throw new Error("Color not found");
  }

  res.json({
    status: "Success",
    message: "Color fetched successfully",
    color,
  });
});

// @DESC   UPDATE SINGLE COLOR
// @ROUTE  update /api/v1/color
// @ACCESS PUBLIC
export const updateColor = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // UPDATE
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );

  res.json({
    Status: "Successful",
    message: " Color updated successfully",
    color,
  });
});

// @DESC   DELETE COLOR
// @ROUTE  DELETE /api/v1/COLOR
// @ACCESS Private/Admin
export const deleteColor = asyncHandler(async (req, res) => {
  const deleteColor = await Color.findByIdAndDelete(req.params.id);
  if (!deleteColor) {
    throw new Err("Color does not exist");
  } else {
    res.json({
      status: "Success",
      message: "Color deleted successfully",
    });
  }
});
