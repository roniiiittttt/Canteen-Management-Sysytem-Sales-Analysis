import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getSalesOverview,
  getSalesTrends,
  getProductAnalysis,
  getCategoryAnalysis,
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchOverview(defaults);
      fetchTrends(defaults, trendGroupBy);
      fetchProducts(defaults, productLimit);
      fetchCategories(defaults);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [defaults, trendGroupBy, productLimit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const range = { startDate, endDate };
    fetchOverview(range);
    fetchTrends(range, trendGroupBy);
    fetchProducts(range, productLimit);
    fetchCategories(range);
  };

  const handleGroupByChange = (groupBy) => {
    setTrendGroupBy(groupBy);
    fetchTrends({ startDate, endDate }, groupBy);
  };

  const handleProductLimitChange = (limit) => {
    setProductLimit(limit);
    fetchProducts({ startDate, endDate }, limit);
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
  const bestCategory = categoryData[0] || null;
  const lowestCategory = categoryData[categoryData.length - 1] || null;

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
