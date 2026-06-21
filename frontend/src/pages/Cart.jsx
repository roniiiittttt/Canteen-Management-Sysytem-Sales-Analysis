import { useEffect, useState } from "react";
import {
  getCartItems,
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
} from "../services/cartService";
import { placeOrder } from "../services/orderService";
import Navbar from "../components/Navbar";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [isOrdering, setIsOrdering] = useState(false);

  const paymentMethods = [
    {
      value: "Cash",
      title: "Cash",
      description: "Pay at counter after order is ready",
    },
    {
      value: "UPI",
      title: "UPI",
      description: "Mark payment as paid with UPI",
    },
    {
      value: "Card",
      title: "Card",
      description: "Mark payment as paid with card",
    },
  ];

  useEffect(() => {
    fetchCart();
    return () => {
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, [toastTimeout]);

  const fetchCart = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data);
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

  const removeItem = async (id, name) => {
    try {
      await removeCartItem(id);
      showNotification(`🗑️ ${name || "Item"} removed from cart.`, "success");
      fetchCart();
    } catch (error) {
      showNotification("❌ Failed to remove item.", "error");
      console.log(error);
    }
  };

  const increaseItem = async (id) => {
    try {
      await increaseQuantity(id);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseItem = async (id) => {
    try {
      await decreaseQuantity(id);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    if (isOrdering) return;

    try {
      setIsOrdering(true);
      const transactionId =
        selectedPaymentMethod === "Cash"
          ? ""
          : `TXN-${Date.now()}`;

      await placeOrder({
        paymentMethod: selectedPaymentMethod,
        transactionId,
      });

      showNotification("Order placed successfully!", "success");
      fetchCart();
    } catch (error) {
      showNotification("Failed to place order.", "error");
      console.log(error);
    } finally {
      setIsOrdering(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + (item.menuItem?.price || 0) * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="cart-container">
        {/* Injecting scoped premium styles for layout, cards, animations, and toast */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
          
          .cart-container {
            padding: 40px 30px;
            background: #f1f5f9; /* Premium slate gray */
            background-image: 
              radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.04) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(239, 68, 68, 0.02) 0px, transparent 50%);
            min-height: calc(100vh - 70px);
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
          }

          .cart-title {
            text-align: center;
            color: #ef4444;
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }

          .empty-cart-card {
            text-align: center;
            padding: 60px 40px;
            background: #ffffff;
            border-radius: 24px;
            border: 1px solid rgba(226, 232, 240, 0.8);
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .empty-cart-card h2 {
            margin: 0;
            color: #475569;
            font-size: 22px;
            font-weight: 600;
          }

          .cart-item-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
          }

          .cart-item-card:hover {
            transform: translateY(-4px);
            border-color: #ef4444;
            box-shadow: 0 15px 30px -10px rgba(239, 68, 68, 0.08);
          }

          .item-details h2 {
            color: #0f172a;
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 6px 0;
          }

          .item-price {
            color: #ef4444;
            font-weight: 700;
            font-size: 17px;
            margin: 0 0 15px 0;
          }

          .quantity-controls {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .qty-btn {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .qty-btn.minus {
            background: #ef4444;
          }

          .qty-btn.plus {
            background: #22c55e;
          }

          .qty-btn:hover {
            transform: scale(1.08);
            filter: brightness(1.05);
          }

          .qty-btn:active {
            transform: scale(1);
          }

          .qty-number {
            color: #0f172a;
            font-size: 16px;
            font-weight: 700;
            min-width: 25px;
            text-align: center;
          }

          .subtotal-text {
            color: #475569;
            font-size: 15px;
            font-weight: 600;
            margin: 15px 0 0 0;
          }

          .remove-btn {
            background: #f1f5f9;
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.15);
            padding: 10px 18px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .remove-btn:hover {
            background: #fee2e2;
            border-color: #ef4444;
            transform: translateY(-1px);
          }

          .checkout-card {
            margin-top: 30px;
            background: #ffffff;
            padding: 30px;
            border-radius: 22px;
            text-align: center;
            border: 1px solid rgba(226, 232, 240, 0.8);
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .checkout-total {
            color: #0f172a;
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 20px 0;
          }

          .checkout-total-val {
            color: #ef4444;
            margin-left: 8px;
          }

          .payment-section {
            border-top: 1px solid #f1f5f9;
            border-bottom: 1px solid #f1f5f9;
            padding: 22px 0;
            margin: 0 0 22px 0;
            text-align: left;
          }

          .payment-title {
            color: #0f172a;
            font-size: 17px;
            font-weight: 700;
            margin: 0 0 14px 0;
          }

          .payment-options {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }

          .payment-option {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            min-height: 94px;
            text-align: left;
            font-family: inherit;
          }

          .payment-option:hover {
            border-color: #ef4444;
            transform: translateY(-1px);
          }

          .payment-option.active {
            background: #fff1f2;
            border-color: #ef4444;
            box-shadow: 0 6px 18px rgba(239, 68, 68, 0.12);
          }

          .payment-method-name {
            color: #0f172a;
            display: block;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 6px;
          }

          .payment-method-desc {
            color: #64748b;
            display: block;
            font-size: 12.5px;
            font-weight: 500;
            line-height: 1.35;
          }

          .payment-note {
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
            margin: 12px 0 0 0;
          }

          .place-order-btn {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border: none;
            padding: 14px 35px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
            transition: all 0.25s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
          }

          .place-order-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.35);
            filter: brightness(1.03);
          }

          .place-order-btn:active {
            transform: translateY(0);
          }

          .place-order-btn:disabled {
            cursor: not-allowed;
            opacity: 0.65;
            transform: none;
            filter: grayscale(0.2);
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
            .cart-container {
              padding: 25px 15px;
            }
            .cart-item-card {
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
            }
            .qty-btn, .remove-btn, .place-order-btn {
              width: auto; /* Overrides the global width: 100% bug from index.css */
            }
            .qty-btn {
              width: 38px !important;
            }
            .payment-options {
              grid-template-columns: 1fr;
            }
            .payment-option {
              min-height: auto;
            }
          }
        `}</style>

        <h1 className="cart-title">🛒 My Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart-card">
            <h2>Your Cart Is Empty 😔</h2>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-card">
                <div className="item-details">
                  <h2>{item.menuItem?.name || "Deleted Food Item"}</h2>
                  <p className="item-price">💰 ₹{item.menuItem?.price || 0}</p>
                  <p className="subtotal-text">
                    🧾 Subtotal: ₹{(item.menuItem?.price || 0) * item.quantity}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-end" }}>
                  <div className="quantity-controls">
                    <button
                      onClick={() => decreaseItem(item._id)}
                      className="qty-btn minus"
                    >
                      -
                    </button>
                    <span className="qty-number">{item.quantity}</span>
                    <button
                      onClick={() => increaseItem(item._id)}
                      className="qty-btn plus"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id, item.menuItem?.name)}
                    className="remove-btn"
                  >
                    🗑️ Remove Item
                  </button>
                </div>
              </div>
            ))}

            <div className="checkout-card">
              <h2 className="checkout-total">
                Total Amount:
                <span className="checkout-total-val">₹{totalAmount}</span>
              </h2>

              <div className="payment-section">
                <h3 className="payment-title">Payment Method</h3>
                <div className="payment-options">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(method.value)}
                      className={`payment-option ${
                        selectedPaymentMethod === method.value ? "active" : ""
                      }`}
                    >
                      <span className="payment-method-name">
                        {method.title}
                      </span>
                      <span className="payment-method-desc">
                        {method.description}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="payment-note">
                  Selected payment: {selectedPaymentMethod}
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="place-order-btn"
                disabled={isOrdering}
              >
                {isOrdering ? "Processing..." : "Place Order"}
              </button>
            </div>
          </>
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

export default Cart;
