import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      console.log("Passwords Do Not Match");
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Auto Login After Register
      const loginData = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem(
        "token",
        loginData.token
      );

      if (
        loginData.user.role === "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#2563eb)",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "35px",
          borderRadius: "20px",
          background:
            "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          🍽️ Register
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            placeholder="Confirm Password"
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
          />

          <br />
          <br />

          <label
            style={{
              color: "white",
            }}
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() =>
                setShowPassword(
                  !showPassword
                )
              }
            />
            Show Password
          </label>

          <br />
          <br />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
            }}
          >
            Register
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <Link to="/">
            Already Have Account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;