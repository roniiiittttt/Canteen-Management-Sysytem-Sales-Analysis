const express = require("express");

const router = express.Router();

const {
  getAnalyticsOverview,
  getSalesTrends,
  getProductAnalysis,
  getCategoryAnalysis,
} = require("../../controllers/analyticsController");
const { protect, adminOnly } = require("../../middleware/authMiddleware");

router.get("/overview", protect, adminOnly, getAnalyticsOverview);
router.get("/sales-trends", protect, adminOnly, getSalesTrends);
router.get("/products", protect, adminOnly, getProductAnalysis);
router.get("/categories", protect, adminOnly, getCategoryAnalysis);

module.exports = router;
