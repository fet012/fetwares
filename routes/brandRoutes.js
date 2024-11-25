import express from "express";

import { isLoggedIn } from "../middlewares/isLogin.js";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "../controllers/brandController.js";
import isAdmin from "../middlewares/isAdmin.js";

const brandRouter = express.Router();
brandRouter.post("/createBrand", isLoggedIn, isAdmin, createBrand);
brandRouter.get("/getBrands", getBrands);
brandRouter.get("/getBrand/:id", getBrand);
brandRouter.delete("/deleteBrand/:id", isLoggedIn, isAdmin, deleteBrand);
brandRouter.put("/update/:id", isLoggedIn, isAdmin, updateBrand);

export default brandRouter;
