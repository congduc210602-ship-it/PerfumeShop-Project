// src/pages/MyOrdersPage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/shop/Header';
import Footer from '../components/shop/Footer';
import { Link } from 'react-router-dom';
import * as orderApi from '../api/orderApi';
import './MyOrdersPage.css'; // Chúng ta sẽ tạo file này tiếp theo

const MyOrdersPage = ({ user, onLogout, cart }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await orderApi.getMyOrders();
                setOrders(response.data);
                setError(null);
            } catch (err) {
                console.error("Không thể tải lịch sử đơn hàng:", err);
                setError("Không thể tải lịch sử đơn hàng của bạn.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []); // Chỉ chạy 1 lần

    const formatOrderDate = (dateString) => {
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

    return (
        <div className="my-orders-layout">
            <Header user={user} onLogout={onLogout} cart={cart} />

            <main className="my-orders-container">
                <h1>Lịch sử đơn hàng</h1>

                {loading && <p>Đang tải đơn hàng của bạn...</p>}

                {error && <p className="error-message">{error}</p>}

                {!loading && !error && orders.length === 0 && (
                    <div className="no-orders">
                        <p>Bạn chưa có đơn hàng nào.</p>
                        <Link to="/" className="continue-shopping-btn">Bắt đầu mua sắm</Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-card-header">
                                    <div>
                                        <span className="order-id">Mã đơn: #{order.id}</span>
                                        <span className="order-date">Ngày đặt: {formatOrderDate(order.orderDate)}</span>
                                    </div>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-card-body">
                                    {order.items.map(item => (
                                        <div key={item.id} className="order-item-summary">
                                            <img
                                                src={item.imageUrl || 'https://placehold.co/80'}
                                                alt={item.productName}
                                                className="order-item-image"
                                            />
                                            <span className="item-info">
                                                {item.productName} ({item.dungTich})
                                            </span>
                                            <span className="item-qty">x {item.quantity}</span>
                                            <span className="item-price">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-card-footer">
                                    <div className="order-shipping-info">
                                        <p><strong>Giao đến:</strong> {order.shippingName}, {order.shippingPhone}</p>
                                        <p>{order.shippingAddress}</p>
                                    </div>
                                    <div className="order-total">
                                        <span>Tổng cộng:</span>
                                        <span className="total-amount">
                                            {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default MyOrdersPage;