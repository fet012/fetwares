import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/userRoute.js";
import dotenv from "dotenv";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import productsRouter from "../routes/productRoutes.js";
import categoryRouter from "../routes/categoryRoute.js";
import brandRouter from "../routes/brandRoutes.js";
import colorRouter from "../routes/colorRoutes.js";
import reviewRouter from "../routes/reviewRoutes.js";
import orderRouter from "../routes/orderRoute.js";
import Stripe from "stripe";
import Order from "../model/order.js";
import couponsRouter from "../routes/couponsRoutes.js";
dotenv.config();
const app = express();

// dbConnect()
dbConnect();

// STRIPE WEBHOOK
// STRIPE INSTANCE
const stripe = new Stripe(process.env.STRIPE_API_KEY);
const endpointSecret =
  " whsec_b781eb7b794807eb9186e334b708c7e8a71b2a5d88154f795ddb47049647ca2e";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log(event);
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;

      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      console.log({
        orderId,
        paymentStatus,
        paymentMethod,
        totalAmount,
        currency,
      });
      // FIND THE ORDER
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        { new: true }
      );
      console.log(order);
    } else {
      return;
    }
    //Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntent = event.data.object;
    //     //The define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(Unhandled event type ${event.type});
    // }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// PASS INCOMING DATA
app.use(express.json());

// ROUTES
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/colors", colorRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/coupons", couponsRouter);

// ERROR MIDDLEWARE
app.use(notFound);
app.use(globalErrHandler);

export default app;
