import express from "express";
import {
  getUserProfile,
  loginUser,
  registeredUserCtrl,
  updateShippingAddress,
} from "../controllers/UserController.js";
import { isLoggedIn } from "../middlewares/isLogin.js";

const userRoutes = express.Router();

userRoutes.post("/register", registeredUserCtrl);
userRoutes.post("/login", loginUser);
userRoutes.get("/profile", isLoggedIn, getUserProfile);
userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddress);

export default userRoutes;
