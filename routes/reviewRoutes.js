import express from "express";

import { isLoggedIn } from "../middlewares/isLogin.js";
import { createReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();
reviewRouter.post("/createReview/:id", isLoggedIn, createReview);

export default reviewRouter;
