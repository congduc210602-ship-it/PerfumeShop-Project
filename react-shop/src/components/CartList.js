// src/components/CartList.js
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Sử dụng instance Axios đã cấu hình
import './List.css'; // Sử dụng CSS chung

// (CHƯA CÓ) API này chúng ta sẽ phải tạo ở backend
const cartApi = {
    getAll: () => api.get('/admin/carts'), // API mới cần tạo
};

// --- Helper Functions (Hàm hỗ trợ) ---
const formatCartDate = (dateString) => {
    // (Giả sử CartEntity có trường 'updatedAt')
    if (!dateString) return "N/A";
    const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('vi-VN', options);
};

const getStatusClass = (itemCount) => {
    return itemCount > 0 ? 'status-delivered' : 'status-cancelled';
};
// -------------------------------------


function CartList() {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCarts = async () => {
        try {
            setLoading(true);
            // (Tạm thời API này sẽ lỗi 404 vì chưa tạo)
            const res = await cartApi.getAll();
            const cartData = res.data.data || res.data;

            if (Array.isArray(cartData)) {
                setCarts(cartData);
            } else {
                setCarts([]);
            }
            setError(null);
        } catch (err) {
            console.error("Lỗi khi tải danh sách giỏ hàng:", err);
            setError('Không thể tải danh sách giỏ hàng. (API chưa được tạo hoặc yêu cầu quyền ADMIN)');
            setCarts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarts();
    }, []);

    return (
        <div className="card">
            <h2>Quản lý Giỏ hàng (Đang hoạt động)</h2>
            <div className="top-bar">
                {/* TODO: Thêm filter (ví dụ: chỉ hiện giỏ hàng có đồ) */}
            </div>

            {loading && <p>Đang tải...</p>}
            {!loading && error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ID Giỏ hàng</th>
                            <th>Chủ sở hữu (User)</th>
                            <th>Số lượng món</th>
                            <th>Tổng tiền (Tạm tính)</th>
                            <th>Trạng thái</th>
                            <th>Cập nhật cuối</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.length > 0 ? (
                            carts.map((cart) => (
                                <tr key={cart.id}>
                                    <td>#{cart.id}</td>
                                    <td>
                                        <strong>{cart.userUsername}</strong> (ID: {cart.userId})
                                    </td>
                                    <td>{cart.totalItems} món</td>
                                    <td style={{ fontWeight: 'bold', color: '#4F46E5' }}>
                                        {cart.totalPrice.toLocaleString('vi-VN')} VNĐ
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(cart.totalItems)}`}>
                                            {cart.totalItems > 0 ? 'Đang hoạt động' : 'Trống'}
                                        </span>
                                    </td>
                                    <td>{formatCartDate(cart.updatedAt)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>Không tìm thấy giỏ hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CartList;