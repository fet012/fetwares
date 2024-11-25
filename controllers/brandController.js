import Brand from "../model/brand.js";
import asyncHandler from "express-async-handler";

// @DESC   CREATE NEW BRAND
// @ROUTE  POST /api/v1/brands
// @ACCESS PRIVATE/ADMIN
export const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // CHECK IF BRAND EXISTS
  const brandCheck = await Brand.findOne({ name });
  if (brandCheck) {
    throw new Error("Brand already exists");
  }
  // CREATE
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "Success",
    message: "Brand created successfully",
    brand,
  });
});

// @DESC   GET ALL BRANDS
// @ROUTE  GET /api/v1/brands
// @ACCESS PUBLIC
export const getBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({
      status: "Success",
      brands,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @DESC   GET SINGLE BRANDS
// @ROUTE  GET /api/v1/brands
// @ACCESS PUBLIC
export const getBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw new Error("Brand not found");
  }

  res.json({
    status: "Success",
    message: "Brand fetched successfully",
    brand,
  });
});

// @DESC   UPDATE SINGLE BRANDS
// @ROUTE  update /api/v1/brands
// @ACCESS PUBLIC
export const updateBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // UPDATE
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );

  res.json({
    Status: "Successful",
    message: "Brand Updated successfully",
    brand,
  });
});

// @DESC   DELETE BRANDS
// @ROUTE  DELETE /api/v1/brands
// @ACCESS Private/Admin
export const deleteBrand = asyncHandler(async (req, res) => {
  const deleteBrand = await Brand.findByIdAndDelete(req.params.id);
  if (!deleteBrand) {
    throw new Error("Brand does not exist");
  } else {
    res.json({
      status: "Success",
      message: "Brand deleted successfully",
    });
  }
});
