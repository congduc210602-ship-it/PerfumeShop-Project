// src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as productApi from '../api/productApi';
import Header from '../components/shop/Header';
import Footer from '../components/shop/Footer';
import * as categoryApi from '../api/categoryApi';
import ProductCard from '../components/ProductCard';
import './ProductDetailPage.css';

// 1. THÊM HÀM buildCategoryTree (Giống như ShopPage)
function buildCategoryTree(categories) {
    const map = new Map();
    const tree = [];
    categories.forEach(category => {
        map.set(category.id, { ...category, children: [] });
    });
    map.forEach(node => {
        const parentId = node.parentId;
        if (parentId === null || parentId === 0 || parentId === undefined) {
            tree.push(node);
        } else {
            const parent = map.get(parentId);
            if (parent) {
                parent.children.push(node);
            }
        }
    });
    return tree;
}

const ProductDetailPage = ({ user, onLogout, cart, addToCart }) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Sẽ chứa cây danh mục
    const [selectedVariant, setSelectedVariant] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductAndRelated = async () => {
            window.scrollTo(0, 0);

            try {
                setLoading(true);
                // ... (reset states)
                setError(null);
                setProduct(null);
                setRelatedProducts([]);
                setCategories([]);
                setSelectedVariant(null);
                setQuantity(1);

                // --- 1. Fetch sản phẩm chính (Giữ nguyên) ---
                const mainProductRes = await productApi.getProductById(productId);
                let fetchedProduct = null;

                if (mainProductRes.data && mainProductRes.data.data) {
                    fetchedProduct = mainProductRes.data.data;
                } else if (mainProductRes.data) {
                    fetchedProduct = mainProductRes.data;
                } else {
                    throw new Error('Không tìm thấy dữ liệu sản phẩm.');
                }
                setProduct(fetchedProduct);
                if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
                    setSelectedVariant(fetchedProduct.variants[0]);
                }

                // --- 2. SỬA: Fetch DANH MỤC VÀ XÂY DỰNG CÂY ---
                try {
                    const categoriesRes = await categoryApi.getAllCategories();
                    const categoriesData = categoriesRes.data?.data || categoriesRes.data || [];
                    if (Array.isArray(categoriesData)) {
                        // Dùng hàm buildCategoryTree
                        const categoryTree = buildCategoryTree(categoriesData);
                        setCategories(categoryTree); // Lưu cây vào state
                    }
                } catch (catErr) {
                    console.warn("Không thể tải danh mục:", catErr);
                }
                // ------------------------------------

                // --- 3. Fetch sản phẩm liên quan (Giữ nguyên) ---
                if (fetchedProduct && fetchedProduct.categoryId) {
                    const allProductsRes = await productApi.getAllProducts();
                    const allProductsData = allProductsRes.data.content || allProductsRes.data.data || allProductsRes.data;

                    if (Array.isArray(allProductsData)) {
                        const related = allProductsData.filter(p =>
                            p.categoryId == fetchedProduct.categoryId &&
                            p.id != fetchedProduct.id
                        ).slice(0, 4);
                        setRelatedProducts(related);
                    } else {
                        console.warn("API getAllProducts không trả về mảng", allProductsRes.data);
                    }
                }
            } catch (err) {
                setError('Không thể tải thông tin sản phẩm.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndRelated();

    }, [productId]);

    // (Các hàm handleAddToCart, handleQuantityChange, displayPrice, v.v. giữ nguyên)
    const handleAddToCart = () => {
        if (!user) {
            alert("Bạn cần đăng nhập để thêm vào giỏ hàng.");
            navigate('/login');
            return;
        }
        if (!selectedVariant) {
            alert("Vui lòng chọn một dung tích.");
            return;
        }
        addToCart(selectedVariant.id, quantity);
    };

    const handleQuantityChange = (change) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    const displayPrice = selectedVariant ? selectedVariant.price : 0;
    const displayStock = selectedVariant ? selectedVariant.quantity : 0;

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(displayPrice);

    // (Phần return (loading, error) giữ nguyên)
    if (loading) return (
        <>
            <Header user={user} onLogout={onLogout} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onGoHome={() => navigate('/')} cart={cart} categories={categories} />
            <div className="detail-loading"><p>Đang tải chi tiết sản phẩm...</p></div>
            <Footer />
        </>
    );
    if (error && !product) return (
        <>
            <Header user={user} onLogout={onLogout} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onGoHome={() => navigate('/')} cart={cart} categories={categories} />
            <div className="detail-error"><p>{error}</p></div>
            <Footer />
        </>
    );
    if (!product) return (
        <>
            <Header user={user} onLogout={onLogout} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onGoHome={() => navigate('/')} cart={cart} categories={categories} />
            <div className="detail-error"><p>Không tìm thấy sản phẩm bạn yêu cầu.</p></div>
            <Footer />
        </>
    );

    return (
        <div className="product-detail-layout">
            <Header
                user={user}
                onLogout={onLogout}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onGoHome={() => navigate('/')}
                cart={cart}
                // --- 3. SỬA: TRUYỀN PROPS DANH MỤC LÊN HEADER ---
                categories={categories} // Truyền cây danh mục
                // Highlight danh mục của sản phẩm hiện tại
                selectedCategory={product?.categoryId}
                // Khi bấm vào danh mục trên header, chuyển trang
                onSelectCategory={(id) => navigate(id ? `/category/${id}` : '/')}
            />

            <main className="product-detail-container">
                <Link to="/" className="back-to-shop-link">&larr; Quay lại cửa hàng</Link>

                <div className="detail-page-wrapper">

                    {/* --- 4. XÓA: SIDEBAR DANH MỤC Ở ĐÂY --- */}
                    {/* {categories.length > 0 && ( ... )} <- Đã xóa */}

                    <div className="detail-content-wrapper">
                        <div className="product-detail-content">
                            <div className="product-detail-image-gallery">
                                <img
                                    src={product.imageUrl || 'https://placehold.co/600x600/EFEFEF/AAAAAA?text=No+Image'}
                                    alt={product.name}
                                    className="main-product-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/f0f0f0/a0a000?text=Image+Error' }}
                                />
                            </div>

                            <div className="product-detail-info">
                                <h1 className="product-detail-name">{product.name}</h1>
                                <p className="product-detail-category">{product.categoryName || 'Chưa phân loại'}</p>
                                <p className="product-detail-brand">Thương hiệu: {product.brandName || 'Chưa có'}</p>

                                <div className="product-detail-variants">
                                    <label>Chọn dung tích:</label>
                                    <div className="variant-options">
                                        {product.variants && product.variants.map(variant => (
                                            < button
                                                key={variant.id || variant.dungTich}
                                                className={`variant-btn ${selectedVariant?.dungTich === variant.dungTich ? 'active' : ''}`}
                                                onClick={() => setSelectedVariant(variant)}
                                            >
                                                {variant.dungTich}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <p className="product-detail-price">{formattedPrice}</p>
                                <p className="product-detail-description">{product.description || 'Chưa có mô tả.'}</p>

                                <div className="product-actions">
                                    <div className="quantity-selector">
                                        <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => handleQuantityChange(1)}>+</button>
                                    </div>
                                    <button
                                        className="add-to-cart-button-detail"
                                        onClick={handleAddToCart}
                                        disabled={!selectedVariant || displayStock <= 0}
                                    >
                                        {displayStock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                                    </button>
                                </div>
                                <p className="product-stock">
                                    Số lượng còn lại: {displayStock > 0 ? displayStock : 'Hết hàng'}
                                </p>
                            </div>
                        </div>

                        {relatedProducts.length > 0 && (
                            < section className="related-products-section">
                                <h2>Sản phẩm liên quan</h2>
                                <div className="related-products-grid">
                                    {relatedProducts.map(relatedProd => (
                                        <ProductCard key={relatedProd.id} product={relatedProd} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div >
            </main >

            <Footer />
        </div >
    );
};

export default ProductDetailPage;