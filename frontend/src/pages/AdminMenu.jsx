import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getMenuItems,
  addMenuItem,
  deleteMenuItem,
} from "../services/menuService";

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] =
    useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await addMenuItem({
        name,
        price,
        category,
        description,
        image,
      });

      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImage("");

      fetchMenu();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      fetchMenu();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            color: "#dc2626",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          🍔 Admin Menu Management
        </h1>

        {/* Add Menu Form */}

        <form
          onSubmit={submitHandler}
          style={{
            background: "#fffdf8",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "25px",
            marginBottom: "35px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={{ marginBottom: "12px" }}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            style={{ marginBottom: "12px" }}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={{ marginBottom: "12px" }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            style={{ marginBottom: "12px" }}
          />

          <input
            type="text"
            placeholder="Food Image URL"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            style={{ marginBottom: "15px" }}
          />

          {image && (
            <div
              style={{
                marginBottom: "15px",
              }}
            >
              <img
                src={image}
                alt="Preview"
                style={{
                  width: "250px",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border:
                    "1px solid #e5e7eb",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              background:
                "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "white",
              border: "none",
              padding: "12px 22px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow:
                "0 4px 12px rgba(239,68,68,0.3)",
            }}
          >
            Add Menu Item
          </button>
        </form>

        {/* Current Menu */}

        <h2
          style={{
            color: "#dc2626",
            marginBottom: "20px",
          }}
        >
          Current Menu
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {menuItems.map((item) => (
            <div
              key={item._id}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px)";

                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(239,68,68,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";

                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(0,0,0,0.08)";
              }}
              style={{
                background: "#fffdf8",
                border:
                  "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "15px",
                transition: "0.3s",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.08)",
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "12px",
                  }}
                />
              )}

              <h3
                style={{
                  color: "#111827",
                }}
              >
                {item.name}
              </h3>

              <p>
                💰 Price: ₹{item.price}
              </p>

              <p>
                📂 Category: {item.category}
              </p>

              <p>{item.description}</p>

              <button
                onClick={() =>
                  handleDelete(item._id)
                }
                style={{
                  background:
                    "linear-gradient(135deg,#ef4444,#dc2626)",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow:
                    "0 4px 12px rgba(239,68,68,0.25)",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminMenu;