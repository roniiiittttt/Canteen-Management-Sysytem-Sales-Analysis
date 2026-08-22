import axios from "axios";
import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/tables`;

export const bookTable = async (bookingData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/book`,
    bookingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyBookings = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/mybookings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};