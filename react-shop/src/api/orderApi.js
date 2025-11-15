// src/api/orderApi.js
import api from './axiosConfig';

/**
 * Tạo một đơn hàng mới (Thanh toán).
 * Gửi thông tin giao hàng và PTTT.
 * API: POST /api/orders
 */
export const createOrder = (checkoutData) => {
    // checkoutData là một object chứa:
    // { shippingName, shippingAddress, shippingPhone, paymentMethod }
    return api.post('/orders', checkoutData);
};

/**
 * Lấy lịch sử đơn hàng của user đang đăng nhập.
 * API: GET /api/orders/my-orders
 */
export const getMyOrders = () => {
    return api.get('/orders/my-orders');
};

/**
 * (Admin) Lấy tất cả đơn hàng.
 * API: GET /api/orders
 */
export const getAllOrders = () => {
    return api.get('/orders');
};