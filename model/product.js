import mongoose from "mongoose";
// import User from "./User";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: " Category",
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["S", "N", "L", "XL", "XXL"],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [
      {
        type: String,
        default: " https://via.placeholder.com/150",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,

      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
//VIRTUALS

// QTY LEFT
ProductSchema.virtual("qtyLeft").get(function () {
  const product = this;
  return product.totalQty - product.totalSold;
});

//TOTAL RATING
ProductSchema.virtual("totalReviews").get(function () {
  const product = this;
  return product?.reviews.length;
});
// AVERAGE RATING
ProductSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) return 0;

  let ratingsTotal = 0;
  const product = this;
  product?.reviews?.forEach((review) => {
    ratingsTotal += review?.rating;
  });
  // CALC AVERAGE RATING
  const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(
    1
  );
  return averageRating;
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
