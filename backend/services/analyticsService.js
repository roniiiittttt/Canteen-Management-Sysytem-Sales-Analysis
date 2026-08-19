const Order = require("../models/Order");

const ALLOWED_STATUSES = ["Delivered"];
const ALLOWED_GROUP_BY = ["day", "week", "month"];

const parseDate = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const normalizeStatusFilter = (status) => {
  if (Array.isArray(status)) {
    return status.length > 0 ? status : ALLOWED_STATUSES;
  }

  if (typeof status === "string" && status.trim()) {
    return [status.trim()];
  }

  return ALLOWED_STATUSES;
};

const validateStatusFilter = (statuses) => {
  const invalid = statuses.filter((status) => !ALLOWED_STATUSES.includes(status));
  if (invalid.length > 0) {
    return {
      valid: false,
      message: `Unsupported status filter(s): ${invalid.join(", ")}`,
    };
  }

  return { valid: true };
};

const buildMatchStage = ({ startDate, endDate, statuses }) => ({
  createdAt: {
    $gte: startDate,
    $lt: endDate,
  },
  status: { $in: statuses },
});

const buildOverviewPipeline = ({ startDate, endDate, statuses }) => [
  { $match: buildMatchStage({ startDate, endDate, statuses }) },
  {
    $facet: {
      revenueAndCounts: [
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
            totalCustomersSet: { $addToSet: "$user" },
          },
        },
        {
          $project: {
            _id: 0,
            totalRevenue: 1,
            totalOrders: 1,
            totalCustomers: { $size: "$totalCustomersSet" },
          },
        },
      ],
      itemsSold: [
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            itemsSold: { $sum: "$items.quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            itemsSold: 1,
          },
        },
      ],
    },
  },
  {
    $project: {
      revenueAndCounts: { $ifNull: [{ $arrayElemAt: ["$revenueAndCounts", 0] }, {}] },
      itemsSold: { $ifNull: [{ $arrayElemAt: ["$itemsSold", 0] }, { itemsSold: 0 }] },
    },
  },
];

const buildRevenueOnlyPipeline = ({ startDate, endDate, statuses }) => [
  { $match: buildMatchStage({ startDate, endDate, statuses }) },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalAmount" },
    },
  },
  {
    $project: {
      _id: 0,
      totalRevenue: 1,
    },
  },
];

const buildTrendsPipeline = ({ startDate, endDate, statuses, groupBy }) => [
  { $match: buildMatchStage({ startDate, endDate, statuses }) },
  {
    $project: {
      totalAmount: 1,
      createdAt: 1,
      items: 1,
      bucket: {
        $dateTrunc: {
          date: "$createdAt",
          unit: groupBy,
          timezone: "Asia/Kolkata",
        },
      },
    },
  },
  {
    $group: {
      _id: "$bucket",
      revenue: { $sum: "$totalAmount" },
      orders: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      date: {
        $dateToString: {
          date: "$_id",
          format: "%Y-%m-%d",
          timezone: "Asia/Kolkata",
        },
      },
      revenue: 1,
      orders: 1,
    },
  },
  { $sort: { date: 1 } },
];

const getOverviewMetrics = async ({ startDate, endDate, statuses }) => {
  const [result] = await Order.aggregate(
    buildOverviewPipeline({ startDate, endDate, statuses })
  );

  const overview = result || {};
  const revenueAndCounts = overview.revenueAndCounts || {};
  const itemsSold = overview.itemsSold || {};

  const totalRevenue = revenueAndCounts.totalRevenue || 0;
  const totalOrders = revenueAndCounts.totalOrders || 0;
  const totalCustomers = revenueAndCounts.totalCustomers || 0;
  const totalItemsSold = itemsSold.itemsSold || 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    totalCustomers,
    itemsSold: totalItemsSold,
  };
};

const getPreviousPeriodRevenue = async ({ startDate, endDate, statuses }) => {
  const durationMs = endDate.getTime() - startDate.getTime();
  const previousEnd = new Date(startDate.getTime());
  const previousStart = new Date(startDate.getTime() - durationMs);

  const [result] = await Order.aggregate(
    buildRevenueOnlyPipeline({
      startDate: previousStart,
      endDate: previousEnd,
      statuses,
    })
  );

  return {
    previousRevenue: result?.totalRevenue || 0,
    previousStart,
    previousEnd,
  };
};

const calculateRevenueGrowthPercent = (currentRevenue, previousRevenue) => {
  if (previousRevenue === 0) {
    return currentRevenue > 0 ? 100 : 0;
  }

  return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
};

const getSalesTrends = async ({ startDate, endDate, statuses, groupBy }) => {
  const rows = await Order.aggregate(
    buildTrendsPipeline({ startDate, endDate, statuses, groupBy })
  );

  return rows;
};

module.exports = {
  parseDate,
  normalizeStatusFilter,
  validateStatusFilter,
  getOverviewMetrics,
  getPreviousPeriodRevenue,
  calculateRevenueGrowthPercent,
  getSalesTrends,
  ALLOWED_STATUSES,
  ALLOWED_GROUP_BY,
};
