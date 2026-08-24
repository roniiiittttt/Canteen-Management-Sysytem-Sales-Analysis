import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role = "customer";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (error) {
      console.log(error);
    }
  }

  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);
  const [orders, setOrders] = useState([]);

  // Global order status polling for customer notifications
  useEffect(() => {
    if (!token || role === "admin") return;

    // Fetch initial order states
    const fetchInitial = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchInitial();

    // Poll every 5 seconds for status updates
    const interval = setInterval(async () => {
      try {
        const data = await getMyOrders();
        
        setOrders(prevOrders => {
          if (prevOrders.length > 0) {
            data.forEach(newOrder => {
              const oldOrder = prevOrders.find(o => o._id === newOrder._id);
              if (oldOrder && oldOrder.status !== newOrder.status) {
                showNotification(`🔔 Order Status Updated: Your order is now "${newOrder.status}"!`);
              }
            });
          }
          return data;
        });
      } catch (err) {
        console.log(err);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, [token, role, toastTimeout]);

  const showNotification = (message) => {
    if (toastTimeout) clearTimeout(toastTimeout);

    setToast({ message, isHiding: false });

    const timeout = setTimeout(() => {
      setToast(prev => prev ? { ...prev, isHiding: true } : null);
      setTimeout(() => setToast(null), 300);
    }, 4000);

    setToastTimeout(timeout);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getLinkClass = ({ isActive }) => 
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <>
      <div className="navbar-container">
        {/* Scoped CSS for Navbar hover animations, active highlight and global toast notifications */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

          .navbar-container {
            padding: 15px 30px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            background: #ffffff;
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
            position: sticky;
            top: 0;
            z-index: 100;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
          }

          .navbar-logo {
            color: #ef4444;
            margin: 0;
            margin-right: 20px;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
            white-space: nowrap;
          }

          .navbar-logo-suffix {
            color: #1e293b;
          }

          .nav-link {
            color: #475569;
            text-decoration: none;
            font-weight: 600;
            padding: 10px 16px;
            border-radius: 10px;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            font-size: 15px;
            display: inline-block;
            white-space: nowrap;
          }

          /* Hover Effect from link to link */
          .nav-link:hover {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.06);
            transform: translateY(-1px);
          }

          /* Active Highlight */
          .nav-link.active {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.12);
            font-weight: 700;
          }

          .nav-link:active {
            transform: translateY(0);
          }

          .logout-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border: none;
            padding: 11px 22px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 15px;
            font-family: inherit;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
            filter: brightness(1.03);
          }

          .logout-btn:active {
            transform: translateY(0);
          }

          /* Global Toast Notification Styles */
          .global-toast {
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: #0f172a;
            color: #ffffff;
            padding: 18px 26px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            border: 1px solid rgba(255, 255, 255, 0.08);
            font-family: 'Outfit', sans-serif;
            border-left: 5px solid #10b981;
            animation: slideInToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .global-toast.hide {
            animation: slideOutToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .global-toast-message {
            font-weight: 600;
            font-size: 15px;
            letter-spacing: -0.2px;
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
            .navbar-container {
              padding: 15px 20px;
              gap: 8px;
            }
            .navbar-logo {
              flex-basis: 100%;
              margin-right: 0;
              font-size: 20px;
            }
            .nav-link {
              padding: 8px 10px;
              font-size: 14px;
            }
            .logout-btn {
              margin-left: 0;
              padding: 9px 16px;
            }
          }
        `}</style>

        <h2 className="navbar-logo">
          🍽️ Canteen<span className="navbar-logo-suffix">MS</span>
        </h2>

        {role === "admin" ? (
          <>
            <NavLink to="/admin" end className={getLinkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/orders" className={getLinkClass}>
              Orders
            </NavLink>

            <NavLink to="/admin/bookings" className={getLinkClass}>
              Bookings
            </NavLink>

            <NavLink to="/admin/payments" className={getLinkClass}>
              Payments
            </NavLink>

            

            <NavLink to="/menu" className={getLinkClass}>
              Menu
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" className={getLinkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/menu" className={getLinkClass}>
              Menu
            </NavLink>

            <NavLink to="/cart" className={getLinkClass}>
              Cart
            </NavLink>

            <NavLink to="/orders" className={getLinkClass}>
              Orders
            </NavLink>

            <NavLink to="/payments" className={getLinkClass}>
              Recent Payments
            </NavLink>

            <NavLink to="/bookings" className={getLinkClass}>
              Bookings
            </NavLink>
          </>
        )}

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {role === "admin" && (
            <NavLink to="/admin/sales-analysis" className={getLinkClass} style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
              Sales Analysis
            </NavLink>
          )}
          <button onClick={logoutHandler} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Floating Global Toast Notification */}
      {toast && (
        <div className={`global-toast ${toast.isHiding ? 'hide' : ''}`}>
          <span className="global-toast-message">{toast.message}</span>
        </div>
      )}
    </>
  );
}

export default Navbar;
