import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminBookings() {
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
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/tables",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data);
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

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/tables/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification(`🎉 Booking successfully ${status}!`, "success");
      fetchBookings();
    } catch (error) {
      console.log(error);
      showNotification("❌ Failed to update booking status.", "error");
    }
  };

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

  const getStatusColor = (status) => {
    if (status === "Approved") return "#10b981"; // modern green
    if (status === "Rejected") return "#ef4444"; // modern red
    return "#f59e0b"; // modern orange
  };

  return (
    <>
      <Navbar />

      <div className="admin-bookings-container">
        {/* Scoped CSS for modern design aesthetics */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

          .admin-bookings-container {
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

          .admin-bookings-header-section {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          .admin-bookings-title {
            color: #ef4444;
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .admin-bookings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
          }

          .admin-booking-card {
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

          .admin-booking-card:hover {
            transform: translateY(-5px);
            border-color: #ef4444;
            box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.08);
          }

          .admin-booking-card-title {
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

          .admin-booking-details {
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 14.5px;
            color: #475569;
          }

          .admin-booking-detail-item {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .admin-booking-detail-icon {
            font-size: 16px;
            width: 20px;
            text-align: center;
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
            align-self: flex-start;
          }

          .admin-actions {
            display: flex;
            gap: 12px;
            margin-top: 10px;
            border-top: 1px solid #f1f5f9;
            padding-top: 15px;
          }

          .approve-btn {
            flex: 1;
            padding: 10px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            background: #10b981;
            color: white;
            font-weight: 700;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
          }

          .approve-btn:hover {
            background: #059669;
            transform: translateY(-1px);
          }

          .reject-btn {
            flex: 1;
            padding: 10px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            background: #ef4444;
            color: white;
            font-weight: 700;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
          }

          .reject-btn:hover {
            background: #dc2626;
            transform: translateY(-1px);
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
            max-width: 600px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .admin-bookings-footer {
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
            .admin-bookings-container {
              padding: 25px 15px;
            }
            .admin-bookings-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="admin-bookings-header-section">
          <h1 className="admin-bookings-title">🪑 Admin Bookings</h1>

          {bookings.length === 0 ? (
            <div className="no-bookings-card">
              <span>📅</span>
              <p style={{ margin: 0 }}>No bookings found in the system.</p>
            </div>
          ) : (
            <div className="admin-bookings-grid">
              {bookings.map((booking) => (
                <div key={booking._id} className="admin-booking-card">
                  <h3 className="admin-booking-card-title">
                    👤 Customer: {booking.user?.name || "Unknown"}
                  </h3>

                  <div className="admin-booking-details">
                    <div className="admin-booking-detail-item">
                      <span className="admin-booking-detail-icon">🪑</span>
                      <span>Table No: {booking.tableNumber}</span>
                    </div>

                    <div className="admin-booking-detail-item">
                      <span className="admin-booking-detail-icon">📅</span>
                      <span>
                        Date:{" "}
                        {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="admin-booking-detail-item">
                      <span className="admin-booking-detail-icon">🕐</span>
                      <span>
                        Time: {formatTimeTo12Hr(booking.startTime)} -{" "}
                        {formatTimeTo12Hr(booking.endTime)}
                      </span>
                    </div>

                    <div className="admin-booking-detail-item">
                      <span className="admin-booking-detail-icon">👥</span>
                      <span>Seats: {booking.seats}</span>
                    </div>

                    <div className="admin-booking-detail-item">
                      <span className="admin-booking-detail-icon">📌</span>
                      <span>Status:</span>
                      <span
                        className="status-badge"
                        style={{
                          background: getStatusColor(booking.status),
                          padding: "4px 12px",
                          fontSize: "12px",
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {booking.status === "Pending" && (
                    <div className="admin-actions">
                      <button
                        onClick={() => updateStatus(booking._id, "Approved")}
                        className="approve-btn"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => updateStatus(booking._id, "Rejected")}
                        className="reject-btn"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
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
        <div className="admin-bookings-footer">
          <p className="footer-text">
            Developed with love by <span className="footer-author">Ronit Chaudhari</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default AdminBookings;