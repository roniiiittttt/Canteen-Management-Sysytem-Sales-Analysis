import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        {/* Injecting scoped premium styles for dashboard cards and background */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
          
          .dashboard-container {
            padding: 40px 30px;
            background: linear-gradient(rgba(241, 245, 249, 0.85), rgba(241, 245, 249, 0.95)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
            background-attachment: fixed;
            min-height: calc(100vh - 70px); /* Account for navbar height */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .hero-banner {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            padding: 50px 40px;
            border-radius: 24px;
            color: white;
            text-align: center;
            margin-bottom: 40px;
            box-shadow: 0 10px 30px rgba(239, 68, 68, 0.2);
            position: relative;
            overflow: hidden;
          }

          .hero-banner::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%);
            pointer-events: none;
          }

          .hero-title {
            margin: 0 0 12px 0;
            color: white;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          .hero-subtitle {
            margin: 0 0 20px 0;
            font-size: 17px;
            color: #fee2e2;
            font-weight: 400;
          }

          .auth-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.15);
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.25);
          }

          .section-title {
            font-size: 22px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 20px 0;
            letter-spacing: -0.3px;
          }

          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 25px;
          }

          .dashboard-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 20px;
            padding: 35px 25px;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03), 0 2px 4px -2px rgba(15, 23, 42, 0.03);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            color: #1e293b;
          }

          .dashboard-card:hover {
            transform: translateY(-6px);
            border-color: #ef4444;
            box-shadow: 0 20px 25px -5px rgba(239, 68, 68, 0.08), 0 8px 10px -6px rgba(239, 68, 68, 0.03);
          }

          .card-emoji {
            font-size: 36px;
            margin-bottom: 12px;
            display: block;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
          }

          .card-title {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 8px 0;
          }

          .card-desc {
            font-size: 14px;
            color: #64748b;
            margin: 0;
            font-weight: 400;
          }

          .dashboard-footer {
            margin-top: 60px;
            text-align: center;
            padding: 20px 0 10px 0;
            border-top: 1px solid rgba(226, 232, 240, 0.8);
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

          @media (max-width: 768px) {
            .dashboard-container {
              padding: 25px 15px;
            }
            .hero-banner {
              padding: 35px 20px;
            }
            .hero-title {
              font-size: 26px;
            }
          }
        `}</style>

        <div>
          {/* Hero Section */}
          <div className="hero-banner">
            <h1 className="hero-title">🍽️ Welcome to Canteen Management</h1>
            <p className="hero-subtitle">
              Order Food, Track Orders & Book Tables Easily
            </p>
            <div className="auth-badge">
              {token ? "✅ Logged In Successfully" : "❌ Not Logged In"}
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="section-title">Quick Actions</h2>

          <div className="cards-grid">
            <Link to="/menu" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <span className="card-emoji">🍔</span>
                <h3 className="card-title">Menu</h3>
                <p className="card-desc">Browse all food items</p>
              </div>
            </Link>

            <Link to="/cart" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <span className="card-emoji">🛒</span>
                <h3 className="card-title">Cart</h3>
                <p className="card-desc">View your selected items</p>
              </div>
            </Link>

            <Link to="/orders" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <span className="card-emoji">📦</span>
                <h3 className="card-title">Orders</h3>
                <p className="card-desc">Track all placed orders</p>
              </div>
            </Link>

            <Link to="/payments" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <span className="card-emoji">₹</span>
                <h3 className="card-title">Recent Payments</h3>
                <p className="card-desc">View your payment history</p>
              </div>
            </Link>

            <Link to="/bookings" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <span className="card-emoji">🪑</span>
                <h3 className="card-title">Book Table</h3>
                <p className="card-desc">Reserve your dining table</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <p className="footer-text">
            Developed with love by <span className="footer-author">Ronit Chaudhari</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
