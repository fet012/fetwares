import express from "express";

import { isLoggedIn } from "../middlewares/isLogin.js";
import {
  updateColor,
  createColor,
  deleteColor,
  getColor,
  getColors,
} from "../controllers/colorController.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorRouter = express.Router();
colorRouter.post("/createColor", isLoggedIn, isAdmin, createColor);
colorRouter.get("/getColor", getColors);
colorRouter.get("/getColor/:id", getColor);
colorRouter.delete("/deleteColor/:id", isLoggedIn, isAdmin, deleteColor);
colorRouter.put("/update/:id", isLoggedIn, isAdmin, updateColor);

export default colorRouter;
