// src/api/userApi.js
import api from './axiosConfig';

/**
 * Cập nhật thông tin profile (Tên, email, SĐT, địa chỉ)
 * của user đang đăng nhập.
 * API: PUT /api/users/profile
 */
export const updateMyProfile = (profileData) => {
    // profileData là object: { name, email, address, phoneNumber }
    return api.put('/users/profile', profileData);
};

// (Trong tương lai, các hàm như đổi mật khẩu cũng có thể thêm vào đây)