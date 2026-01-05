const express = require("express");
const app = express();
const path = require("path");
require('dotenv').config();
const inventoryRouter = require("./routes/inventoryRouter");
const itemRouter = require("./routes/itemRouter");

// 1. Setup View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 2. Middleware
app.use(express.urlencoded({ extended: true })); // To parse form data later
app.use(express.static(path.join(__dirname, "public"))); // For CSS
app.use("/categories", inventoryRouter);
app.use("/items", itemRouter);

// 3. Basic Route (We will move this to a routes file later)
app.get("/", (req, res) => {
  res.render("index", { title: "Inventory Home" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));