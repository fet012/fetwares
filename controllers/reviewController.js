import asyncHandler from "express-async-handler";
import Product from "../model/product.js";
import Review from "../model/reviews.js";

// @DESC   CREATE NEW REVIEW
// @ROUTE  POST /api/v1/reviews
// @ACCESS PRIVATE/ADMIN
export const createReview = asyncHandler(async (req, res) => {
  // FIND THE PRODUCT
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new Error("This Product does not exists");
  }

  // CHECK IF USER ALREADY REVIEWED THE PRODUCT
  const existingReview = await Review.findOne({
    user: req.userAuthId,
    product: product._id,
  });
  if (existingReview) {
    return res
      .status(400)
      .json({ message: "You have already reviewed this project" });
  }
  // CREATE
  const review = await Review.create({
    user: req.userAuthId,
    message: req.body.message,
    product: product._id,
    rating: req.body.rating,
  });

  // PUSH REVIEW INTO PRODUCT-REVIEW ARRAY
  product.reviews.push(review._id);
  await product.save();
  res.json({
    status: true,
    message: "Review added successfully",
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const deletedReview = await Review.findByIdAndDelete(req.params.id);
});
