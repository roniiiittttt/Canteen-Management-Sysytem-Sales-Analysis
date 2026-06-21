import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="bg-video"
        poster="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
      >
        <source src="https://cdn.pixabay.com/video/2020/02/17/32468-392875154_large.mp4" type="video/mp4" />
      </video>
      <div className="bg-overlay"></div>

      {/* Injecting scoped premium styles, keyframes and google fonts directly */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .login-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          gap: 20px;
        }

        .bg-video {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.55);
          z-index: 0;
        }

        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          padding: 45px 35px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 25px 55px -12px rgba(15, 23, 42, 0.35), 
                      inset 0 1px 1px rgba(255, 255, 255, 0.9);
          text-align: center;
          animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          box-sizing: border-box;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .logo-icon {
          font-size: 28px;
          filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.2));
        }

        .logo-text {
          font-size: 30px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
          color: #ef4444; /* Dashboard red */
        }

        .logo-text-suffix {
          color: #1e293b;
        }

        .subtitle {
          color: #475569;
          font-size: 15px;
          margin: 0 0 32px 0;
          font-weight: 400;
        }

        .error-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #b91c1c;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
          animation: shake 0.4s ease-in-out;
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;
        }

        .form-input {
          width: 100%;
          padding: 15px 16px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          font-size: 15px;
          font-weight: 500;
          outline: none;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }

        .form-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .form-input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
          transform: translateY(-1px);
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.35);
          filter: brightness(1.03);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .footer-text {
          margin-top: 32px;
          color: #475569;
          font-size: 14px;
        }

        .register-link {
          color: #ef4444;
          text-decoration: none;
          font-weight: 600;
          margin-left: 6px;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .register-link:hover {
          color: #dc2626;
          text-shadow: 0 0 8px rgba(239, 68, 68, 0.15);
          transform: translateX(2px);
        }

        .developer-footer {
          position: relative;
          z-index: 1;
          color: rgba(255, 255, 255, 0.45);
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-top: 10px;
          text-align: center;
          animation: fadeIn 1s ease both;
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="login-card">
        <div className="logo-wrapper">
          <span className="logo-icon">🍽️</span>
          <h1 className="logo-text">Canteen<span className="logo-text-suffix">MS</span></h1>
        </div>
        <p className="subtitle">Login to continue</p>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter Password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <p className="footer-text">
          New User?
          <Link to="/register" className="register-link">
            Register Here
          </Link>
        </p>
      </div>

      <div className="developer-footer">
        Developed with love by Ronit Chaudhari
      </div>
    </div>
  );
}

export default Login;