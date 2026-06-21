import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    // Poll to refresh list badges in real-time
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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

      <div className="orders-container">
        {/* Injecting scoped styles for layout, cards, and animations */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
          
          .orders-container {
            padding: 40px 30px;
            background: #f1f5f9; /* Premium slate gray */
            background-image: 
              radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.04) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(239, 68, 68, 0.02) 0px, transparent 50%);
            min-height: calc(100vh - 70px);
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
          }

          .orders-title {
            text-align: center;
            color: #ef4444;
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          .empty-orders-card {
            text-align: center;
            padding: 60px 40px;
            background: #ffffff;
            border-radius: 24px;
            border: 1px solid rgba(226, 232, 240, 0.8);
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .empty-orders-card h2 {
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
            position: relative;
            overflow: hidden;
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

          .order-date-label {
            color: #64748b;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 4px 0;
          }

          .order-date {
            color: #0f172a;
            font-size: 16px;
            font-weight: 700;
            margin: 0;
          }

          .order-id-sub {
            color: #94a3b8;
            font-size: 12px;
            font-weight: 500;
            font-family: monospace;
            margin: 4px 0 0 0;
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
            margin: 0;
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
            margin: 10px 0 0 0;
          }

          .payment-status {
            color: #10b981;
            margin-left: 6px;
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

          @media (max-width: 768px) {
            .orders-container {
              padding: 25px 15px;
            }
            .order-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
            }
          }
        `}</style>

        <h1 className="orders-title">📦 My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders-card">
            <h2>No Orders Found 😔</h2>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h4 className="order-date-label">Ordered On</h4>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                  <p className="order-id-sub">ID: {order._id}</p>
                </div>
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
                <span className="order-total-label">Total Amount:</span>
                ₹{order.totalAmount}
              </h3>
              <p className="payment-summary">
                Payment: {order.paymentMethod || "Cash"}
                <span className="payment-status">
                  ({order.paymentStatus || "Pending"})
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Orders;
