import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

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
