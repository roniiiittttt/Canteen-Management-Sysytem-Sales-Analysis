const express = require("express");

const router = express.Router();

const analyticsRoutes = require("./v1/analyticsRoutes");

router.use("/analytics", analyticsRoutes);

module.exports = router;
