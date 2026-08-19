const {
  parseDate,
  normalizeStatusFilter,
  validateStatusFilter,
  ALLOWED_GROUP_BY,
  getOverviewMetrics,
  getPreviousPeriodRevenue,
  calculateRevenueGrowthPercent,
  getSalesTrends: getSalesTrendRows,
  getProductAnalysis: getProductAnalysisRows,
  getCategoryAnalysis: getCategoryAnalysisRows,
} = require("../services/analyticsService");

const fillTrendBuckets = ({ startDate, endDate, groupBy, data }) => {
  const map = new Map(
    (data || []).map((row) => [
      row.date,
      {
        date: row.date,
        revenue: row.revenue || 0,
        orders: row.orders || 0,
      },
    ])
  );

  const results = [];
  const cursor = new Date(startDate);

  if (groupBy === "day") {
    while (cursor < endDate) {
      const key = cursor.toISOString().slice(0, 10);
      results.push(map.get(key) || { date: key, revenue: 0, orders: 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return results;
  }

  if (groupBy === "week") {
    while (cursor < endDate) {
      const key = cursor.toISOString().slice(0, 10);
      results.push(map.get(key) || { date: key, revenue: 0, orders: 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 7);
    }
    return results;
  }

  while (cursor < endDate) {
    const key = cursor.toISOString().slice(0, 10).slice(0, 7) + "-01";
    results.push(map.get(key) || { date: key, revenue: 0, orders: 0 });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    cursor.setUTCDate(1);
  }

  return results;
};

const getAnalyticsOverview = async (req, res) => {
  try {
    const startDate = parseDate(req.query.startDate);
    const endDate = parseDate(req.query.endDate);
    const compareTo = req.query.compareTo || "previous_period";
    const rawStatuses = req.query.status ?? req.query["status[]"];
    const statuses = normalizeStatusFilter(rawStatuses);

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Invalid startDate or endDate",
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        message: "startDate must be before endDate",
      });
    }

    const statusCheck = validateStatusFilter(statuses);
    if (!statusCheck.valid) {
      return res.status(400).json({
        message: statusCheck.message,
      });
    }

    const currentMetrics = await getOverviewMetrics({
      startDate,
      endDate,
      statuses,
    });

    let revenueGrowthPercent = 0;

    if (compareTo === "previous_period") {
      const { previousRevenue } = await getPreviousPeriodRevenue({
        startDate,
        endDate,
        statuses,
      });
      revenueGrowthPercent = calculateRevenueGrowthPercent(
        currentMetrics.totalRevenue,
        previousRevenue
      );
    }

    return res.status(200).json({
      totalRevenue: currentMetrics.totalRevenue,
      totalOrders: currentMetrics.totalOrders,
      averageOrderValue: currentMetrics.averageOrderValue,
      totalCustomers: currentMetrics.totalCustomers,
      itemsSold: currentMetrics.itemsSold,
      revenueGrowthPercent,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to load analytics overview",
    });
  }
};

const getSalesTrends = async (req, res) => {
  try {
    const startDate = parseDate(req.query.startDate);
    const endDate = parseDate(req.query.endDate);
    const groupBy = (req.query.groupBy || "day").toLowerCase();
    const rawStatuses = req.query.status ?? req.query["status[]"];
    const statuses = normalizeStatusFilter(rawStatuses);

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Invalid startDate or endDate" });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: "startDate must be before endDate" });
    }

    if (!ALLOWED_GROUP_BY.includes(groupBy)) {
      return res.status(400).json({ message: "Invalid groupBy. Use day, week, or month." });
    }

    const statusCheck = validateStatusFilter(statuses);
    if (!statusCheck.valid) {
      return res.status(400).json({ message: statusCheck.message });
    }

    const rawData = await getSalesTrendRows({ startDate, endDate, statuses, groupBy });
    const filled = fillTrendBuckets({
      startDate,
      endDate,
      groupBy,
      data: rawData,
    });

    return res.status(200).json({
      groupBy,
      data: filled,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load sales trends" });
  }
};

const getProductAnalysis = async (req, res) => {
  try {
    const startDate = parseDate(req.query.startDate);
    const endDate = parseDate(req.query.endDate);
    const rawStatuses = req.query.status ?? req.query["status[]"];
    const statuses = normalizeStatusFilter(rawStatuses);
    const limit = Number.parseInt(req.query.limit || "10", 10);

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Invalid startDate or endDate" });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: "startDate must be before endDate" });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
      return res.status(400).json({ message: "Invalid limit. Use a value between 1 and 10." });
    }

    const statusCheck = validateStatusFilter(statuses);
    if (!statusCheck.valid) {
      return res.status(400).json({ message: statusCheck.message });
    }

    const payload = await getProductAnalysisRows({
      startDate,
      endDate,
      statuses,
      limit,
    });

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load product analysis" });
  }
};

const getCategoryAnalysis = async (req, res) => {
  try {
    const startDate = parseDate(req.query.startDate);
    const endDate = parseDate(req.query.endDate);
    const rawStatuses = req.query.status ?? req.query["status[]"];
    const statuses = normalizeStatusFilter(rawStatuses);

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Invalid startDate or endDate" });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: "startDate must be before endDate" });
    }

    const statusCheck = validateStatusFilter(statuses);
    if (!statusCheck.valid) {
      return res.status(400).json({ message: statusCheck.message });
    }

    const payload = await getCategoryAnalysisRows({
      startDate,
      endDate,
      statuses,
    });

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load category analysis" });
  }
};

module.exports = {
  getAnalyticsOverview,
  getSalesTrends,
  getProductAnalysis,
  getCategoryAnalysis,
};
