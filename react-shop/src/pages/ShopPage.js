// src/pages/ShopPage.js
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Header from '../components/shop/Header';
import Footer from '../components/shop/Footer';
import ChatWidget from '../components/shop/ChatWidget';
import BannerSlider from '../components/shop/BannerSlider';

import * as bannerApi from '../api/bannerApi';
import * as productApi from '../api/productApi';
import * as categoryApi from '../api/categoryApi';
import * as brandApi from '../api/brandApi';
import './ShopPage.css';

/**
 * Biến đổi một danh sách phẳng (flat list) các danh mục 
 * (với 'id' và 'parentId') thành một cấu trúc cây (tree).
 */
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

// --- Component chính ---
const ShopPage = ({ user, onLogout, cart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Giữ nguyên
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Giữ nguyên
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // (Hàm fetchData giữ nguyên y hệt, không cần thay đổi)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [bannerRes, productRes, categoryRes, brandRes] = await Promise.all([
          bannerApi.getActiveBanners(),
          productApi.getAllProducts(),
          categoryApi.getAllCategories(),
          brandApi.getAllBrands()
        ]);

        // Xử lý Banner
        const bannerData = bannerRes.data.data || bannerRes.data;
        if (Array.isArray(bannerData)) setBanners(bannerData);
        else console.warn("Banner API không trả về mảng:", bannerRes.data);

        // Xử lý Product
        const productData = productRes.data.content || productRes.data.data || productRes.data;
        if (Array.isArray(productData)) setProducts(productData);
        else { console.error("Lỗi: Product API không trả về mảng", productRes.data); setProducts([]); }

        // Xử lý Category
        const categoryData = categoryRes.data.content || categoryRes.data.data || categoryRes.data;
        if (Array.isArray(categoryData)) {
          const categoryTree = buildCategoryTree(categoryData);
          setCategories(categoryTree);
        } else {
          console.error("Lỗi: Category API không trả về mảng", categoryRes.data);
          setCategories([]);
        }

        const brandData = brandRes.data.content || brandRes.data.data || brandRes.data;
        if (Array.isArray(brandData)) {
          setBrands(brandData);
        } else {
          console.error("Lỗi: Brand API không trả về mảng", brandRes.data);
          setBrands([]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu trang shop.');
        console.error(err);
        setBanners([]); setProducts([]); setCategories([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // (Các hàm handleFilterCategory, handleGoHome, displayedProducts giữ nguyên)
  const handleFilterCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedBrand(null); // Reset brand khi chọn category
  };
const handleFilterBrand = (brandId) => {
    setSelectedBrand(brandId);
    setSelectedCategory(null); // Reset category khi chọn brand
  };

  const handleGoHome = () => {
    setSelectedCategory(null);
    setSelectedBrand(null); // Thêm reset brand
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
  };

  const displayedProducts = products
    .filter(product => {
      // Lọc Category (giữ nguyên)
      // TODO: Cần cập nhật logic này để lọc cả danh mục con
      return selectedCategory === null || product.categoryId == selectedCategory;
    })
    .filter(product => {
      return selectedBrand === null || product.brandId == selectedBrand;
    })
    .filter(product => {
      const min = minPrice === "" ? -Infinity : parseFloat(minPrice);
      const max = maxPrice === "" ? Infinity : parseFloat(maxPrice);
      if (!product.variants || product.variants.length === 0) {
        return minPrice === "" && maxPrice === "";
      }
      return product.variants.some(v =>
        v.price >= min && v.price <= max
      );
    });

  // (Helper isCategoryActive đã BỊ XÓA khỏi đây)

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="shop-page-layout">
      <Header
        user={user} onLogout={onLogout} searchTerm={searchTerm}
        setSearchTerm={setSearchTerm} onGoHome={handleGoHome}
        cart={cart}
        // --- THÊM 3 PROPS MỚI CHO HEADER ---
        categories={safeCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleFilterCategory}
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={handleFilterBrand}
      />

      {!loading && !error && <BannerSlider banners={banners} />}

      <div className="shop-container">

        {/* --- SIDEBAR (GIỮ NGUYÊN) --- */}
        <aside className="shop-sidebar">
          <div className="price-filter-section">
            <h3>Lọc theo giá</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Giá từ (VNĐ)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Giá đến (VNĐ)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
            {(minPrice !== "" || maxPrice !== "") && (
              <button
                onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                className="clear-price-filter-btn"
              >
                Xóa bộ lọc giá
              </button>
            )}
          </div>
        </aside>

        {/* --- MAIN CONTENT (SẢN PHẨM) --- */}
        <main className="product-grid-container">

          {/* --- XÓA THANH DANH MỤC KHỎI ĐÂY --- */}
          {/* <div className="category-filter-container"> ... </div> */}

          {/* --- LƯỚI SẢN PHẨM (GIỮ NGUYÊN) --- */}
          {loading && <p>Đang tải...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            products.length > 0 ? (
              <div className="product-grid">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                )}
              </div>
            ) : (
              <p>Cửa hàng hiện chưa có sản phẩm nào.</p>
            )
          )}
        </main>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default ShopPage;