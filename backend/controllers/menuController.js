const Menu = require("../models/Menu");

// Add Menu Item
const addMenuItem = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      image,
    } = req.body;

    const item = await Menu.create({
      name,
      price,
      category,
      description,
      image,
    });

    res.status(201).json({
      message: "Menu Item Added",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Menu Items
const getMenuItems = async (req, res) => {
  try {
    const items = await Menu.find();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Menu Item
const updateMenuItem = async (req, res) => {
  try {
    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Menu Item Updated",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Menu Item
const deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Menu Item Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
};