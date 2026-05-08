const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

// Database Connection
const connectDB = require("./config/db");

// Routes
const productRoutes = require("./routes/productRoutes");

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/products", productRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Zappit Backend Running");
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});