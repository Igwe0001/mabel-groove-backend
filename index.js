require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Update all products to add the productPricing field with default values
    await mongoose.connection.db
      .collection("products")
      .updateMany(
        { productPricing: { $exists: false } },
        {
          $set: {
            "productPricing.pricingDetails": "",
            "productPricing.pricingType": "",
            "productPricing.pricingOutTurn": "",
            "productPricing.pricingCount": "",
            "productPricing.pricingMoisture": "",
            "productPricing.pricingDefective": "",
          },
        }
      )
      .then((result) => {
        console.log(
          `Updated ${result.modifiedCount} documents with productPricing`
        );
      })
      .catch((err) => {
        console.error("Error updating documents:", err);
      });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(10000);
  });

// If you need to customize CORS settings, uncomment and configure the following:
app.use(
  cors({
    origin: [
      process.env.LOCALHOST_ORIGIN_URL,
      process.env.WEBSITE_ORIGIN_URL,
      process.env.TEST_WEBSITE_ORIGIN_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.listen(1711, () => {
  console.log("Server is running on port 1711");
});

app.get("/", (req, res) => res.send("Express on Vercel"));
const productRoutes = require("./api/productRoutes");
app.use("/api", productRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ code: 500, message: "Internal Server Error", body: {} });
  next(err); // Pass the error to the next middleware function
});

module.exports = app;
