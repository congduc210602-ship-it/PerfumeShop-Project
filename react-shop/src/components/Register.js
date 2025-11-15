import React, { useState } from "react";
import AuthService from "../api/AuthService";
import { Link, useNavigate } from 'react-router-dom'; // <-- IMPORT Link và useNavigate
import "./Register.css"; 

// XÓA prop 'onToggleForm'
function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate(); // Hook chuyển hướng

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      // 1. Dữ liệu cần gửi
      const registerData = { 
        username, 
        password,
        name: username,
        email: `${username}@perfumeshop.com`, 
        address: "TP. Ho Chi Minh", 
        phoneNumber: "0901234567", 
      };
      
      // 2. Gọi API đăng ký
      const response = await AuthService.register(registerData);
      
      // 3. Đăng ký thành công
      setSuccess(response.message || "Đăng ký thành công! Đang chuyển hướng...");
      
      // 4. Tự động chuyển hướng đến /login sau 2 giây
      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess(); 
        navigate("/login"); // <-- CHUYỂN HƯỚNG SANG ROUTE /login
      }, 2000);

    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.";
      setError(errMsg);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {/* Input Username */}
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
          {/* Input Password */}
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          {/* Input Confirm Password */}
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
          
          {/* Inputs ẩn cho Backend DTO */}
          <input type="hidden" name="name" value={username} />
          <input type="hidden" name="email" value={`${username}@perfumeshop.com`} />
          <input type="hidden" name="address" value="TP. Ho Chi Minh" />
          <input type="hidden" name="phoneNumber" value="0901234567" />

          <button type="submit" disabled={success !== ""}>Register</button>
        </form>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        {/* --- Link về trang Login --- */}
        <p className="form-toggle">
          Đã có tài khoản?{" "}
          <Link to="/login">Đăng nhập</Link>
        </p>
        
      </div>
    </div>
  );
}

export default Register;