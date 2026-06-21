import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  useEffect(() => {
    fetchOrders();
    return () => {
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, [toastTimeout]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const showNotification = (message, type = "success") => {
    if (toastTimeout) clearTimeout(toastTimeout);

    setToast({ message, type, isHiding: false });

    const timeout = setTimeout(() => {
      setToast(prev => prev ? { ...prev, isHiding: true } : null);
      setTimeout(() => setToast(null), 300);
    }, 2700);

    setToastTimeout(timeout);
  };

  const updateStatus = async (id, status, customerName) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification(`✅ Order status for ${customerName || "Customer"} updated to "${status}"!`, "success");
      fetchOrders();
    } catch (error) {
      showNotification("❌ Failed to update status.", "error");
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#ef4444";
      case "Preparing":
        return "#f59e0b";
      case "Ready":
        return "#10b981";
      case "Delivered":
        return "#16a34a";
      default:
        return "#64748b";
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-orders-container">
        {/* Scoped CSS for layout, cards, animations, and toast */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
          
          .admin-orders-container {
            padding: 40px 30px;
            background: #f1f5f9; /* Premium slate gray */
            background-image: 
              radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.04) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(239, 68, 68, 0.02) 0px, transparent 50%);
            min-height: calc(100vh - 70px);
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
          }

          .admin-title {
            text-align: center;
            color: #ef4444;
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          .no-orders-card {
            text-align: center;
            padding: 60px 40px;
            background: #ffffff;
            border-radius: 24px;
            border: 1px solid rgba(226, 232, 240, 0.8);
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .no-orders-card h2 {
            margin: 0;
            color: #64748b;
            font-size: 22px;
            font-weight: 600;
          }

          .order-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 22px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03), 0 2px 4px -2px rgba(15, 23, 42, 0.03);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-sizing: border-box;
          }

          .order-card:hover {
            transform: translateY(-4px);
            border-color: #ef4444;
            box-shadow: 0 15px 30px -10px rgba(239, 68, 68, 0.08);
          }

          .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 15px;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
          }

          .customer-name {
            color: #0f172a;
            font-size: 20px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.3px;
          }

          .status-badge {
            color: white;
            padding: 8px 18px;
            border-radius: 99px;
            font-weight: 700;
            font-size: 13px;
            display: inline-block;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }

          .order-total {
            color: #ef4444;
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 20px 0;
          }

          .order-total-label {
            color: #0f172a;
            font-weight: 600;
            margin-right: 6px;
          }

          .payment-summary {
            color: #475569;
            font-size: 14px;
            font-weight: 600;
            margin: -8px 0 20px 0;
          }

          .payment-status {
            color: #10b981;
            margin-left: 6px;
          }

          .actions-wrapper {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .status-btn {
            padding: 12px 22px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            font-family: inherit;
            color: white;
            transition: all 0.2s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }

          .status-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.05);
          }

          .status-btn:active {
            transform: translateY(0);
          }

          .status-btn.preparing {
            background: #f59e0b;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
          }
          .status-btn.preparing:hover {
            box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
          }

          .status-btn.ready {
            background: #10b981;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
          }
          .status-btn.ready:hover {
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
          }

          .status-btn.delivered {
            background: #16a34a;
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
          }
          .status-btn.delivered:hover {
            box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4);
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
            .admin-orders-container {
              padding: 25px 15px;
            }
            .order-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
            }
            .status-btn {
              width: 100%;
            }
          }
        `}</style>

        <h1 className="admin-title">📦 Admin Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders-card">
            <h2>No Orders Found 😔</h2>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h2 className="customer-name">👤 Customer: {order.user?.name || "Unknown User"}</h2>
                <div>
                  <span
                    className="status-badge"
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <h3 className="order-total">
                <span className="order-total-label">Total:</span>
                ₹{order.totalAmount}
              </h3>
              <p className="payment-summary">
                Payment: {order.paymentMethod || "Cash"}
                <span className="payment-status">
                  ({order.paymentStatus || "Pending"})
                </span>
              </p>

              <div className="actions-wrapper">
                <button
                  onClick={() => updateStatus(order._id, "Preparing", order.user?.name)}
                  className="status-btn preparing"
                >
                  Preparing
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Ready", order.user?.name)}
                  className="status-btn ready"
                >
                  Ready
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Delivered", order.user?.name)}
                  className="status-btn delivered"
                >
                  Delivered
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type} ${toast.isHiding ? 'hide' : ''}`}>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}
    </>
  );
}

export default AdminOrders;
