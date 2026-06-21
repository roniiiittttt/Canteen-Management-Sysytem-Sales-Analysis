  const express = require("express");

  const router = express.Router();

  const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getAllPayments,
    updateOrderStatus,
  } = require("../controllers/orderController");

  const {
    protect,
    adminOnly,
  } = require("../middleware/authMiddleware");

  // Customer Routes
  router.post("/", protect, placeOrder);
  router.get("/myorders", protect, getMyOrders);

  // Admin Routes
  router.get("/", protect, adminOnly, getAllOrders);
  router.get("/payments", protect, adminOnly, getAllPayments);
  router.put("/:id", protect, adminOnly, updateOrderStatus);

  module.exports = router;
