import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";
import { uploadFile } from "../api/fileApi";
import { getAllBrands } from "../api/brandApi";
import "./List.css";

// --- STATE BAN ĐẦU CHO FORM BIẾN THỂ ---
// Dùng cho cả Thêm mới (currentProduct=null) và Cập nhật (currentProduct=product)
const getInitialFormState = (product) => {
  if (product) {
    // Chế độ Edit
    return {
      name: product.name || "",
      description: product.description || "",
      categoryId: product.categoryId || (product.category?.id || ""),
      brandId: product.brandId || (product.brand?.id || ""),
      imageUrl: product.imageUrl || "",
      // Load variants nếu có, nếu không thì tạo 1 dòng rỗng
      variants: (product.variants && product.variants.length > 0)
        ? product.variants.map(v => ({
          id: v.id || null,
          dungTich: v.dungTich || "",
          price: v.price || 0,
          quantity: v.quantity || 0,
          imageUrl: v.imageUrl || "" // <-- 1. SỬA Ở ĐÂY
        })) // Tạo bản copy
        : [{ dungTich: "", price: 0, quantity: 0, imageUrl: "" }]
    };
  } else {
    // Chế độ Add
    return {
      name: "",
      description: "",
      categoryId: "",
      brandId: "",
      imageUrl: "",
      variants: [{ dungTich: "", price: 0, quantity: 0, imageUrl: "" }] // Bắt đầu với 1 variant rỗng
    };
  }
};


function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // Chỉ dùng để biết là Add hay Edit

  // --- STATE MỚI CHO FORM DATA (BAO GỒM VARIANTS) ---
  const [formData, setFormData] = useState(getInitialFormState(null));
  // ----------------------------------------------------

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ... (fetchProducts, fetchCategories, fetchBrands, handleDelete giữ nguyên) ...
  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      const productData = res.data.content || res.data.data || res.data;
      if (Array.isArray(productData)) setProducts(productData);
      else {
        console.error("Lỗi: Product API (Admin) không trả về mảng", res.data);
        setProducts([]);
      }
    } catch (error) { console.error(error); setProducts([]); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      const categoryData = res.data.content || res.data.data || res.data;
      if (Array.isArray(categoryData)) setCategories(categoryData);
      else {
        console.error("Lỗi: Category API (Admin) không trả về mảng", res.data);
        setCategories([]);
      }
    } catch (error) { console.error(error); setCategories([]); }
  };

  const fetchBrands = async () => {
    try {
      const res = await getAllBrands();
      const brandData = res.data.content || res.data.data || res.data;
      if (Array.isArray(brandData)) setBrands(brandData);
      else {
        console.error("Lỗi: Brand API (Admin) không trả về mảng", res.data);
        setBrands([]);
      }
    } catch (error) { console.error(error); setBrands([]); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  // --- SỬA LOGIC MỞ MODAL ---
  const openModal = (product = null) => {
    setCurrentProduct(product); // Dùng để biết là Add hay Edit
    setFormData(getInitialFormState(product)); // Set state cho form
    setSelectedFile(null);
    setUploading(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentProduct(null);
    setSelectedFile(null);
    setFormData(getInitialFormState(null)); // Reset form
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // --- CÁC HÀM QUẢN LÝ FORM MỚI ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    const item = updatedVariants[index];

    if (field === 'price' || field === 'quantity') {
      item[field] = Math.max(0, Number(value));
    } else {
      // Áp dụng cho 'dungTich' và 'imageUrl'
      item[field] = value;
    }

    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { dungTich: "", price: 0, quantity: 0, imageUrl: "" }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) {
      alert("Sản phẩm phải có ít nhất 1 biến thể.");
      return;
    }
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };
  // ---------------------------------


  // ----- HÀM SUBMIT VIẾT LẠI HOÀN TOÀN -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (formData.variants.length === 0) {
      alert("Sản phẩm phải có ít nhất 1 biến thể.");
      setUploading(false);
      return;
    }

    let imageUrl = formData.imageUrl;
    try {
      if (selectedFile) {
        const uploadRes = await uploadFile(selectedFile);
        imageUrl = uploadRes.data.url;
      }

      const categoryName = categories.find(c => c.id == formData.categoryId)?.name || null;
      const brandName = brands.find(b => b.id == formData.brandId)?.name || null;

      const data = {
        name: formData.name,
        description: formData.description,
        categoryId: parseInt(formData.categoryId) || null,
        brandId: parseInt(formData.brandId) || null,
        imageUrl: imageUrl,

        // --- 6. SỬA Ở ĐÂY ---
        variants: formData.variants.map(v => ({
          id: v.id || null,
          dungTich: v.dungTich,
          price: parseFloat(v.price),
          quantity: parseInt(v.quantity),
          imageUrl: v.imageUrl || null // Thêm imageUrl vào
        }))
      };

      // (Thêm 2 trường này chỉ để hiển thị, backend không cần)
      data.categoryName = categoryName;
      data.brandName = brandName;

      // 5. Thêm hoặc Cập nhật sản phẩm
      if (currentProduct) {
        // Chế độ Edit
        await updateProduct(currentProduct.id, data);
      } else {
        // Chế độ Add
        await addProduct(data);
      }

      setUploading(false);
      closeModal();
      fetchProducts(); // Tải lại danh sách

    } catch (error) {
      console.error("Lỗi khi upload hoặc lưu sản phẩm:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
      setUploading(false);
    }
  };
  // -------------------------------------

  // ----- SỬA LOGIC LỌC GIÁ -----
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeBrands = Array.isArray(brands) ? brands : [];

  const filteredProducts = safeProducts.filter((p) => {
    const matchKeyword = p.name.toLowerCase().includes(keyword.toLowerCase());
    const matchCategory = selectedCategory ? p.categoryId == selectedCategory : true;
    const matchBrand = selectedBrand ? p.brandId == selectedBrand : true;

    // Logic lọc giá mới
    const matchPrice = (p.variants && p.variants.length > 0)
      ? p.variants.some(v =>
        (minPrice === "" || v.price >= parseFloat(minPrice)) &&
        (maxPrice === "" || v.price <= parseFloat(maxPrice))
      )
      : (minPrice === "" && maxPrice === ""); // Không có variant, chỉ match nếu không lọc

    return matchKeyword && matchCategory && matchBrand && matchPrice;
  });
  // -----------------------------

  return (
    <div className="card">
      <h2>Danh sách sản phẩm</h2>
      <div className="top-bar">
        {/* ... (Phần filter không đổi) ... */}
        <input type="text" placeholder="Search products..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {safeCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">All Brands</option>
          {safeBrands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
        </select>
        <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button className="add-btn" onClick={() => openModal()}>+ Add Product</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : ("No Img")}
                </td>
                <td>{p.name}</td>

                {/* --- SỬA HIỂN THỊ GIÁ/SỐ LƯỢNG (LẤY TỪ VARIANT[0]) --- */}
                <td>
                  {(p.variants && p.variants.length > 0)
                    ? Number(p.variants[0].price).toLocaleString('vi-VN') + ' VNĐ'
                    : 'N/A'}
                </td>
                <td>
                  {(p.variants && p.variants.length > 0)
                    ? p.variants[0].quantity
                    : 'N/A'}
                </td>
                {/* --- HẾT SỬA --- */}

                <td>{p.categoryName || (p.category ? p.category.name : "-")}</td>
                <td>{p.brandName || (p.brand ? p.brand.name : "-")}</td>
                <td title={p.description || "-"}>{p.description ? p.description.slice(0, 30) + (p.description.length > 30 ? "..." : "") : "-"}</td>
                <td>
                  <button className="edit" onClick={() => openModal(p)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ----- MODAL FORM ĐÃ VIẾT LẠI HOÀN TOÀN ----- */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content product-form-modal"> {/* Sửa class cho CSS (nếu cần) */}
            <h3>{currentProduct ? "Edit Product" : "Add Product"}</h3>

            <form onSubmit={handleSubmit} className="product-form-layout"> {/* Sửa class cho CSS */}

              {/* --- CỘT TRÁI: THÔNG TIN CHUNG --- */}
              <div className="form-column">
                <h4>Thông tin chung</h4>
                <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Name" required disabled={uploading} />

                <div>
                  <label>Ảnh chính</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={uploading}
                  />
                  {formData.imageUrl && !selectedFile && (
                    <img src={formData.imageUrl} alt="Current" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} />
                  )}
                </div>

                <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Description" disabled={uploading} />

                <select name="categoryId" value={formData.categoryId} onChange={handleFormChange} disabled={uploading} required>
                  <option value="">Chọn danh mục</option>
                  {safeCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select name="brandId" value={formData.brandId} onChange={handleFormChange} disabled={uploading} required>
                  <option value="">Chọn thương hiệu</option>
                  {safeBrands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* --- CỘT PHẢI: CÁC BIẾN THỂ --- */}
              <div className="form-column">
                <h4>Các biến thể (Dung tích)</h4>

                <div className="variants-container">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="variant-item">
                      <p>Biến thể {index + 1}</p>
                      <div className="variant-inputs">
                        <input
                          type="text"
                          placeholder="Dung tích (vd: 50ml)"
                          value={variant.dungTich}
                          onChange={(e) => handleVariantChange(index, 'dungTich', e.target.value)}
                          required
                          disabled={uploading}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          min="0"
                          required
                          disabled={uploading}
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={variant.quantity}
                          onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                          min="0"
                          required
                          disabled={uploading}
                        />

                        {/* --- 7. THÊM INPUT ẢNH Ở ĐÂY --- */}
                        <input
                          type="text"
                          placeholder="Link ảnh biến thể (nếu có)"
                          value={variant.imageUrl}
                          onChange={(e) => handleVariantChange(index, 'imageUrl', e.target.value)}
                          disabled={uploading}
                        />
                        {/* --------------------------- */}
                      </div>
                      <button
                        type="button"
                        className="delete"
                        onClick={() => removeVariant(index)}
                        disabled={uploading || formData.variants.length <= 1}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={addVariant}
                    disabled={uploading}
                    style={{ width: 'auto', marginTop: '10px' }}
                  >
                    + Thêm biến thể
                  </button>
                </div>

                {/* --- NÚT BẤM DƯỚI CÙNG --- */}
                <div className="modal-actions" style={{ gridColumn: "span 2" }}>
                  <button type="submit" className="add-btn" disabled={uploading}>
                    {uploading ? "Đang tải..." : (currentProduct ? "Update" : "Add")}
                  </button>
                  <button type="button" className="delete" onClick={closeModal} disabled={uploading}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;