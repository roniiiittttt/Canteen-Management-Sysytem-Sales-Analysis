import { useEffect, useState } from "react";
import { getMenuItems } from "../services/menuService";
import { addToCart } from "../services/cartService";
import Navbar from "../components/Navbar";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  useEffect(() => {
    fetchMenu();
    return () => {
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, [toastTimeout]);

  const fetchMenu = async () => {
    try {
      const data = await getMenuItems();
      setMenuItems(data);
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

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item._id);
      showNotification(`🍔 ${item.name} added to cart!`, "success");
    } catch (error) {
      showNotification("❌ Failed to add item to cart.", "error");
      console.log(error);
    }
  };

  const filteredMenu = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="menu-container">
        {/* Injecting scoped styles for layout, card, animations, and toast */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
          
          .menu-container {
            padding: 40px 30px;
            background: #f1f5f9; /* Premium slate gray */
            background-image: 
              radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.04) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(239, 68, 68, 0.02) 0px, transparent 50%);
            min-height: calc(100vh - 70px);
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
          }

          .menu-title {
            text-align: center;
            color: #ef4444;
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          .search-input {
            width: 100%;
            padding: 16px 20px;
            border-radius: 14px;
            border: 1px solid #cbd5e1;
            margin-bottom: 40px;
            font-size: 16px;
            background: #ffffff;
            color: #0f172a;
            outline: none;
            box-shadow: 0 4px 15px rgba(15, 23, 42, 0.03);
            transition: all 0.25s ease;
            box-sizing: border-box;
          }

          .search-input:focus {
            border-color: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
          }

          .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); /* Fully responsive */
            gap: 30px;
          }

          .menu-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 22px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03), 0 2px 4px -2px rgba(15, 23, 42, 0.03);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
          }

          .menu-card:hover {
            transform: translateY(-6px);
            border-color: #ef4444;
            box-shadow: 0 20px 25px -5px rgba(239, 68, 68, 0.08), 0 8px 10px -6px rgba(239, 68, 68, 0.03);
          }

          .menu-img {
            width: 100%;
            height: 220px;
            object-fit: cover;
            border-radius: 14px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }

          .menu-item-name {
            color: #0f172a;
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 10px 0;
            letter-spacing: -0.3px;
          }

          .menu-item-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .menu-item-price {
            color: #ef4444;
            font-weight: 700;
            font-size: 20px;
            margin: 0;
          }

          .menu-item-category {
            color: #64748b;
            background: #f1f5f9;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin: 0;
          }

          .menu-item-desc {
            color: #475569;
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 20px 0;
            min-height: 65px;
          }

          .add-btn {
            width: 100%;
            padding: 13px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            font-weight: 600;
            font-size: 15px;
            font-family: inherit;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
            transition: all 0.25s ease;
          }

          .add-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35);
            filter: brightness(1.03);
          }

          .add-btn:active {
            transform: translateY(0);
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
            .menu-container {
              padding: 25px 15px;
            }
            .menu-grid {
              gap: 20px;
            }
          }
        `}</style>

        <h1 className="menu-title">🍔 Our Menu</h1>

        <input
          type="text"
          placeholder="🔍 Search Food or Category..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredMenu.length === 0 ? (
          <h2 style={{ textAlign: "center", color: "#64748b", fontWeight: "600" }}>
            No Food Items Found
          </h2>
        ) : (
          <div className="menu-grid">
            {filteredMenu.map((item) => (
              <div key={item._id} className="menu-card">
                <div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="menu-img"
                    />
                  )}

                  <h2 className="menu-item-name">{item.name}</h2>

                  <div className="menu-item-meta">
                    <p className="menu-item-price">₹{item.price}</p>
                    <p className="menu-item-category">{item.category}</p>
                  </div>

                  <p className="menu-item-desc">{item.description}</p>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="add-btn"
                >
                  Add To Cart
                </button>
              </div>
            ))}
          </div>
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

export default Menu;