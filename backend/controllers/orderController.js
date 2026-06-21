const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Place Order
const placeOrder = async (req, res) => {
  try {
    const {
      paymentMethod = "Cash",
      transactionId = "",
    } = req.body;

    const allowedPaymentMethods = [
      "Cash",
      "UPI",
      "Card",
    ];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("menuItem");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is Empty",
      });
    }

    let totalAmount = 0;

    const orderItems = cartItems.map((item) => {
      totalAmount +=
        item.menuItem.price * item.quantity;

      return {
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus:
        paymentMethod === "Cash" ? "Pending" : "Paid",
      transactionId:
        paymentMethod === "Cash" ? "" : transactionId,
    });

    await Cart.deleteMany({
      user: req.user.id,
    });

    res.status(201).json({
      message: "Order Placed Successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).populate("items.menuItem");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Orders (Admin)
// Delivered orders will NOT be shown
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: {
        $ne: "Delivered",
      },
    })
      .populate("user", "name email")
      .populate("items.menuItem");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Payments (Admin)
const getAllPayments = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    order.status = status;

    if (status === "Delivered" && order.paymentMethod === "Cash") {
      order.paymentStatus = "Paid";
    }

    await order.save();

    res.status(200).json({
      message: "Order Status Updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getAllPayments,
  updateOrderStatus,
};
