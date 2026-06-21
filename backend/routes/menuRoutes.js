const express = require("express");

const router = express.Router();

const {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// Public Route
router.get("/", getMenuItems);

// Admin Only Routes
router.post("/", protect, adminOnly, addMenuItem);

router.put("/:id", protect, adminOnly, updateMenuItem);

router.delete("/:id", protect, adminOnly, deleteMenuItem);

module.exports = router;