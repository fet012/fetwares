import mongoose from "mongoose";
const Schema = mongoose.Schema;
//GENERATE RANDOM CHARACTER
const randomText = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNum = Math.floor(1000 + Math.random() * 90000);

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        type: Object,
        required: true,
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      default: randomText + randomNum,
    },
    paymentStatus: {
      type: String,
      default: "Not Paid",
    },
    paymentMethod: {
      type: String,
      default: "Not specified",
    },
    currency: {
      type: String,
      default: "Not specified",
    },
    totalPrice: {
      type: Number,
      required: true,
    },

    // FOR ADMIN
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered"],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// COMPILE TO FORM MODEL
const Order = mongoose.model("Order", orderSchema);
export default Order;
