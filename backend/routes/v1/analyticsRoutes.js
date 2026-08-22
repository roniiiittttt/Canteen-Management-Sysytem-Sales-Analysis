const express = require("express");

const router = express.Router();

const {
  getAnalyticsOverview,
  getSalesTrends,
  getProductAnalysis,
  getCategoryAnalysis,
  getCustomerAnalysis,
  getTimeAnalysis,
  getOperationsPayments,
  getAiAnalysis,
} = require("../../controllers/analyticsController");
const { protect, adminOnly } = require("../../middleware/authMiddleware");

router.get("/overview", protect, adminOnly, getAnalyticsOverview);
router.get("/sales-trends", protect, adminOnly, getSalesTrends);
router.get("/products", protect, adminOnly, getProductAnalysis);
router.get("/categories", protect, adminOnly, getCategoryAnalysis);
router.get("/customers", protect, adminOnly, getCustomerAnalysis);
router.get("/time-analysis", protect, adminOnly, getTimeAnalysis);
router.get("/operations-payments", protect, adminOnly, getOperationsPayments);
router.post("/ai-analysis", protect, adminOnly, getAiAnalysis);

module.exports = router;
