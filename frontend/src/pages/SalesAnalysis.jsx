import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getSalesOverview,
  getSalesTrends,
  getProductAnalysis,
  getCategoryAnalysis,
  getCustomerAnalysis,
  getTimeAnalysis,
  getOperationsPayments,
  askAiAnalysis,
} from "../services/analyticsService";

const formatDateInput = (date) =>
  date.toISOString().slice(0, 10);

const getDefaultRange = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(today),
  };
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatPercent = (value) =>
  `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0))}%`;

function SalesAnalysis() {
  const defaults = useMemo(() => getDefaultRange(), []);
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [data, setData] = useState(null);
  const [trendGroupBy, setTrendGroupBy] = useState("day");
  const [trendData, setTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState("");
  const [productLimit, setProductLimit] = useState(5);
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [customerLimit, setCustomerLimit] = useState(5);
  const [customerSummary, setCustomerSummary] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [timeData, setTimeData] = useState(null);
  const [timeLoading, setTimeLoading] = useState(false);
  const [timeError, setTimeError] = useState("");
  const [operationsPaymentsData, setOperationsPaymentsData] = useState(null);
  const [operationsPaymentsLoading, setOperationsPaymentsLoading] = useState(false);
  const [operationsPaymentsError, setOperationsPaymentsError] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedRange, setSubmittedRange] = useState(defaults);

  const fetchOverview = async (range) => {
    setLoading(true);
    setError("");

    try {
      const response = await getSalesOverview(range);
      setData(response);
      setSubmittedRange(range);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load sales analysis."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async (range, groupBy) => {
    setTrendLoading(true);
    setTrendError("");
    try {
      const response = await getSalesTrends({
        ...range,
        groupBy,
      });
      setTrendData(response.data || []);
    } catch (err) {
      setTrendError(
        err.response?.data?.message ||
          "Failed to load sales trends."
      );
      setTrendData([]);
    } finally {
      setTrendLoading(false);
    }
  };

  const fetchProducts = async (range, limit) => {
    setProductLoading(true);
    setProductError("");
    try {
      const response = await getProductAnalysis({
        ...range,
        limit,
      });
      setProductData(response.data || []);
    } catch (err) {
      setProductError(
        err.response?.data?.message ||
          "Failed to load product analysis."
      );
      setProductData([]);
    } finally {
      setProductLoading(false);
    }
  };

  const fetchCategories = async (range) => {
    setCategoryLoading(true);
    setCategoryError("");
    try {
      const response = await getCategoryAnalysis(range);
      setCategoryData(response.data || []);
    } catch (err) {
      setCategoryError(
        err.response?.data?.message ||
          "Failed to load category analysis."
      );
      setCategoryData([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchCustomers = async (range, limit) => {
    setCustomerLoading(true);
    setCustomerError("");
    try {
      const response = await getCustomerAnalysis({
        ...range,
        limit,
      });
      setCustomerSummary(response.summary || null);
      setCustomerData(response.topCustomers || []);
    } catch (err) {
      setCustomerError(
        err.response?.data?.message ||
          "Failed to load customer analysis."
      );
      setCustomerSummary(null);
      setCustomerData([]);
    } finally {
      setCustomerLoading(false);
    }
  };

  const fetchTimeAnalysis = async (range) => {
    setTimeLoading(true);
    setTimeError("");
    try {
      const response = await getTimeAnalysis(range);
      setTimeData(response || null);
    } catch (err) {
      setTimeError(
        err.response?.data?.message ||
          "Failed to load time analysis."
      );
      setTimeData(null);
    } finally {
      setTimeLoading(false);
    }
  };

  const fetchOperationsPayments = async (range) => {
    setOperationsPaymentsLoading(true);
    setOperationsPaymentsError("");
    try {
      const response = await getOperationsPayments(range);
      setOperationsPaymentsData(response || null);
    } catch (err) {
      setOperationsPaymentsError(
        err.response?.data?.message ||
          "Failed to load operations and payment analytics."
      );
      setOperationsPaymentsData(null);
    } finally {
      setOperationsPaymentsLoading(false);
    }
  };

  const handleAskAi = async (question) => {
    const query = typeof question === "string" ? question.trim() : aiQuestion.trim();

    if (!query) {
      setAiError("Please enter a question.");
      setAiAnswer("");
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const response = await askAiAnalysis({
        question: query,
        startDate,
        endDate,
      });
      setAiAnswer(response.answer || "");
      setAiQuestion(query);
    } catch (err) {
      setAiError(
        err.response?.data?.message ||
          "Failed to generate AI analysis."
      );
      setAiAnswer("");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchOverview(defaults);
      fetchTrends(defaults, trendGroupBy);
      fetchProducts(defaults, productLimit);
      fetchCategories(defaults);
      fetchCustomers(defaults, customerLimit);
      fetchTimeAnalysis(defaults);
      fetchOperationsPayments(defaults);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [defaults, trendGroupBy, productLimit, customerLimit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const range = { startDate, endDate };
    fetchOverview(range);
    fetchTrends(range, trendGroupBy);
    fetchProducts(range, productLimit);
    fetchCategories(range);
    fetchCustomers(range, customerLimit);
    fetchTimeAnalysis(range);
    fetchOperationsPayments(range);
  };

  const handleGroupByChange = (groupBy) => {
    setTrendGroupBy(groupBy);
    fetchTrends({ startDate, endDate }, groupBy);
  };

  const handleProductLimitChange = (limit) => {
    setProductLimit(limit);
    fetchProducts({ startDate, endDate }, limit);
  };

  const handleCustomerLimitChange = (limit) => {
    setCustomerLimit(limit);
    fetchCustomers({ startDate, endDate }, limit);
  };

  const isZeroState =
    data &&
    data.totalRevenue === 0 &&
    data.totalOrders === 0 &&
    data.averageOrderValue === 0 &&
    data.totalCustomers === 0 &&
    data.itemsSold === 0;

  const kpis = [
    {
      label: "Total Revenue",
      value: formatCurrency(data?.totalRevenue),
    },
    {
      label: "Total Orders",
      value: formatNumber(data?.totalOrders),
    },
    {
      label: "Average Order Value",
      value: formatCurrency(data?.averageOrderValue),
    },
    {
      label: "Total Customers",
      value: formatNumber(data?.totalCustomers),
    },
    {
      label: "Items Sold",
      value: formatNumber(data?.itemsSold),
    },
    {
      label: "Revenue Growth %",
      value: formatPercent(data?.revenueGrowthPercent),
    },
  ];

  const trendMaxRevenue = Math.max(
    1,
    ...trendData.map((row) => Number(row.revenue || 0))
  );
  const trendMaxOrders = Math.max(
    1,
    ...trendData.map((row) => Number(row.orders || 0))
  );
  const trendEmpty = !trendLoading && !trendError && trendData.length === 0;
  const productEmpty = !productLoading && !productError && productData.length === 0;
  const categoryEmpty = !categoryLoading && !categoryError && categoryData.length === 0;
  const customerEmpty = !customerLoading && !customerError && customerData.length === 0;
  const bestCategory = categoryData[0] || null;
  const lowestCategory = categoryData[categoryData.length - 1] || null;
  const hourOrder = Array.from({ length: 24 }, (_, hour) => hour);
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const maxHourlyOrders = Math.max(1, ...(timeData?.hourly || []).map((row) => Number(row.orders || 0)));
  const maxHourlyRevenue = Math.max(1, ...(timeData?.hourly || []).map((row) => Number(row.revenue || 0)));
  const getDayRow = (day) => (timeData?.daily || []).find((row) => row.day === day) || { orders: 0, revenue: 0 };
  const operationsSummary = operationsPaymentsData?.operations || null;
  const paymentsSummary = operationsPaymentsData?.payments || null;
  const operationsPaymentsEmpty =
    !operationsPaymentsLoading &&
    !operationsPaymentsError &&
    !operationsPaymentsData;
  const hasPaymentMethods = (paymentsSummary?.byMethod || []).length > 0;
  const exampleQuestions = [
    "Why did sales decrease?",
    "What are the best-selling products?",
    "How is category performance looking?",
    "Which hours or days are busiest?",
    "Give me an operations and payment summary.",
  ];

  const formatTrendLabel = (value) => {
    if (trendGroupBy === "month") {
      return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
    }

    const date = new Date(`${value}T00:00:00Z`);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <>
      <Navbar />

      <div className="sales-analysis-container">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

          .sales-analysis-container {
            padding: 40px 30px;
            background: #f1f5f9;
            background-image:
              radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.05) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.04) 0px, transparent 50%);
            min-height: calc(100vh - 70px);
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
          }

          .sales-header {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: flex-end;
            margin-bottom: 24px;
            flex-wrap: wrap;
          }

          .sales-title {
            color: #ef4444;
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            letter-spacing: -0.5px;
          }

          .sales-subtitle {
            color: #475569;
            margin: 0;
            font-size: 15px;
          }

          .controls-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.85);
            border-radius: 18px;
            padding: 18px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
            margin-bottom: 22px;
          }

          .controls-form {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            align-items: end;
          }

          .field {
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 180px;
          }

          .field label {
            color: #475569;
            font-weight: 600;
            font-size: 14px;
          }

          .field input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 12px;
            border: 1px solid #cbd5e1;
            background: #ffffff;
            color: #0f172a;
            font-family: inherit;
            box-sizing: border-box;
          }

          .apply-btn {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 18px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.22);
          }

          .range-note {
            color: #64748b;
            font-size: 13px;
            margin-top: 12px;
          }

          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .kpi-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.85);
            border-radius: 20px;
            padding: 22px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .kpi-label {
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            margin: 0 0 12px 0;
          }

          .kpi-value {
            color: #0f172a;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.4px;
          }

          .status-card {
            margin-top: 22px;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.85);
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .trend-card {
            margin-top: 22px;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.85);
            border-radius: 20px;
            padding: 22px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
          }

          .trend-header {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 16px;
          }

          .trend-title {
            margin: 0;
            color: #0f172a;
            font-size: 20px;
            font-weight: 700;
          }

          .trend-selector {
            display: inline-flex;
            gap: 8px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 6px;
          }

          .trend-selector button {
            border: none;
            background: transparent;
            color: #475569;
            font-weight: 700;
            padding: 8px 12px;
            border-radius: 10px;
            cursor: pointer;
          }

          .trend-selector button.active {
            background: #ef4444;
            color: #ffffff;
          }

          .trend-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .trend-panel {
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 16px;
            background: #fafafa;
          }

          .trend-panel h3 {
            margin: 0 0 12px 0;
            color: #0f172a;
            font-size: 16px;
          }

          .trend-svg {
            width: 100%;
            height: auto;
            display: block;
          }

          .trend-bars {
            display: flex;
            align-items: end;
            gap: 10px;
            min-height: 240px;
            padding-top: 8px;
          }

          .trend-bar-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .trend-bar {
            width: 100%;
            min-height: 20px;
            border-radius: 12px 12px 4px 4px;
            background: linear-gradient(180deg, #ef4444, #dc2626);
          }

          .trend-bar.secondary {
            background: linear-gradient(180deg, #10b981, #059669);
          }

          .trend-bar-label {
            color: #475569;
            font-size: 12px;
            text-align: center;
            line-height: 1.3;
          }

          .loading, .error, .empty {
            text-align: center;
            padding: 50px 20px;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.85);
            border-radius: 20px;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.03);
            color: #475569;
            font-weight: 600;
          }

          .error {
            color: #b91c1c;
            border-color: rgba(239, 68, 68, 0.2);
            background: #fff1f2;
          }

          @media (max-width: 900px) {
            .kpi-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 640px) {
            .sales-analysis-container {
              padding: 25px 15px;
            }

            .kpi-grid {
              grid-template-columns: 1fr;
            }

            .controls-form {
              flex-direction: column;
              align-items: stretch;
            }

            .field {
              min-width: 0;
            }
          }
        `}</style>

        <div className="sales-header">
          <div>
            <h1 className="sales-title">Sales Analysis</h1>
            <p className="sales-subtitle">
              Reporting period: {submittedRange.startDate} to {submittedRange.endDate}
            </p>
          </div>
        </div>

        <div className="controls-card">
          <form className="controls-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <button className="apply-btn" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Apply Range"}
            </button>
          </form>

          <div className="range-note">
            Defaults to month-to-date. Data is pulled from delivered orders only.
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading sales overview...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : isZeroState ? (
          <div className="empty">
            No delivered orders found for the selected date range.
          </div>
        ) : (
          <>
            <div className="kpi-grid">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="kpi-card">
                  <p className="kpi-label">{kpi.label}</p>
                  <p className="kpi-value">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="status-card">
              <strong>Included status:</strong> Delivered
            </div>
          </>
        )}

        <div className="trend-card">
          <div className="trend-header">
            <h2 className="trend-title">Sales Trends</h2>
            <div className="trend-selector">
              {["day", "week", "month"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={trendGroupBy === option ? "active" : ""}
                  onClick={() => handleGroupByChange(option)}
                >
                  {option[0].toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {trendLoading ? (
            <div className="loading">Loading sales trends...</div>
          ) : trendError ? (
            <div className="error">{trendError}</div>
          ) : trendEmpty ? (
            <div className="empty">No trend data available for the selected range.</div>
          ) : (
            <div className="trend-grid">
              <div className="trend-panel">
                <h3>Revenue Trend</h3>
                <div className="trend-bars">
                  {trendData.map((row) => {
                    const height = (Number(row.revenue || 0) / trendMaxRevenue) * 180;
                    return (
                      <div key={`rev-${row.date}`} className="trend-bar-item">
                        <div
                          className="trend-bar"
                          style={{ height: `${Math.max(height, 4)}px` }}
                          title={`${formatTrendLabel(row.date)}: ${row.revenue}`}
                        />
                        <div className="trend-bar-label">
                          {formatTrendLabel(row.date)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="trend-panel">
                <h3>Orders Trend</h3>
                <div className="trend-bars">
                  {trendData.map((row) => {
                    const height = (Number(row.orders || 0) / trendMaxOrders) * 180;
                    return (
                      <div key={`ord-${row.date}`} className="trend-bar-item">
                        <div
                          className="trend-bar secondary"
                          style={{ height: `${Math.max(height, 4)}px` }}
                          title={`${formatTrendLabel(row.date)}: ${row.orders}`}
                        />
                        <div className="trend-bar-label">
                          {formatTrendLabel(row.date)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="trend-card">
          <div className="trend-header">
            <h2 className="trend-title">Time Analysis</h2>
          </div>

          {timeLoading ? (
            <div className="loading">Loading time analysis...</div>
          ) : timeError ? (
            <div className="error">{timeError}</div>
          ) : !timeData ? (
            <div className="empty">No time analysis available for the selected range.</div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "18px",
                }}
              >
                <div className="kpi-card">
                  <p className="kpi-label">Peak Hour</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {`${String(timeData.peakHour?.hour ?? 0).padStart(2, "0")}:00`}
                  </p>
                  <p className="kpi-label" style={{ marginTop: "8px", textTransform: "none" }}>
                    {formatNumber(timeData.peakHour?.orders || 0)} orders
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Peak Day</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {timeData.peakDay?.day || "Monday"}
                  </p>
                  <p className="kpi-label" style={{ marginTop: "8px", textTransform: "none" }}>
                    {formatNumber(timeData.peakDay?.orders || 0)} orders
                  </p>
                </div>
              </div>

              <div className="trend-grid">
                <div className="trend-panel">
                  <h3>Orders by Hour</h3>
                  <div className="trend-bars" style={{ flexDirection: "column", alignItems: "stretch", minHeight: "auto" }}>
                    {hourOrder.map((hour) => {
                      const row = (timeData.hourly || []).find((item) => item.hour === hour) || { orders: 0 };
                      const width = (Number(row.orders || 0) / maxHourlyOrders) * 100;
                      return (
                        <div key={`hour-orders-${hour}`} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "54px", color: "#475569", fontSize: "12px", fontWeight: 700 }}>
                            {String(hour).padStart(2, "0")}:00
                          </div>
                          <div style={{ flex: 1, background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${Math.max(width, 3)}%`, background: "linear-gradient(90deg, #ef4444, #dc2626)", height: "16px", borderRadius: "999px" }} />
                          </div>
                          <div style={{ width: "28px", textAlign: "right", fontSize: "12px", color: "#0f172a", fontWeight: 700 }}>
                            {formatNumber(row.orders || 0)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="trend-panel">
                  <h3>Revenue by Hour</h3>
                  <div className="trend-bars" style={{ flexDirection: "column", alignItems: "stretch", minHeight: "auto" }}>
                    {hourOrder.map((hour) => {
                      const row = (timeData.hourly || []).find((item) => item.hour === hour) || { revenue: 0 };
                      const width = (Number(row.revenue || 0) / maxHourlyRevenue) * 100;
                      return (
                        <div key={`hour-revenue-${hour}`} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "54px", color: "#475569", fontSize: "12px", fontWeight: 700 }}>
                            {String(hour).padStart(2, "0")}:00
                          </div>
                          <div style={{ flex: 1, background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${Math.max(width, 3)}%`, background: "linear-gradient(90deg, #10b981, #059669)", height: "16px", borderRadius: "999px" }} />
                          </div>
                          <div style={{ width: "72px", textAlign: "right", fontSize: "12px", color: "#0f172a", fontWeight: 700 }}>
                            {formatCurrency(row.revenue || 0)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="trend-panel" style={{ marginTop: "18px" }}>
                <h3>Orders / Revenue by Day</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={tableHeadStyle}>Day</th>
                        <th style={tableHeadStyle}>Orders</th>
                        <th style={tableHeadStyle}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayOrder.map((day) => {
                        const row = getDayRow(day);
                        return (
                          <tr key={day}>
                            <td style={tableCellStyle}>{day}</td>
                            <td style={tableCellStyle}>{formatNumber(row.orders || 0)}</td>
                            <td style={tableCellStyle}>{formatCurrency(row.revenue || 0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="trend-card">
          <div className="trend-header">
            <h2 className="trend-title">Operations & Payments</h2>
          </div>

          {operationsPaymentsLoading ? (
            <div className="loading">Loading operations and payment analytics...</div>
          ) : operationsPaymentsError ? (
            <div className="error">{operationsPaymentsError}</div>
          ) : operationsPaymentsEmpty ? (
            <div className="empty">No operations or payment data found for the selected range.</div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "18px",
                }}
              >
                <div className="kpi-card">
                  <p className="kpi-label">Completed Orders</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatNumber(operationsSummary?.completedOrders || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Pending Orders</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatNumber(operationsSummary?.pendingOrders || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Preparing Orders</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatNumber(operationsSummary?.preparingOrders || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Ready Orders</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatNumber(operationsSummary?.readyOrders || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Cancelled Orders</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {operationsSummary?.cancelledOrders == null
                      ? "Not available"
                      : formatNumber(operationsSummary?.cancelledOrders || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Completion Rate</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatPercent(operationsSummary?.completionRate || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Cancellation Rate</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {operationsSummary?.cancellationRate == null
                      ? "Not available"
                      : formatPercent(operationsSummary?.cancellationRate || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Total Revenue</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatCurrency(paymentsSummary?.totalRevenue || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Successful Payments</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatNumber(paymentsSummary?.successfulPayments || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Pending Payments</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatNumber(paymentsSummary?.pendingPayments || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Failed Payments</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {paymentsSummary?.failedPayments == null
                      ? "Not available"
                      : formatNumber(paymentsSummary?.failedPayments || 0)}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Payment Success Rate</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {formatPercent(paymentsSummary?.paymentSuccessRate || 0)}
                  </p>
                </div>
              </div>

              <div className="trend-panel">
                <h3>Revenue by Payment Method</h3>
                <div style={{ overflowX: "auto" }}>
                  {hasPaymentMethods ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={tableHeadStyle}>Method</th>
                          <th style={tableHeadStyle}>Orders</th>
                          <th style={tableHeadStyle}>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(paymentsSummary?.byMethod || []).map((method) => (
                          <tr key={method.method}>
                            <td style={tableCellStyle}>{method.method}</td>
                            <td style={tableCellStyle}>{formatNumber(method.orders)}</td>
                            <td style={tableCellStyle}>{formatCurrency(method.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty" style={{ margin: 0 }}>
                      No payment-method data found for the selected range.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="trend-card">
          <div className="trend-header">
            <h2 className="trend-title">AI Business Analyst</h2>
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi();
              }}
              style={{ display: "grid", gap: "12px" }}
            >
              <div className="field" style={{ minWidth: 0 }}>
                <label htmlFor="aiQuestion">Ask a question</label>
                <textarea
                  id="aiQuestion"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  rows={4}
                  placeholder="Ask about sales, products, customers, peak hours, or operations."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              <div className="trend-selector" style={{ flexWrap: "wrap" }}>
                {exampleQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => {
                      setAiQuestion(question);
                      handleAskAi(question);
                    }}
                    style={{ fontSize: "12px" }}
                  >
                    {question}
                  </button>
                ))}
              </div>

              <button className="apply-btn" type="submit" disabled={aiLoading}>
                {aiLoading ? "Thinking..." : "Ask"}
              </button>
            </form>

            {aiLoading ? (
              <div className="loading">Generating AI answer...</div>
            ) : aiError ? (
              <div className="error">{aiError}</div>
            ) : aiAnswer ? (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px",
                  color: "#0f172a",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {aiAnswer}
              </div>
            ) : (
              <div className="empty" style={{ margin: 0 }}>
                Ask a question to get a concise business answer from the current analytics data.
              </div>
            )}
          </div>
        </div>

        <div className="trend-card">
          <div className="trend-header">
            <h2 className="trend-title">Customer Analysis</h2>
            <div className="trend-selector">
              {[5, 10].map((limit) => (
                <button
                  key={limit}
                  type="button"
                  className={customerLimit === limit ? "active" : ""}
                  onClick={() => handleCustomerLimitChange(limit)}
                >
                  Top {limit}
                </button>
              ))}
            </div>
          </div>

          {customerLoading ? (
            <div className="loading">Loading customer analysis...</div>
          ) : customerError ? (
            <div className="error">{customerError}</div>
          ) : customerEmpty ? (
            <div className="empty">No customer activity found for the selected range.</div>
          ) : (
            <>
              {customerSummary && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "18px",
                  }}
                >
                  <div className="kpi-card">
                    <p className="kpi-label">Total Customers</p>
                    <p className="kpi-value" style={{ fontSize: "22px" }}>
                      {formatNumber(customerSummary.totalCustomers)}
                    </p>
                  </div>
                  <div className="kpi-card">
                    <p className="kpi-label">New Customers</p>
                    <p className="kpi-value" style={{ fontSize: "22px" }}>
                      {formatNumber(customerSummary.newCustomers)}
                    </p>
                  </div>
                  <div className="kpi-card">
                    <p className="kpi-label">Returning Customers</p>
                    <p className="kpi-value" style={{ fontSize: "22px" }}>
                      {formatNumber(customerSummary.returningCustomers)}
                    </p>
                  </div>
                  <div className="kpi-card">
                    <p className="kpi-label">Average Customer Spend</p>
                    <p className="kpi-value" style={{ fontSize: "22px" }}>
                      {formatCurrency(customerSummary.averageCustomerSpend)}
                    </p>
                  </div>
                </div>
              )}

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={tableHeadStyle}>Customer</th>
                      <th style={tableHeadStyle}>Orders</th>
                      <th style={tableHeadStyle}>Total Spend</th>
                      <th style={tableHeadStyle}>Average Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerData.map((customer) => (
                      <tr key={customer.customerId}>
                        <td style={tableCellStyle}>{customer.customerName}</td>
                        <td style={tableCellStyle}>{formatNumber(customer.orders)}</td>
                        <td style={tableCellStyle}>{formatCurrency(customer.totalSpend)}</td>
                        <td style={tableCellStyle}>{formatCurrency(customer.averageOrderValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="trend-card">
          <div className="trend-header">
            <h2 className="trend-title">Category Analysis</h2>
          </div>

          {categoryLoading ? (
            <div className="loading">Loading category analysis...</div>
          ) : categoryError ? (
            <div className="error">{categoryError}</div>
          ) : categoryEmpty ? (
            <div className="empty">No category sales found for the selected range.</div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "18px",
                }}
              >
                <div className="kpi-card">
                  <p className="kpi-label">Best-performing category</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {bestCategory?.category || "N/A"}
                  </p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Lowest-performing category</p>
                  <p className="kpi-value" style={{ fontSize: "22px" }}>
                    {lowestCategory?.category || "N/A"}
                  </p>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={tableHeadStyle}>Category</th>
                      <th style={tableHeadStyle}>Units Sold</th>
                      <th style={tableHeadStyle}>Revenue</th>
                      <th style={tableHeadStyle}>Revenue Contribution %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((category) => (
                      <tr key={category.category}>
                        <td style={tableCellStyle}>{category.category}</td>
                        <td style={tableCellStyle}>{formatNumber(category.unitsSold)}</td>
                        <td style={tableCellStyle}>{formatCurrency(category.revenue)}</td>
                        <td style={tableCellStyle}>
                          {formatPercent(category.revenueContributionPercent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="trend-card">
          <div className="trend-header">
            <h2 className="trend-title">Product Analysis</h2>
            <div className="trend-selector">
              {[5, 10].map((limit) => (
                <button
                  key={limit}
                  type="button"
                  className={productLimit === limit ? "active" : ""}
                  onClick={() => handleProductLimitChange(limit)}
                >
                  Top {limit}
                </button>
              ))}
            </div>
          </div>

          {productLoading ? (
            <div className="loading">Loading product analysis...</div>
          ) : productError ? (
            <div className="error">{productError}</div>
          ) : productEmpty ? (
            <div className="empty">No product sales found for the selected range.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeadStyle}>Product Name</th>
                    <th style={tableHeadStyle}>Units Sold</th>
                    <th style={tableHeadStyle}>Revenue</th>
                    <th style={tableHeadStyle}>Revenue Contribution %</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product) => (
                    <tr key={product.productId}>
                      <td style={tableCellStyle}>{product.productName}</td>
                      <td style={tableCellStyle}>{formatNumber(product.unitsSold)}</td>
                      <td style={tableCellStyle}>{formatCurrency(product.revenue)}</td>
                      <td style={tableCellStyle}>
                        {formatPercent(product.revenueContributionPercent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const tableHeadStyle = {
  textAlign: "left",
  padding: "12px 14px",
  borderBottom: "1px solid #e2e8f0",
  color: "#475569",
  fontSize: "13px",
  textTransform: "uppercase",
};

const tableCellStyle = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  color: "#0f172a",
};

export default SalesAnalysis;
