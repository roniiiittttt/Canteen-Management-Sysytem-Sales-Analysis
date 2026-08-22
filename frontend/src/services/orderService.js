import axios from "axios";
import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/orders`;

export const placeOrder = async (paymentDetails) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    paymentDetails,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyOrders = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/myorders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
