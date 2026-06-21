const User = require("../models/User");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Table = require("../models/Table");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalMenuItems = await Menu.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const approvedBookings = await Table.countDocuments({
      status: "Approved",
    });

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.status(200).json({
      totalUsers,
      totalMenuItems,
      totalOrders,
      pendingOrders,
      approvedBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};