import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getDashboardStats } from "../services/dashboardService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const cardStyle = {
    background: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          background: "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        {/* Hero Section */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#ef4444,#dc2626)",
            padding: "40px",
            borderRadius: "20px",
            color: "white",
            textAlign: "center",
            marginBottom: "35px",
            boxShadow:
              "0 10px 25px rgba(239,68,68,0.25)",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "white",
              fontSize: "34px",
            }}
          >
            📊 Admin Analytics Dashboard
          </h2>
        </div>

        {/* Analytics */}

        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(6, 1fr)",
              gap: "15px",
              marginBottom: "40px",
            }}
          >
            <div style={cardStyle}>
              <h2>👥 Users</h2>
              <h1 style={{ color: "#ef4444" }}>
                {stats.totalUsers}
              </h1>
            </div>

            <div style={cardStyle}>
              <h2>🍔 Menu Items</h2>
              <h1 style={{ color: "#ef4444" }}>
                {stats.totalMenuItems}
              </h1>
            </div>

            <div style={cardStyle}>
              <h2>📦 Orders</h2>
              <h1 style={{ color: "#ef4444" }}>
                {stats.totalOrders}
              </h1>
            </div>

            <div style={cardStyle}>
              <h2>⏳ Pending Orders</h2>
              <h1 style={{ color: "#ef4444" }}>
                {stats.pendingOrders}
              </h1>
            </div>

            <div style={cardStyle}>
              <h2>🪑 Approved Bookings</h2>
              <h1 style={{ color: "#ef4444" }}>
                {stats.approvedBookings}
              </h1>
            </div>

            <div style={cardStyle}>
              <h2>💰 Revenue</h2>
              <h1 style={{ color: "#ef4444" }}>
                ₹{stats.totalRevenue}
              </h1>
            </div>
          </div>
        )}

        {/* Quick Actions */}

        <h2
          style={{
            color: "#111827",
            marginBottom: "20px",
          }}
        >
          Quick Actions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
          }}
        >
          <Link
            to="/admin/orders"
            style={{
              textDecoration: "none",
            }}
          >
            <div style={cardStyle}>
              <h2
                style={{
                  color: "#ef4444",
                }}
              >
                📦 Manage Orders
              </h2>

              <p>
                Update order status and track
                deliveries
              </p>
            </div>
          </Link>

          <Link
            to="/admin/bookings"
            style={{
              textDecoration: "none",
            }}
          >
            <div style={cardStyle}>
              <h2
                style={{
                  color: "#ef4444",
                }}
              >
                🪑 Manage Bookings
              </h2>

              <p>
                Approve or reject customer
                bookings
              </p>
            </div>
          </Link>

          <Link
            to="/admin/menu"
            style={{
              textDecoration: "none",
            }}
          >
            <div style={cardStyle}>
              <h2
                style={{
                  color: "#ef4444",
                }}
              >
                🍔 Menu Management
              </h2>

              <p>
                Add, delete and manage menu
                items
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;