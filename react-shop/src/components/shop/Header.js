// src/components/shop/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import * as productApi from '../../api/productApi';

const isCategoryActive = (category, selectedId) => {
    if (!category) return false;
    if (category.id == selectedId) return true;
    if (category.children?.some(child => child.id == selectedId)) return true;
    return false;
};

const Header = ({
    user,
    onLogout,
    searchTerm = "",
    setSearchTerm = () => { },
    onGoHome,
    cart,
    categories = [],
    brands = [],
    selectedCategory = null,
    onSelectCategory = () => { },
    selectedBrand = null,
    onSelectBrand = () => { }
}) => {

    // --- (PHẦN LOGIC HEADER GỐC - Giữ nguyên) ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchFocus, setIsSearchFocus] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const [inputValue, setInputValue] = useState(searchTerm);

    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeBrands = Array.isArray(brands) ? brands : [];

    // --- 1. (THAY ĐỔI) STATE CHO MEGA MENU ---
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const megaMenuTimerRef = useRef(null); // Ref để giữ timer

    // (useEffect cho input, search, click outside giữ nguyên)
    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocus(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userDropdownRef, searchRef]);

    useEffect(() => {
        if (inputValue.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await productApi.searchProducts(inputValue);
                const productArray = response.data.data || response.data.content || response.data;
                if (Array.isArray(productArray)) {
                    setSuggestions(productArray.slice(0, 5));
                } else {
                    setSuggestions([]);

                }
            } catch (error) {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    const handleGoHomeClick = onGoHome ? onGoHome : () => navigate('/');

    const handleSuggestionClick = () => {
        setIsSearchFocus(false);
        setSuggestions([]);
        setInputValue('');
        setSearchTerm('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(inputValue.trim());
        setIsSearchFocus(false);
        setSuggestions([]);
    };

    // --- 2. (THAY ĐỔI) LOGIC HIỂN THỊ MEGA MENU ---
    const handleCategoryMouseEnter = (category) => {
        // Nếu có timer đang chạy, hủy nó
        if (megaMenuTimerRef.current) {
            clearTimeout(megaMenuTimerRef.current);
        }
        // Đặt category đang trỏ chuột
        setHoveredCategory(category);
    };

    const handleCategoryMouseLeave = () => {
        // Bắt đầu một timer. Nếu sau 100ms chuột không trỏ vào menu, ẩn nó đi
        megaMenuTimerRef.current = setTimeout(() => {
            setHoveredCategory(null);
        }, 100);
    };

    // Hàm này để trỏ chuột vào cái mega menu
    const handleMenuMouseEnter = () => {
        if (megaMenuTimerRef.current) {
            clearTimeout(megaMenuTimerRef.current);
        }
    };
    // Rời chuột khỏi mega menu
    const handleMenuMouseLeave = () => {
        setHoveredCategory(null);
    };

    // Tính toán biến cho menu BÊN NGOÀI
    const currentHovered = hoveredCategory || null;
    const hasHoveredChildren = currentHovered?.children?.length > 0;
    // Sửa: Chỉ hiển thị mega menu nếu *có* category đang được hover
    const showMegaMenu = currentHovered && (hasHoveredChildren || safeBrands.length > 0);
    // ----------------------------------------------------

    return (
        <>
            {/* --- Phần Header Gốc (Top Banner, Logo, Search, User) --- */}
            <div className="header-top-banner">
                Thương hiệu nước hoa mới nổi tại Việt Nam
            </div>

            <header className="shop-header-new">
                <div className="header-container">
                    <div className="header-logo" onClick={handleGoHomeClick} style={{ cursor: 'pointer' }}>
                        <span>PerfumeShop</span>
                    </div>

                    <form
                        className="header-search-container"
                        ref={searchRef}
                        onSubmit={handleSubmit}
                    >
                        <div className="header-search">
                            <input
                                type="text"
                                placeholder="Tìm kiếm nước hoa..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="search-input-header"
                                onFocus={() => setIsSearchFocus(true)}
                            />
                        </div>

                        {isSearchFocus && suggestions.length > 0 && (
                            <div className="search-suggestions">
                                <ul>
                                    {suggestions.map(product => (
                                        <li key={product.id}>
                                            <Link
                                                to={`/products/${product.id}`}
                                                onClick={handleSuggestionClick}
                                                className="suggestion-item"
                                            >
                                                <img
                                                    src={product.imageUrl || 'https://placehold.co/50'}
                                                    alt={product.name}
                                                    className="suggestion-image"
                                                />
                                                <div className="suggestion-details">
                                                    <span className="suggestion-name">{product.name}</span>
                                                    <span className="suggestion-price">
                                                        {product.variants?.[0]?.price
                                                            ? product.variants[0].price.toLocaleString('vi-VN') + ' VNĐ'
                                                            : 'Hết hàng'}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </form>

                    <div className="header-user-actions">
                        <Link to="/cart" className="header-cart-link">
                            <span className="cart-icon">🛒</span>
                            <span className={`cart-count ${totalItems > 0 ? 'has-items' : ''}`}>
                                {totalItems}
                            </span>
                        </Link>
                        {user ? (
                            <div className="header-user-menu" ref={userDropdownRef}>
                                <button
                                    className="user-greeting-button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className="welcome-user">Chào, {user.username}!</span>
                                    <span className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}>▼</span>
                                </button>
                                {isDropdownOpen && (
                                    <div className="user-dropdown">
                                        <ul>
                                            <li><Link to="/profile" onClick={() => setIsDropdownOpen(false)}>Thông tin tài khoản</Link></li>
                                            <li><Link to="/my-orders" onClick={() => setIsDropdownOpen(false)}>Đơn hàng của tôi</Link></li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        onLogout();
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="logout-btn-dropdown"
                                                >
                                                    Đăng xuất
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="header-auth-links">
                                <Link to="/login" className="header-action-link">Đăng nhập</Link>
                                <Link to="/register" className="header-action-link primary">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* --- (THAY ĐỔI) PHẦN THANH DANH MỤC --- */}
            <div
                className="category-filter-container-wrapper"
                // Thêm sự kiện rời chuột khỏi toàn bộ thanh
                onMouseLeave={handleCategoryMouseLeave}
            >
                <div className="category-filter-container">
                    <ul className="category-list-filter-horizontal">
                        <li
                            className={selectedCategory === null ? 'active' : ''}
                            onClick={() => onSelectCategory(null)}
                            // Thêm sự kiện trỏ chuột
                            onMouseEnter={() => handleCategoryMouseEnter(null)}
                        >
                            Tất cả sản phẩm
                        </li>

                        {safeCategories.map((category) => {
                            const hasChildren = category.children && category.children.length > 0;
                            const active = isCategoryActive(category, selectedCategory);
                            const showMegaMenu = hasChildren || safeBrands.length > 0;

                            return (
                                <li
                                    key={category.id}
                                    className={`${active ? 'active' : ''} ${showMegaMenu ? 'has-children' : ''}`}
                                    onClick={() => onSelectCategory(category.id)}
                                    // Thêm sự kiện trỏ chuột
                                    onMouseEnter={() => handleCategoryMouseEnter(category)}
                                >
                                    {category.name}
                                </li>
                            );
                        })}
                    </ul>

                    {/* --- 3. (THAY ĐỔI) ĐẶT MEGA MENU Ở ĐÂY --- */}
                    <div
                        className={`category-dropdown-menu mega-menu ${showMegaMenu ? 'is-visible' : ''}`}
                        onMouseEnter={handleMenuMouseEnter} // Giữ menu mở khi trỏ vào
                        onMouseLeave={handleMenuMouseLeave} // Đóng menu khi rời đi
                    >
                        {/* Cột 1: Phân loại (danh mục con) */}
                        {hasHoveredChildren && (
                            <div className="dropdown-column">
                                <h6 className="dropdown-heading">Phân loại</h6>
                                <ul className="dropdown-links-list">
                                    {currentHovered.children.map((child) => (
                                        <li
                                            key={child.id}
                                            className={selectedCategory == child.id ? 'active-child' : ''}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectCategory(child.id);
                                            }}
                                        >
                                            {child.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Cột 2: Thương hiệu */}
                        {safeBrands.length > 0 && (
                            <div className="dropdown-column">
                                <h6 className="dropdown-heading">Thương hiệu</h6>
                                <ul className="dropdown-links-list brand-list">
                                    {safeBrands.slice(0, 12).map((brand) => (
                                        <li
                                            key={brand.id}
                                            // --- 2. THÊM LOGIC CLICK VÀO ĐÂY ---
                                            className={selectedBrand == brand.id ? 'active-child' : ''}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectBrand(brand.id);
                                            }}
                                        >
                                {brand.name}
                                        </li>
                                    ))}
                                    {safeBrands.length > 12 && (
                                        <li className="see-all-link">
                                            Xem tất cả
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
};

export default Header;