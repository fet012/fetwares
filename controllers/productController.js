import asyncHandler from "express-async-handler";
import Product from "../model/product.js";
import Category from "../model/category.js";
import Brand from "../model/brand.js";

// @desc   CREATE NEW PROJECT
// @route  POST /api/v1/products
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
  
  const convertedImgs = req.files.map((file) => file.path);
  console.log(convertedImgs);
  const {
    name,
    description,
    category,
    sizes,
    colors,
    price,
    totalQty,
    brand,
  } = req.body;
  const productExist = await Product.findOne({ name });
  if (productExist) {
    throw new Error("Product already exists");
  }

  // FIND THE CATEGORY
  const categoryFound = await Category.findOne({
    name: category,
  });

  if (!categoryFound) {
    throw new Error("Category not found");
  }

  // FIND THE BRAND
  const brandFound = await Brand.findOne({
    name: brand.toLowerCase(),
  });

  if (!brandFound) {
    throw new Error("Brand not found");
  }
  // CREATE THE PRODUCT
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertedImgs,
  });

  // PUSH PRODUCTS INTO CATEGORY
  categoryFound.products.push(product._id);
  await categoryFound.save();

  // PUSH PRODUCTS INTO BRAND
  brandFound.products.push(product._id);
  await brandFound.save();
  res.json({
    status: "success",
    message: " Product created successfully",
    product,
  });
});

// @desc   GET ALL PRODUCTS
// @route  GET /api/v1/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
  // QUERY
  let productQuery = Product.find();

  // FILTER BY NAME
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  // FILTER BY BRAND
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  // FILTER BY CATEGORY
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  // FILTER BY COLOR
  if (req.query.color) {
    productQuery = productQuery.find({
      color: { $regex: req.query.color, $options: "i" },
    });
  }

  // FILTER BY SIZES
  if (req.query.sizes) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: "i" },
    });
  }

  // FILTER BY PRICE RANGE
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    // GTE : GREATER OR EQUAL
    // LTE : LESSER OR EQUAL
    productQuery = productQuery.find({
      price: {
        $gte: priceRange[0],
        $lte: priceRange[1],
      },
    });
  }

  // PAGINATION
  // PAGE
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

  // LIMIT
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  // STARTINDEX
  const startIndex = (page - 1) * limit;

  // END IDX
  const endIndex = page * limit;

  // TOTAL
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  // PAGINATION RESULTS
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
    };
  }

  // AWAIT THE QUERY
  const products = await productQuery;

  res.json({
    status: "success",
    total,
    results: products.length,
    message: " Products fetched successfully",
    pagination,
    products,
  });
});

// @desc   GET SINGLE PRODUCT
// @route  GET /api/v1/products/:id
// @access Public
export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new Error("Product not Found");
  }
  res.json({
    status: "Success",
    message: "Product fetched successfully",
    product,
  });
});

// @desc   UPDATE PRODUCT
// @route  PUT/api/v1/products/:id/update
// @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  // UPDATE
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    { new: true }
  );

  res.json({
    Status: "Successful",
    message: "Product Updated successfully",
    product,
  });
});

// @desc   DELETE PRODUCT
// @route  delete/api/v1/products/:id/delete
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new Error("Product does not exist");
  } else {
    res.json({
      status: "Success",
      message: "Product deleted successfully",
    });
  }
});
