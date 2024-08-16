const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewName: String,
  reviewEmail: String,
  reviewComments: String,
  reviewRating: { type: Number, min: 1, max: 5 },
});

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productShortDescription: String,
  productFullDescription: String,
  productImageUrl: String,
  productReviewImageUrl: String,
  productReviews: [reviewSchema],
});

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id; // rename _id to id
    delete ret._id; // remove _id
    delete ret.__v; // remove __v
    return ret;
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
