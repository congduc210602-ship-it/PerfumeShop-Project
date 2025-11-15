// src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/shop/Header';
import Footer from '../components/shop/Footer';
import { Link, useNavigate } from 'react-router-dom';
import * as orderApi from '../api/orderApi'; // Import API đặt hàng
import './CheckoutPage.css'; // (Bạn sẽ cần CSS cho trang này sau)

// 1. NHẬN PROPS MỚI (user, cart, fetchCart)
const CheckoutPage = ({ user, onLogout, cart, fetchCart }) => {
    const navigate = useNavigate();

    // 2. State cho form
    const [shippingName, setShippingName] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingPhone, setShippingPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD'); // Mặc định là COD
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 3. Tự động điền thông tin user vào form
    useEffect(() => {
        if (user) {
            setShippingName(user.name || user.username || '');
            setShippingAddress(user.address || '');
            setShippingPhone(user.phoneNumber || '');
        }
    }, [user]); // Chạy lại khi user thay đổi

    // 4. Xử lý bấm nút "Đặt hàng"
    const handleSubmitOrder = async (e) => {
        e.preventDefault(); // Ngăn form reload trang
        
        if (!shippingName || !shippingAddress || !shippingPhone) {
            setError("Vui lòng điền đầy đủ thông tin giao hàng.");
            return;
        }

        setLoading(true);
        setError(null);

        const checkoutData = {
            shippingName,
            shippingAddress,
            shippingPhone,
            paymentMethod
        };

        try {
            // Gọi API tạo đơn hàng
            const response = await orderApi.createOrder(checkoutData);
            const newOrder = response.data;

            // Nếu thành công:
            // 1. Yêu cầu App.js tải lại giỏ hàng (giờ đã trống)
            await fetchCart(); 
            
            // 2. Chuyển hướng đến trang "Cảm ơn" với ID đơn hàng
            navigate(`/order-success/${newOrder.id}`);

        } catch (err) {
            console.error("Đặt hàng thất bại:", err);
            // Lấy lỗi từ backend (ví dụ: "Hết hàng")
            const message = err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
            setError(message);
            setLoading(false);
        }
    };

    // 5. Kiểm tra giỏ hàng trống (giống CartPage)
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
             <div className="cart-page-layout">
                <Header user={user} onLogout={onLogout} cart={cart} />
                <main className="cart-container empty">
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <p>Không có gì để thanh toán.</p>
                    <Link to="/" className="continue-shopping-btn">Tiếp tục mua sắm</Link>
                </main>
                <Footer />
            </div>
        )
    }

    // 6. Giao diện (thay thế code placeholder cũ)
    return (
        <div className="cart-page-layout">
            <Header user={user} onLogout={onLogout} cart={cart} />
            <main className="cart-container">
                <h1>Thanh toán</h1>
                <form onSubmit={handleSubmitOrder} className="cart-content">
                    {/* Cột trái: Thông tin giao hàng & Tóm tắt */}
                    <div className="cart-items-list">
                        
                        {/* --- FORM GIAO HÀNG --- */}
                        <h3>Thông tin giao hàng</h3>
                        <div className="checkout-form-group">
                            <label htmlFor="shippingName">Tên người nhận</label>
                            <input
                                type="text"
                                id="shippingName"
                                value={shippingName}
                                onChange={(e) => setShippingName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="checkout-form-group">
                            <label htmlFor="shippingPhone">Số điện thoại</label>
                            <input
                                type="text"
                                id="shippingPhone"
                                value={shippingPhone}
                                onChange={(e) => setShippingPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="checkout-form-group">
                            <label htmlFor="shippingAddress">Địa chỉ giao hàng</label>
                            <input
                                type="text"
                                id="shippingAddress"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                required
                            />
                        </div>

                        {/* --- TÓM TẮT ĐƠN HÀNG --- */}
                        <h3 style={{marginTop: '2rem'}}>Tóm tắt đơn hàng</h3>
                        {cart.items.map(item => (
                            <div key={item.cartItemId} className="checkout-item-summary">
                                <span>{item.productName} ({item.dungTich}) x {item.quantity}</span>
                                <span>{(item.linePrice).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        ))}
                         <p className="checkout-total-summary">
                            <span>Tổng cộng:</span>
                            <span>{cart.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                         </p>
                    </div>

                    {/* Cột phải: Chọn thanh toán */}
                    <div className="cart-summary">
                        <h3>Phương thức thanh toán</h3>
                        <div className="payment-options">
                            <label className="payment-option">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <img src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png" alt="COD" />
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </label>
                            <label className="payment-option disabled">
                                <input type="radio" name="paymentMethod" value="BANK" disabled />
                                <img src="https://salt.tikicdn.com/ts/upload/f1/f4/10/a809930c1d18f6f002241f8073a433a5.png" alt="Bank" />
                                <span>Thanh toán qua ngân hàng (Sắp có)</span>
                            </label>
                        </div>
                        
                        {error && <p className="checkout-error-message">{error}</p>}
                        
                        <button 
                            type="submit" 
                            className="checkout-btn" 
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;