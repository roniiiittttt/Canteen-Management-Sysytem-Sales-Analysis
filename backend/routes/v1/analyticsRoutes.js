const express = require("express");

const router = express.Router();

const { getAnalyticsOverview, getSalesTrends } = require("../../controllers/analyticsController");
const { protect, adminOnly } = require("../../middleware/authMiddleware");

router.get("/overview", protect, adminOnly, getAnalyticsOverview);
router.get("/sales-trends", protect, adminOnly, getSalesTrends);

module.exports = router;
