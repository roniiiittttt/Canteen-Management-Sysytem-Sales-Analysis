const Cart = require("../models/Cart");
const Menu = require("../models/Menu");

// Add To Cart
const addToCart = async (req, res) => {
  try {
    const { menuItem } = req.body;

    const itemExists = await Menu.findById(
      menuItem
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Menu Item Not Found",
      });
    }

    const existingItem = await Cart.findOne({
      user: req.user.id,
      menuItem,
    });

    if (existingItem) {
      existingItem.quantity += 1;

      await existingItem.save();

      return res.status(200).json({
        message: "Quantity Updated",
        cartItem: existingItem,
      });
    }

    const cartItem = await Cart.create({
      user: req.user.id,
      menuItem,
      quantity: 1,
    });

    res.status(201).json({
      message: "Item Added To Cart",
      cartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Increase Quantity
const increaseQuantity = async (
  req,
  res
) => {
  try {
    const item = await Cart.findById(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        message: "Cart Item Not Found",
      });
    }

    item.quantity += 1;

    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Decrease Quantity
const decreaseQuantity = async (
  req,
  res
) => {
  try {
    const item = await Cart.findById(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        message: "Cart Item Not Found",
      });
    }

    if (item.quantity === 1) {
      await Cart.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        message: "Item Removed",
      });
    }

    item.quantity -= 1;

    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// View Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user.id,
    }).populate("menuItem");

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Cart Item
const removeCartItem = async (
  req,
  res
) => {
  try {
    await Cart.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Cart Item Removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
};