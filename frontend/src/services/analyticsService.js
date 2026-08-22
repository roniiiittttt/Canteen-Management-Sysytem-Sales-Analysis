import axios from "axios";
import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/v1/analytics`;

export const getSalesOverview = async ({
  startDate,
  endDate,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/overview`,
    {
      params: {
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getSalesTrends = async ({
  startDate,
  endDate,
  groupBy = "day",
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/sales-trends`,
    {
      params: {
        startDate,
        endDate,
        groupBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getProductAnalysis = async ({
  startDate,
  endDate,
  limit = 10,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/products`,
    {
      params: {
        startDate,
        endDate,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCategoryAnalysis = async ({
  startDate,
  endDate,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/categories`,
    {
      params: {
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCustomerAnalysis = async ({
  startDate,
  endDate,
  limit = 10,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/customers`,
    {
      params: {
        startDate,
        endDate,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getTimeAnalysis = async ({
  startDate,
  endDate,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/time-analysis`,
    {
      params: {
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getOperationsPayments = async ({
  startDate,
  endDate,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/operations-payments`,
    {
      params: {
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const askAiAnalysis = async ({
  question,
  startDate,
  endDate,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/ai-analysis`,
    {
      question,
      startDate,
      endDate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
