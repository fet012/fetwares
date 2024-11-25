import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import User from "../model/User.js";
import Order from "../model/order.js";
import Product from "../model/product.js";
import Stripe from "stripe";
import Coupon from "../model/coupon.js";
// STRIPE INSTANCE
const stripe = new Stripe(process.env.STRIPE_kEY);

// @DESC CREATE ORDERS
// @ROUTE POST api/v1/orders
// @access private

export const createOrder = asyncHandler(async (req, res) => {
  // GET THE COUPON
  const { coupon } = req?.query;
  console.log(req.query);
  // CONVERT COUPON TO UPPERCASE
  const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });
  if (couponFound?.isExpired) {
    throw new Error("Coupon has expired");
  }
  if (!couponFound) {
    throw new Error("Coupon does not exist");
  }
  // GET THE DISCOUNT
  const discount = couponFound?.discount / 100;

  // FIND THE USER
  const user = await User.findById(req.userAuthId);

  // GET THE PAYLOAD(CUSTOMER, ORDERITEMS, SHIPPING ADDRESS, TOTALPRICE)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  // CHECK  IF USER HAS NONE
  if (!user?.hasShippingAddress) {
    throw new Error("Provide a shipping address");
  }
  if (orderItems?.length <= 0) {
    // CHECK IF ORDER IS NOT EMPTY
    throw new Error("No ordered Items");
  }
  // PLACE/CREATE ORDER =>  SAVE TO DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });
  console.log(order);

  // UPDATE THE PRODUCT
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //PUSH ORDER INTO USER
  user.orders.push(order?._id);
  await user.save();

  // MAKE PAYMENT(STRIPE)
  // CONVERT ORDER ITEMS TO HAVE SAME STRUCTURE WITH STRIPE
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send({ url: session.url });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  // FIND ALL ORDERS
  const orders = await Order.find();
  res.json({
    success: true,
    message: "All Orders",
    orders,
  });
});

export const getSingleOrder = asyncHandler(async (req, res) => {
  // FIND SINGLE ORDERS
  const order = await Order.findById(req.params.id);
  res.json({
    success: true,
    message: "Single Order",
    order,
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // UPDATE
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.json({
    success: true,
    message: "Order Updated",
    updatedOrder,
  });
});

export const getOrderStatistics = asyncHandler(async (req, res) => {
  // GET ORDER STATISTICS
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maximumSale: {
          $max: "$totalPrice",
        },
        averageSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  // GET THE DATE
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const salesToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    salesToday,
  });
});
