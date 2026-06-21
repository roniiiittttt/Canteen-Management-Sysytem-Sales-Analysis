import { useEffect, useState } from "react";
import {
  bookTable,
  getMyBookings,
} from "../services/tableService";
import Navbar from "../components/Navbar";

function Bookings() {
  const [tableNumber, setTableNumber] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [seats, setSeats] = useState("");
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  useEffect(() => {
    fetchBookings();
    return () => {
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, [toastTimeout]);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const showNotification = (message, type = "success") => {
    if (toastTimeout) clearTimeout(toastTimeout);

    setToast({ message, type, isHiding: false });

    const timeout = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, isHiding: true } : null));
      setTimeout(() => setToast(null), 300);
    }, 2700);

    setToastTimeout(timeout);
  };

  // Helper to get formatted local date strings for min and max attributes
  const getBookingDateRange = () => {
    const today = new Date();
    
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const minDate = formatDate(today);

    const maxDateObj = new Date();
    maxDateObj.setDate(today.getDate() + 30);
    const maxDate = formatDate(maxDateObj);

    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getBookingDateRange();

  // Helper to convert 24-hour string (HH:MM) to 12-hour AM/PM string
  const formatTimeTo12Hr = (time24) => {
    if (!time24) return "";
    if (time24.includes("AM") || time24.includes("PM")) {
      return time24;
    }
    const parts = time24.split(":");
    if (parts.length < 2) return time24;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, "0");
    return `${strHours}:${minutes} ${ampm}`;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // 1. Table Number validation: Positive integer up to 15
    const tableNumInt = parseInt(tableNumber, 10);
    if (isNaN(tableNumInt) || tableNumInt < 1 || tableNumInt > 15) {
      showNotification("❌ Table Number must be a positive integer from 1 to 15.", "error");
      return;
    }

    // 2. Date validation: Today's date up to 30 days in the future
    if (!bookingDate) {
      showNotification("❌ Please select a booking date.", "error");
      return;
    }
    if (bookingDate < minDate) {
      showNotification("❌ Booking date cannot be in the past.", "error");
      return;
    }
    if (bookingDate > maxDate) {
      showNotification("❌ Booking date cannot be more than 30 days in the future.", "error");
      return;
    }

    // 3. Time validation: End time must be after start time
    if (!startTime) {
      showNotification("❌ Please select a start time.", "error");
      return;
    }
    if (!endTime) {
      showNotification("❌ Please select an end time.", "error");
      return;
    }
    if (startTime >= endTime) {
      showNotification("❌ Start time must be before end time.", "error");
      return;
    }

    // 4. Seats validation: Positive integer up to 10
    const seatsInt = parseInt(seats, 10);
    if (isNaN(seatsInt) || seatsInt < 1 || seatsInt > 10) {
      showNotification("❌ Seats must be a positive integer from 1 to 10.", "error");
      return;
    }

    try {
      await bookTable({
        tableNumber: tableNumInt,
        bookingDate,
        startTime,
        endTime,
        seats: seatsInt,
      });

      showNotification("🎉 Table Booked Successfully!", "success");

      setTableNumber("");
      setBookingDate("");
      setStartTime("");
      setEndTime("");
      setSeats("");

      fetchBookings();
    } catch (error) {
      console.log(error);
      showNotification(
        error.response?.data?.message || "❌ Booking Failed",
        "error"
      );
    }
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "#10b981"; // modern green
    if (status === "Rejected") return "#ef4444"; // modern red
    return "#f59e0b"; // modern orange
  };

  return (
    <>
      <Navbar />

      <div className="bookings-container">
        {/* Scoped CSS for modern design aesthetics */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

          .bookings-container {
            padding: 40px 30px;
            background: #f1f5f9; /* Premium cool slate grey */
            background-image: 
              radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.04) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(239, 68, 68, 0.02) 0px, transparent 50%);
            min-height: calc(100vh - 70px);
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .bookings-header-section {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          .bookings-title {
            color: #ef4444;
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .bookings-subtitle {
            color: #0f172a;
            margin-top: 50px;
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.3px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .booking-form {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 24px;
            padding: 35px;
            margin-bottom: 40px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03), 0 2px 4px -2px rgba(15, 23, 42, 0.03);
            max-width: 650px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            animation: cardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-label {
            font-weight: 600;
            color: #475569;
            font-size: 14px;
          }

          .form-input {
            width: 100%;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid #cbd5e1;
            font-size: 15px;
            font-family: inherit;
            background: #ffffff;
            color: #0f172a;
            outline: none;
            transition: all 0.25s ease;
            box-sizing: border-box;
          }

          .form-input:focus {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          .submit-btn {
            width: 100%;
            padding: 14px;
            border-radius: 14px;
            border: none;
            cursor: pointer;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            font-weight: 700;
            font-size: 16px;
            font-family: inherit;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
            transition: all 0.25s ease;
            margin-top: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
          }

          .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35);
            filter: brightness(1.03);
          }

          .submit-btn:active {
            transform: translateY(0);
          }

          .bookings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
          }

          .booking-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 22px;
            padding: 26px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03), 0 2px 4px -2px rgba(15, 23, 42, 0.03);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            gap: 14px;
            animation: cardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .booking-card:hover {
            transform: translateY(-5px);
            border-color: #ef4444;
            box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.08);
          }

          .booking-card-title {
            font-size: 19px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 12px;
          }

          .booking-details {
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 14.5px;
            color: #475569;
          }

          .booking-detail-item {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .booking-detail-icon {
            font-size: 16px;
            width: 20px;
            text-align: center;
          }

          .status-badge-container {
            margin-top: 6px;
            display: flex;
            justify-content: flex-start;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
            color: white;
          }

          .no-bookings-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 20px;
            padding: 35px;
            text-align: center;
            color: #64748b;
            font-weight: 500;
            font-size: 16px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
            max-width: 650px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .bookings-footer {
            margin-top: auto;
            text-align: center;
            padding: 30px 0 10px 0;
            border-top: 1px solid rgba(226, 232, 240, 0.8);
            width: 100%;
          }

          .footer-text {
            color: #64748b;
            font-size: 14px;
            font-weight: 500;
            margin: 0;
          }

          .footer-author {
            color: #ef4444;
            font-weight: 600;
          }

          /* Toast Notification Styles */
          .toast-notification {
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: #0f172a;
            color: #ffffff;
            padding: 16px 24px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            border: 1px solid rgba(255, 255, 255, 0.08);
            font-family: 'Outfit', sans-serif;
            animation: slideInToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .toast-notification.success {
            border-left: 5px solid #10b981;
          }

          .toast-notification.error {
            border-left: 5px solid #ef4444;
          }

          .toast-notification.hide {
            animation: slideOutToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .toast-message {
            font-weight: 600;
            font-size: 14.5px;
          }

          @keyframes cardEntrance {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInToast {
            from {
              transform: translateY(40px) scale(0.9);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }

          @keyframes slideOutToast {
            from {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            to {
              transform: translateY(20px) scale(0.95);
              opacity: 0;
            }
          }

          @media (max-width: 768px) {
            .bookings-container {
              padding: 25px 15px;
            }
            .form-row {
              grid-template-columns: 1fr;
              gap: 15px;
            }
            .bookings-grid {
              grid-template-columns: 1fr;
            }
            .booking-form {
              padding: 25px;
            }
          }
        `}</style>

        <div className="bookings-header-section">
          <h1 className="bookings-title">🪑 Table Booking</h1>

          <form onSubmit={submitHandler} className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Table Number (1 - 15)</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  placeholder="Table Number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Booking Date</label>
                <input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Number of Seats (1 - 10)</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Seats"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              <span>🪑</span> Book Table
            </button>
          </form>

          <h2 className="bookings-subtitle">📋 My Bookings</h2>

          {bookings.length === 0 ? (
            <div className="no-bookings-card">
              <span>📅</span>
              <p style={{ margin: 0 }}>No bookings found. Try reserving a table above!</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <h3 className="booking-card-title">
                    🪑 Table #{booking.tableNumber}
                  </h3>

                  <div className="booking-details">
                    <div className="booking-detail-item">
                      <span className="booking-detail-icon">📅</span>
                      <span>
                        Date:{" "}
                        {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="booking-detail-item">
                      <span className="booking-detail-icon">🕐</span>
                      <span>
                        Time: {formatTimeTo12Hr(booking.startTime)} -{" "}
                        {formatTimeTo12Hr(booking.endTime)}
                      </span>
                    </div>

                    <div className="booking-detail-item">
                      <span className="booking-detail-icon">👥</span>
                      <span>Seats: {booking.seats}</span>
                    </div>
                  </div>

                  <div className="status-badge-container">
                    <span
                      className="status-badge"
                      style={{
                        background: getStatusColor(booking.status),
                      }}
                    >
                      {booking.status === "Approved" ? "✓ Approved" : booking.status === "Rejected" ? "✗ Rejected" : "⏳ Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className={`toast-notification ${toast.type} ${
              toast.isHiding ? "hide" : ""
            }`}
          >
            <span className="toast-message">{toast.message}</span>
          </div>
        )}

        {/* Premium footer with credit */}
        <div className="bookings-footer">
          <p className="footer-text">
            Developed with love by <span className="footer-author">Ronit Chaudhari</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Bookings;