const express = require("express");

const router = express.Router();

const {
  bookTable,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/tableController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// Customer Routes
router.post("/book", protect, bookTable);
router.get("/mybookings", protect, getMyBookings);

// Admin Routes
router.get("/", protect, adminOnly, getAllBookings);
router.put("/:id", protect, adminOnly, updateBookingStatus);

module.exports = router;