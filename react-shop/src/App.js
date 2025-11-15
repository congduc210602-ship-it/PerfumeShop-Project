import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import BannerList from './components/BannerList';
import BrandList from './components/BrandList';
import UserList from './components/UserList';
import OrderList from './components/OrderList';
import CartList from './components/CartList';
import Login from './components/Login';
import Register from './components/Register';
import AuthService from './api/AuthService';
import './App.css';

import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import * as cartApi from './api/cartApi';
import * as userApi from './api/userApi';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';

// (AdminDashboard giữ nguyên)
function AdminDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("products");
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo" onClick={() => setActiveMenu("")} style={{ cursor: "pointer" }}>Admin Dashboard</h2>
        <ul className="menu">
          <li className={activeMenu === "products" ? "active" : ""} onClick={() => setActiveMenu("products")}> Products </li>
          <li className={activeMenu === "categories" ? "active" : ""} onClick={() => setActiveMenu("categories")}> Categories </li>
          <li className={activeMenu === "brands" ? "active" : ""} onClick={() => setActiveMenu("brands")}> Brands </li>
          <li className={activeMenu === "banners" ? "active" : ""} onClick={() => setActiveMenu("banners")}> Banners </li>
          <li className={activeMenu === "orders" ? "active" : ""} onClick={() => setActiveMenu("orders")}> Orders </li>
          <li className={activeMenu === "carts" ? "active" : ""} onClick={() => setActiveMenu("carts")}> Carts </li>
          <li className={activeMenu === "users" ? "active" : ""} onClick={() => setActiveMenu("users")}> Users </li>
          <li onClick={onLogout} style={{ color: "#ef4444", cursor: "pointer", marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #4b5563' }}> Logout ({user.username})</li>
        </ul>
      </aside>
      <main className="main-content">
        {activeMenu === "products" && <ProductList />}
        {activeMenu === "categories" && <CategoryList />}
        {activeMenu === "banners" && <BannerList />}
        {activeMenu === "brands" && <BrandList />}
        {activeMenu === "orders" && <OrderList />}
        {activeMenu === "carts" && <CartList />}
        {activeMenu === "users" && <UserList />}
        {!activeMenu && (<div style={{ textAlign: "center", marginTop: "50px" }}><h2>Welcome {user.username} (Admin)</h2><p>Chọn mục sidebar</p></div>)}
      </main>
    </div>
  );
}

// (ProtectedAdminRoute giữ nguyên)
function ProtectedAdminRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
}


function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const response = await cartApi.getCart();
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart(null);
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchCart();
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    fetchCart();
  };
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    clearCart();
  };

  const addToCart = async (productVariantId, quantity) => {
    try {
      const response = await cartApi.addItem(productVariantId, quantity);
      setCart(response.data);
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Thêm vào giỏ hàng thất bại.");
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const response = await cartApi.updateItemQuantity(cartItemId, quantity);
      setCart(response.data);
    } catch (err) {
      console.error("Failed to update cart item:", err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await cartApi.removeItem(cartItemId);
      setCart(response.data);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  // --- 2. THÊM HÀM MỚI XỬ LÝ UPDATE PROFILE ---
  /**
   * Hàm này được gọi từ ProfilePage
   * @param {object} updateData - { name, email, address, phoneNumber }
   */
  const handleUpdateUser = async (updateData) => {
    try {
      // 1. Gọi API
      const response = await userApi.updateMyProfile(updateData);
      const updatedUser = response.data; // Đây là UserProfileDTO mới

      // 2. Cập nhật state của React
      setUser(updatedUser);

      // 3. Cập nhật localStorage
      AuthService.updateLocalUser(updatedUser);

      // Ném ra "true" để ProfilePage biết là thành công
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Ném ra lỗi để ProfilePage bắt được
      throw error;
    }
  };

  return (
    <Router>
      <Routes>

        {/* 1. Trang Chủ / Shop (ĐÃ SỬA: Thêm cart) */}
        <Route
          path="/"
          element={<ShopPage
            user={user}
            onLogout={handleLogout}
            cart={cart} // <-- SỬA LỖI Ở ĐÂY
          />}
        />

        {/* 2. Trang Chi tiết Sản phẩm (ĐÃ SỬA: Thêm addToCart) */}
        <Route
          path="/products/:productId"
          element={<ProductDetailPage
            user={user}
            onLogout={handleLogout}
            cart={cart}
            addToCart={addToCart} // <-- SỬA LỖI Ở ĐÂY
          />}
        />

        {/* Trang Giỏ hàng (Đã đúng) */}
        <Route
          path="/cart"
          element={
            user ? (
              <CartPage
                user={user}
                onLogout={handleLogout}
                cart={cart}
                updateCartItem={updateCartItem}
                removeFromCart={removeFromCart}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 2. CẬP NHẬT ROUTE CHECKOUT */}
        <Route
          path="/checkout"
          element={
            user ? (
              <CheckoutPage
                user={user}
                onLogout={handleLogout}
                cart={cart}
                fetchCart={fetchCart} // <-- 3. TRUYỀN HÀM fetchCart
              />
            ) : (<Navigate to="/login" replace />)
          }
        />

        {/* 4. THÊM ROUTE ORDER SUCCESS */}
        <Route
          path="/order-success/:orderId"
          element={
            user ? (
              <OrderSuccessPage
                user={user}
                onLogout={handleLogout}
                cart={cart} // Truyền giỏ hàng (lúc này đã trống)
              />
            ) : (<Navigate to="/login" replace />)
          }
        />

        {/* 5. (TÙY CHỌN) THÊM ROUTE LỊCH SỬ ĐƠN HÀNG */}

        <Route
          path="/my-orders"
          element={
            user ? (
              <MyOrdersPage user={user} onLogout={handleLogout} cart={cart} />
            ) : (<Navigate to="/login" replace />)
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage
                user={user}
                onLogout={handleLogout}
                cart={cart}
                onUpdateUser={handleUpdateUser}
              />
            ) : (<Navigate to="/login" replace />)
          }
        />

        {/* 3. Trang Đăng nhập (Giữ nguyên) */}
        <Route
          path="/login"
          element={
            user ? (
              user.role === "ADMIN" ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* 4. Trang Đăng ký (Giữ nguyên) */}
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register onRegisterSuccess={handleLogin} />
            )
          }
        />

        {/* 5. Trang Admin (Giữ nguyên) */}
        <Route path="/admin" element={<ProtectedAdminRoute user={user}> <AdminDashboard user={user} onLogout={handleLogout} /> </ProtectedAdminRoute>} />

        {/* 6. Route mặc định (Giữ nguyên) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;