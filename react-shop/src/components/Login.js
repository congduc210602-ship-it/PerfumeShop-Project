import React, { useState } from "react";
import AuthService from "../api/AuthService";
import { Link } from 'react-router-dom'; // <-- GIỮ IMPORT NÀY
import "./Login.css";

// XÓA prop 'onToggleForm'
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // SỬA: Gửi dữ liệu dưới dạng JSON
      const userData = await AuthService.login(username, password);
      // Gửi userData (có role) cho App.js
      onLogin(userData);
    } catch (err) {
      // Hiển thị lỗi rõ ràng hơn khi đăng nhập thất bại
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Đăng nhập thất bại. Sai tài khoản hoặc mật khẩu.";
      setError(errMsg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {error && <p className="form-error">{error}</p>}

        {/* --- SỬA LẠI: Dùng Link trực tiếp đến /register --- */}
        <p className="form-toggle">
          Chưa có tài khoản?{" "}
          <Link to="/register">Đăng ký</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;