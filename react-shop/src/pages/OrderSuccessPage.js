// src/pages/OrderSuccessPage.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/shop/Header';
import Footer from '../components/shop/Footer';
// import './OrderSuccessPage.css'; // Sẽ tạo CSS sau

const OrderSuccessPage = ({ user, onLogout, cart }) => {
    const { orderId } = useParams();

    return (
        <div className="cart-page-layout"> {/* Tạm dùng CSS của CartPage */}
            <Header user={user} onLogout={onLogout} cart={cart} />
            <main className="cart-container empty" style={{textAlign: 'center', padding: '4rem 2rem'}}>
                <span style={{fontSize: '4rem', display: 'block', marginBottom: '1rem'}}>✅</span>
                <h2>Đặt hàng thành công!</h2>
                <p>Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là: <strong>#{orderId}</strong></p>
                <p>Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng sớm nhất.</p>
                <Link to="/" className="continue-shopping-btn" style={{marginTop: '1.5rem'}}>
                    Tiếp tục mua sắm
                </Link>
                <Link to="/my-orders" className="continue-shopping-btn" style={{marginTop: '1.5rem', marginLeft: '1rem', backgroundColor: '#6c757d'}}>
                    Xem lịch sử đơn hàng
                </Link>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccessPage;