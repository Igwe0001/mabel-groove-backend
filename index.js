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
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/", (req, res) => res.send("Express on Vercel"));
const productRoutes = require("./api/productRoutes");
app.use("/api", productRoutes);

// Remove this duplicate route definition
// app.get("/api/products", (req, res) => {
//   res.json({ message: "Products endpoint works!" });
// });

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ code: 500, message: "Internal Server Error", body: {} });
});

module.exports = app;
