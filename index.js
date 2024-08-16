const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Use CORS middleware to allow requests from any origin
app.use(cors());

// You can customize the CORS configuration if needed:
// app.use(cors({
//   origin: 'http://your-frontend-domain.com',  // Replace with your frontend's domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/productsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const productRoutes = require("./productRoutes");
app.use("/api", productRoutes);
