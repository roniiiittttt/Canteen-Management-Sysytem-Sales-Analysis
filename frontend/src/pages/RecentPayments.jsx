import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getMyOrders } from "../services/orderService";

function RecentPayments() {
  const [payments, setPayments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getMyOrders();
      const paymentHistory = data
        .filter((order) => order.totalAmount)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPayments(paymentHistory);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getPaymentColor = (status) => {
    if (status === "Paid") return "#10b981";
    return "#f59e0b";
  };

  const totalPaid = useMemo(
    () =>
      payments
        .filter((payment) => payment.paymentStatus === "Paid")
        .reduce((total, payment) => total + payment.totalAmount, 0),
    [payments]
  );

  const totalPending = useMemo(
    () =>
      payments
        .filter((payment) => payment.paymentStatus !== "Paid")
        .reduce((total, payment) => total + payment.totalAmount, 0),
    [payments]
  );

  const filteredPayments = useMemo(() => {
    if (activeFilter === "Paid") {
      return payments.filter((payment) => payment.paymentStatus === "Paid");
    }

    if (activeFilter === "Pending") {
      return payments.filter((payment) => payment.paymentStatus !== "Paid");
    }

    return payments;
  }, [activeFilter, payments]);

  const filterOptions = [
    "All",
    "Paid",
    "Pending",
  ];

  return (
    <>
      <Navbar />

      <div className="payments-container">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

          .payments-container {
            padding: 40px 30px;
            background: #f1f5f9;
            background-image:
              radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.04) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.04) 0px, transparent 50%);
            min-height: calc(100vh - 70px);
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
          }

          .payments-title {
            text-align: center;
            color: #ef4444;
            margin: 0 0 24px 0;
            font-size: 32px;
            font-weight: 700;
          }

          .payments-summary-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 22px;
          }

          .summary-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.85);
            border-radius: 16px;
            padding: 18px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .summary-label {
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
            margin: 0 0 8px 0;
            text-transform: uppercase;
          }

          .summary-value {
            color: #0f172a;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
          }

          .summary-value.paid {
            color: #10b981;
          }

          .summary-value.pending {
            color: #f59e0b;
          }

          .payment-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 18px;
          }

          .filter-tabs {
            display: inline-flex;
            gap: 8px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 6px;
          }

          .filter-tab {
            background: transparent;
            color: #475569;
            border: none;
            border-radius: 10px;
            padding: 9px 16px;
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            font-weight: 700;
            transition: all 0.2s ease;
          }

          .filter-tab.active {
            background: #ef4444;
            color: #ffffff;
            box-shadow: 0 6px 14px rgba(239, 68, 68, 0.2);
          }

          .payment-count {
            color: #64748b;
            font-size: 14px;
            font-weight: 700;
            margin: 0;
          }

          .empty-payments-card {
            text-align: center;
            padding: 60px 40px;
            background: #ffffff;
            border-radius: 22px;
            border: 1px solid rgba(226, 232, 240, 0.8);
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .empty-payments-card h2 {
            margin: 0;
            color: #64748b;
            font-size: 22px;
            font-weight: 600;
          }

          .payments-list {
            display: grid;
            gap: 18px;
          }

          .payment-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 18px;
            padding: 22px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
            transition: all 0.25s ease;
          }

          .payment-card.pending {
            border-left: 5px solid #f59e0b;
          }

          .payment-card.paid {
            border-left: 5px solid #10b981;
          }

          .payment-card:hover {
            transform: translateY(-3px);
            border-color: #ef4444;
            box-shadow: 0 14px 26px -12px rgba(239, 68, 68, 0.16);
          }

          .payment-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 14px;
            margin-bottom: 14px;
          }

          .payment-id {
            color: #94a3b8;
            font-family: monospace;
            font-size: 12px;
            margin: 4px 0 0 0;
          }

          .payment-date {
            color: #0f172a;
            font-size: 16px;
            font-weight: 700;
            margin: 0;
          }

          .payment-amount {
            color: #ef4444;
            font-size: 22px;
            font-weight: 700;
            margin: 0;
            white-space: nowrap;
          }

          .payment-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .payment-pill {
            background: #f8fafc;
            color: #475569;
            border: 1px solid #e2e8f0;
            border-radius: 999px;
            padding: 8px 14px;
            font-size: 13px;
            font-weight: 700;
          }

          .payment-pill.status {
            color: #ffffff;
            border-color: transparent;
          }

          @media (max-width: 768px) {
            .payments-container {
              padding: 25px 15px;
            }
            .payments-summary-grid {
              grid-template-columns: 1fr;
            }
            .payment-toolbar {
              align-items: stretch;
              flex-direction: column;
            }
            .filter-tabs {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
            }
            .filter-tab {
              padding: 9px 10px;
            }
            .payment-header {
              flex-direction: column;
            }
            .payment-amount {
              white-space: normal;
            }
          }
        `}</style>

        <h1 className="payments-title">Recent Payments</h1>

        {payments.length === 0 ? (
          <div className="empty-payments-card">
            <h2>No Payments Found</h2>
          </div>
        ) : (
          <>
            <div className="payments-summary-grid">
              <div className="summary-card">
                <p className="summary-label">Total Payments</p>
                <p className="summary-value">{payments.length}</p>
              </div>
              <div className="summary-card">
                <p className="summary-label">Paid Amount</p>
                <p className="summary-value paid">₹{totalPaid}</p>
              </div>
              <div className="summary-card">
                <p className="summary-label">Pending Cash</p>
                <p className="summary-value pending">₹{totalPending}</p>
              </div>
            </div>

            <div className="payment-toolbar">
              <div className="filter-tabs">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`filter-tab ${
                      activeFilter === filter ? "active" : ""
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <p className="payment-count">
                Showing {filteredPayments.length} of {payments.length}
              </p>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="empty-payments-card">
                <h2>No {activeFilter} Payments Found</h2>
              </div>
            ) : (
              <div className="payments-list">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className={`payment-card ${
                      payment.paymentStatus === "Paid" ? "paid" : "pending"
                    }`}
                  >
                    <div className="payment-header">
                      <div>
                        <p className="payment-date">
                          {formatDate(payment.createdAt)}
                        </p>
                        <p className="payment-id">Order ID: {payment._id}</p>
                      </div>
                      <p className="payment-amount">₹{payment.totalAmount}</p>
                    </div>

                    <div className="payment-meta">
                      <span className="payment-pill">
                        Method: {payment.paymentMethod || "Cash"}
                      </span>
                      <span
                        className="payment-pill status"
                        style={{
                          background: getPaymentColor(payment.paymentStatus),
                        }}
                      >
                        {payment.paymentStatus || "Pending"}
                      </span>
                      {payment.transactionId ? (
                        <span className="payment-pill">
                          TXN: {payment.transactionId}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default RecentPayments;
