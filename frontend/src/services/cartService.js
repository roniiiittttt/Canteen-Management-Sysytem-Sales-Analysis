import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

export const addToCart = async (
  menuItem
) => {
  const token = localStorage.getItem(
    "token"
  );

  const response = await axios.post(
    `${API_URL}/add`,
    {
      menuItem,
      quantity: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCartItems = async () => {
  const token = localStorage.getItem(
    "token"
  );

  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const increaseQuantity = async (
  id
) => {
  const token = localStorage.getItem(
    "token"
  );

  const response = await axios.put(
    `${API_URL}/increase/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const decreaseQuantity = async (
  id
) => {
  const token = localStorage.getItem(
    "token"
  );

  const response = await axios.put(
    `${API_URL}/decrease/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const removeCartItem = async (
  id
) => {
  const token = localStorage.getItem(
    "token"
  );

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