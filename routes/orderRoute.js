import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderStatistics,
  getSingleOrder,
  updateOrder,
} from "../controllers/orderController.js";
import { isLoggedIn } from "../middlewares/isLogin.js";
const orderRouter = express.Router();

//
orderRouter.post("/createOrder", isLoggedIn, createOrder);
orderRouter.get("/allOrders", isLoggedIn, getAllOrders);
orderRouter.get("/order/:id", isLoggedIn, getSingleOrder);
orderRouter.put("/update/:id", isLoggedIn, updateOrder);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatistics);
export default orderRouter;
