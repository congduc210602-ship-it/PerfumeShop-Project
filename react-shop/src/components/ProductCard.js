import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {

  // --- LOGIC MỚI ĐỂ LẤY GIÁ ---
  // 1. Kiểm tra xem product có variants và không bị rỗng
  const hasVariants = product.variants && product.variants.length > 0;
  
  // 2. Lấy giá của biến thể đầu tiên. Nếu không có, gán là 0.
  const displayPrice = hasVariants ? product.variants[0].price : 0;

  // 3. Format giá
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(displayPrice); // <-- Dùng displayPrice
  // --- HẾT LOGIC MỚI ---

  return (
    <Link to={`/products/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-wrapper">
            <img
            src={product.imageUrl || 'https://placehold.co/300x300/f0f0f0/a0a0a0?text=Perfume'}
            alt={product.name}
            className="product-image"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x300/f0f0f0/a0a0a0?text=Image+Error' }}
            />
        </div>
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          
          {/* --- SỬA Ở ĐÂY --- */}
          {/* Hiển thị giá đã format. Nếu không có variant, có thể hiển thị "Hết hàng" */}
          <p className="product-price">
            {hasVariants ? formattedPrice : "Hết hàng"}
          </p>
          {/* --- HẾT SỬA --- */}

          <button className="add-to-cart-btn">Xem chi tiết</button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;