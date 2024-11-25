import Category from "../model/category.js";
import asyncHandler from "express-async-handler";

// @DESC   CREATE NEW CATEGORY
// @ROUTE  POST /api/v1/categories
// @ACCESS PRIVATE/ADMIN
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // CHECK IF CATEGORY EXISTS
  const categoryCheck = await Category.findOne({ name });
  if (categoryCheck) {
    throw new Error("Category already exists");
  }
  if (!req.file) {
    throw new Error("File upload failed");
  }
  // CREATE
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });
  res.json({
    status: "Success",
    message: "Category created successfully",
    category,
  });
});

// @DESC   GET ALL CATEGORIES
// @ROUTE  GET /api/v1/categories
// @ACCESS PUBLIC
export const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      status: "Success",
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @DESC   GET SINGLE CATEGORIES
// @ROUTE  GET /api/v1/categories
// @ACCESS PUBLIC
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new Error("Category not found");
  }

  res.json({
    status: "Success",
    message: "Category fetched successfully",
    category,
  });
});

// @DESC   UPDATE SINGLE CATEGORIES
// @ROUTE  update /api/v1/categories
// @ACCESS PUBLIC
export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // UPDATE
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );

  res.json({
    Status: "Successful",
    message: "Category Updated successfully",
    category,
  });
});

// @DESC   DELETE CATEGORIES
// @ROUTE  DELETE /api/v1/categories
// @ACCESS Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const deleteCategory = await Category.findByIdAndDelete(req.params.id);
  if (!deleteCategory) {
    throw new Error("Category does not exist");
  } else {
    res.json({
      status: "Success",
      message: "Category deleted successfully",
    });
  }
});
