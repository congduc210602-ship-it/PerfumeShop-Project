// src/components/OrderList.js
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Sử dụng instance Axios đã cấu hình
import './List.css'; // Sử dụng CSS chung

// API để quản lý Order (Chỉ ADMIN được dùng)
const orderApi = {
    getAll: () => api.get('/orders'),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// --- Helper Functions (Hàm hỗ trợ) ---
const formatOrderDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('vi-VN', options);
};

const getStatusClass = (status) => {
    switch (status) {
        case 'PENDING': return 'status-pending';
        case 'PROCESSING': return 'status-processing';
        case 'SHIPPED': return 'status-shipped';
        case 'DELIVERED': return 'status-delivered';
        case 'CANCELLED': return 'status-cancelled';
        default: return '';
    }
};
// -------------------------------------


function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE MỚI CHO MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đang xem
    // -----------------------------

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await orderApi.getAll();
            const orderData = res.data.data || res.data;

            if (Array.isArray(orderData)) {
                setOrders(orderData);
            } else {
                setOrders([]);
            }
            setError(null);
        } catch (err) {
            console.error("Lỗi khi tải danh sách đơn hàng:", err);
            setError('Không thể tải danh sách đơn hàng. (Yêu cầu quyền ADMIN)');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // --- HÀM MỚI ĐỂ MỞ/ĐÓNG MODAL ---
    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };
    // ----------------------------------

    // (Tùy chọn) Hàm xử lý cập nhật trạng thái
    const handleStatusChange = async (orderId, newStatus) => {
        if (!newStatus || !selectedOrder || selectedOrder.status === newStatus) return;

        if (window.confirm(`Bạn có chắc muốn đổi trạng thái đơn #${orderId} thành ${newStatus}?`)) {
            try {
                await orderApi.updateStatus(orderId, newStatus);
                // Cập nhật lại state (cả list và modal)
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                fetchOrders();
            } catch (err) {
                console.error("Lỗi cập nhật trạng thái:", err);
                alert("Cập nhật thất bại. (API chưa được tạo?)");
            }
        }
    };

    return (
        <div className="card">
            <h2>Quản lý Đơn hàng</h2>
            {/* ... (top-bar, loading, error) ... */}

            {!loading && !error && (
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Địa chỉ</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Chi tiết</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        <strong>{order.shippingName}</strong><br />
                                        <small>{order.shippingPhone}</small>
                                    </td>
                                    <td>{formatOrderDate(order.orderDate)}</td>
                                    <td title={order.shippingAddress}>
                                        {order.shippingAddress.length > 30 ? order.shippingAddress.substring(0, 30) + '...' : order.shippingAddress}
                                    </td>
                                    <td style={{ fontWeight: 'bold', color: '#4F46E5' }}>
                                        {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {order.items.length} món
                                    </td>
                                    <td>
                                        {/* --- SỬA NÚT BẤM --- */}
                                        <button className="edit" onClick={() => openModal(order)}>
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>Không tìm thấy đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* --- (MỚI) MODAL HIỂN THỊ CHI TIẾT --- */}
            {isModalOpen && selectedOrder && (
                <div className="modal">
                    <div className="modal-content order-detail-modal">
                        <h3>Chi tiết Đơn hàng #{selectedOrder.id}</h3>

                        <div className="order-detail-layout">
                            {/* Cột 1: Thông tin khách hàng */}
                            <div className="order-detail-group">
                                <h4>Thông tin khách hàng</h4>
                                <p><strong>Tên:</strong> {selectedOrder.shippingName}</p>
                                <p><strong>SĐT:</strong> {selectedOrder.shippingPhone}</p>
                                <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                                <p><strong>PT Thanh toán:</strong> {selectedOrder.paymentMethod}</p>
                            </div>

                            {/* Cột 2: Cập nhật trạng thái */}
                            <div className="order-detail-group">
                                <h4>Cập nhật trạng thái</h4>
                                <p>Trạng thái hiện tại:
                                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </p>
                                <select
                                    defaultValue={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PROCESSING">PROCESSING</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>
                        </div>

                        {/* Chi tiết các món hàng */}
                        <div className="order-detail-items">
                            <h4>Các sản phẩm</h4>
                            {selectedOrder.items.map(item => (
                                <div key={item.id} className="order-item-detail">
                                    <img src={item.imageUrl || 'https://placehold.co/80'} alt={item.productName} />
                                    <div className="item-info">
                                        <span className="item-name">{item.productName} ({item.dungTich})</span>
                                        <span className="item-price-detail">
                                            {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
                                        </span>
                                    </div>
                                    <span className="item-line-total">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                                    </span>
                                </div>
                            ))}
                            <div className="order-detail-total">
                                <strong>Tổng cộng: {selectedOrder.totalAmount.toLocaleString('vi-VN')} VNĐ</strong>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="delete" onClick={closeModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- HẾT MODAL --- */}
        </div>
    );
}

export default OrderList;