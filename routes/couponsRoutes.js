import express from "express";
import {
  CreateCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLogin.js";
import isAdmin from "../middlewares/isAdmin.js";

const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, isAdmin, CreateCoupon);
couponsRouter.get("/AllCoupons", getAllCoupons);
couponsRouter.get("/:id", getCoupon);
couponsRouter.put("/update/:id", isLoggedIn, isAdmin, updateCoupon);
couponsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCoupon);

export default couponsRouter;
