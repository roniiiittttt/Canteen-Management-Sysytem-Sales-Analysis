import axios from "axios";
import API_BASE_URL from "../config/api";

const API_URL =
  `${API_BASE_URL}/api/dashboard`;

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};