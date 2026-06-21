const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cartController");

const {
  protect,
} = require("../middleware/authMiddleware");

// Add Item
router.post("/add", protect, addToCart);

// Get Cart
router.get("/", protect, getCart);

// Increase Quantity
router.put(
  "/increase/:id",
  protect,
  increaseQuantity
);

// Decrease Quantity
router.put(
  "/decrease/:id",
  protect,
  decreaseQuantity
);

// Remove Item
router.delete(
  "/:id",
  protect,
  removeCartItem
);

module.exports = router;