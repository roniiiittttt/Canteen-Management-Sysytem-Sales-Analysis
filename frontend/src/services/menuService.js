import axios from "axios";

const API_URL = "http://localhost:5000/api/menu";

export const getMenuItems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addMenuItem = async (itemData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    itemData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteMenuItem = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};