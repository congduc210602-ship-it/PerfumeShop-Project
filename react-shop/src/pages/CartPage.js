// src/pages/CartPage.js
import React from 'react';
import Header from '../components/shop/Header';
import Footer from '../components/shop/Footer';
import { Link, useNavigate } from 'react-router-dom'; // <-- 1. IMPORT useNavigate
import './CartPage.css';

const CartPage = ({ user, onLogout, cart, updateCartItem, removeFromCart }) => {
    
    const navigate = useNavigate(); // <-- 2. KHỞI TẠO HOOK

    const handleQuantityChange = (item, newQuantity) => {
        const quantity = Math.max(1, parseInt(newQuantity));
        updateCartItem(item.cartItemId, quantity);
    };

    // --- 3. TẠO HÀM XỬ LÝ CHECKOUT ---
    const handleCheckout = () => {
        // Chuyển người dùng đến trang /checkout
        navigate('/checkout');
    };
    // ---------------------------------

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="cart-page-layout">
                <Header user={user} onLogout={onLogout} cart={cart} />
                <main className="cart-container empty">
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <Link to="/" className="continue-shopping-btn">Tiếp tục mua sắm</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cart-page-layout">
            <Header user={user} onLogout={onLogout} cart={cart} />
            <main className="cart-container">
                <h1>Giỏ hàng của bạn</h1>
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cart.items.map(item => (
                            <div key={item.cartItemId} className="cart-item">
                                {/* ... (img, item-details, item-quantity-selector) ... */}
                                <img src={item.productImageUrl || 'https://placehold.co/100'} alt={item.productName} />
                                <div className="item-details">
                                    <p className="item-name">{item.productName}</p>
                                    <p className="item-variant">{item.dungTich}</p>
                                    <p className="item-price">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                                
                                <div className="item-quantity-selector">
                                    <button 
                                        className="quantity-btn minus-btn"
                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="quantity-value">{item.quantity}</span>
                                    <button 
                                        className="quantity-btn plus-btn"
                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="item-line-price">
                                    {(item.linePrice).toLocaleString('vi-VN')} VNĐ
                                </div>
                                <button 
                                    className="remove-item-btn"
                                    onClick={() => removeFromCart(item.cartItemId)}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Tổng cộng</h3>
                        <p>
                            <span>Tổng số sản phẩm:</span>
                            <span>{cart.totalItems}</span>
                        </p>
                        <p>
                            <span>Phí vận chuyển:</span>
                            <span>Miễn phí</span>
                        </p>
                        <p>
                            <span>Tổng tiền:</span>
                            <span className="summary-total-price">
                                {cart.totalPrice.toLocaleString('vi-VN')} VNĐ
                            </span>
                        </p>
                        
                        {/* --- 4. THÊM onClick VÀO NÚT --- */}
                        <button 
                            className="checkout-btn"
                            onClick={handleCheckout} 
                        >
                            Tiến hành thanh toán
                        </button>
                        {/* ----------------------------- */}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;