// src/api/cartApi.js
import api from './axiosConfig'; // Import axios instance đã cấu hình

/**
 * Lấy giỏ hàng của user đang đăng nhập.
 * API: GET /api/cart
 */
export const getCart = () => {
    return api.get('/cart');
};

/**
 * Thêm một sản phẩm vào giỏ.
 * API: POST /api/cart/items
 * @param {number} productVariantId - ID của biến thể sản phẩm
 * @param {number} quantity - Số lượng
 */
export const addItem = (productVariantId, quantity) => {
    return api.post('/cart/items', { productVariantId, quantity });
};

/**
 * Cập nhật số lượng của một món hàng.
 * API: PUT /api/cart/items/{itemId}
 * @param {number} cartItemId - ID của món hàng trong giỏ
 * @param {number} quantity - Số lượng mới
 */
export const updateItemQuantity = (cartItemId, quantity) => {
    return api.put(`/cart/items/${cartItemId}`, { quantity });
};

/**
 * Xóa một món hàng khỏi giỏ.
 * API: DELETE /api/cart/items/{itemId}
 * @param {number} cartItemId - ID của món hàng trong giỏ
 */
export const removeItem = (cartItemId) => {
    return api.delete(`/cart/items/${cartItemId}`);
};