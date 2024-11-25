import Coupon from "../model/coupon.js";
import asyncHandler from "express-async-handler";

export const CreateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // CHECK IF USER IS ADMIN
  // CHECK IF COUPON ALREADY EXIST

  const CouponExist = await Coupon.findOne({ code });
  if (CouponExist) {
    throw new Error("Coupon already Exists");
  }
  // CHECK IF DISCOUNT IS A NUMBER
  if (isNaN(discount)) {
    throw new Error("Discount value must be a number");
  }
  // CREATE COUPON
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  // SEND THE RESPONSE
  res.status(201).json({
    status: "Success",
    msg: "Coupon created successfully",
    coupon,
  });
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.json({
    status: "Success",
    message: "Coupon fetched successfully",
    coupon,
  });
});
export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Coupon deleted successfully",
  });
});
