// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/shop/Header';
import Footer from '../components/shop/Footer';

import './ProfilePage.css'; // Dùng file CSS bạn đã tạo

// 1. NHẬN PROPS onUpdateUser
const ProfilePage = ({ user, onLogout, cart, onUpdateUser }) => {
    
    // 2. TẠO THÊM STATE CHO FORM
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    
    // 3. STATE CHO LOADING VÀ THÔNG BÁO
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // 4. DÙNG useEffect ĐỂ CẬP NHẬT FORM KHI 'user' THAY ĐỔI
    // (Quan trọng nếu user load chậm)
    useEffect(() => {
        if(user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setAddress(user.address || '');
            setPhone(user.phoneNumber || '');
        }
    }, [user]); // Chạy lại khi prop 'user' thay đổi

    // 5. KẾT NỐI API VÀO HÀM SUBMIT
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const updateData = {
            name,
            email,
            address,
            phoneNumber: phone // Đổi 'phone' thành 'phoneNumber' cho DTO
        };

        try {
            // Gọi hàm từ App.js
            await onUpdateUser(updateData);
            setMessage("Cập nhật thông tin thành công!");
        } catch (apiError) {
            // Bắt lỗi (ví dụ: SĐT không hợp lệ)
            const errorMsg = apiError.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.";
            setError(errorMsg);
        } finally {
            setLoading(false);
            // Tự động xóa thông báo sau 3s
            setTimeout(() => {
                setMessage('');
                setError('');
            }, 3000);
        }
    };

    // Đảm bảo user đã được tải
    if (!user) {
        return <p>Đang tải thông tin...</p>;
    }

    return (
        <div className="profile-page-layout">
            <Header user={user} onLogout={onLogout} cart={cart} />
            
            <main className="profile-container">
                <h1>Thông tin tài khoản</h1>
                <p>Quản lý thông tin cá nhân của bạn.</p>
                
                <div className="profile-content">
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                        
                        <div className="form-group">
                            <label htmlFor="username">Tên đăng nhập (Không thể đổi)</label>
                            <input 
                                type="text" 
                                id="username" 
                                value={user.username} 
                                disabled 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="name">Họ và Tên</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập họ và tên của bạn"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại (0xxxxxxxxx)</label>
                            <input 
                                type="text" 
                                id="phone" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Nhập số điện thoại (10-11 số)"
                                required
                                // Thêm pattern giống backend để báo lỗi sớm
                                pattern="^0\d{9,10}$" 
                                title="Số điện thoại phải có 10 hoặc 11 số và bắt đầu bằng 0"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ</label>
                            <input 
                                type="text" 
                                id="address" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Nhập địa chỉ"
                                required
                            />
                        </div>

                        {/* Thông báo thành công */}
                        {message && <p className="success-message">{message}</p>}
                        
                        {/* Thông báo lỗi (Thêm class "error-message" vào CSS của bạn) */}
                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="update-profile-btn" disabled={loading}>
                            {loading ? "Đang lưu..." : "Cập nhật thông tin"}
                        </button>
                    </form>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default ProfilePage;