import axios from "axios";

const API_URL = "http://localhost:5000/api/tables";

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