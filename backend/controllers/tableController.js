const Table = require("../models/Table");

// Book Table
const bookTable = async (req, res) => {
  try {
    const {
      tableNumber,
      bookingDate,
      startTime,
      endTime,
      seats,
    } = req.body;

    // Check same table on same date
    const existingBookings =
      await Table.find({
        tableNumber,
        bookingDate,
        status: {
          $in: ["Pending", "Approved"],
        },
      });

    // Time Conflict Check
    const isConflict =
      existingBookings.some((booking) => {
        return (
          startTime < booking.endTime &&
          endTime > booking.startTime
        );
      });

    if (isConflict) {
      return res.status(400).json({
        message:
          "Table is already booked for this time slot",
      });
    }

    const booking = await Table.create({
      user: req.user.id,
      tableNumber,
      bookingDate,
      startTime,
      endTime,
      seats,
    });

    res.status(201).json({
      message: "Table Booked Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// My Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Table.find({
      user: req.user.id,
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin Pending Bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Table.find({
      status: "Pending",
    }).populate("user", "name email");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Booking Status
const updateBookingStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const booking =
      await Table.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        message: "Booking Not Found",
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json({
      message:
        "Booking Status Updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  bookTable,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
};