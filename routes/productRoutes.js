import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import { isLoggedIn } from "../middlewares/isLogin.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";
const productsRouter = express.Router();
productsRouter.post(
  "/create",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  // upload.single("file"),
  createProduct
);
productsRouter.get("/get", getProducts);
productsRouter.get("/get/:id", getSingleProduct);
productsRouter.put("/update/:id", isLoggedIn, isAdmin, updateProduct);
productsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteProduct);

export default productsRouter;
