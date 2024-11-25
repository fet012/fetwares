import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { isLoggedIn } from "../middlewares/isLogin.js";
import categoryFileUpload from "../config/categoryFileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const categoryRouter = express.Router();
categoryRouter.post(
  "/createCategory",
  isLoggedIn,
  isAdmin,
  categoryFileUpload.single("file"),
  createCategory
);
categoryRouter.get("/getCategories", getCategories);
categoryRouter.get("/getCategory/:id", getCategory);
categoryRouter.delete("/deleteCategory/:id", isLoggedIn, isAdmin, deleteCategory);
categoryRouter.put("/update/:id", isLoggedIn, isAdmin, updateCategory);

export default categoryRouter;
