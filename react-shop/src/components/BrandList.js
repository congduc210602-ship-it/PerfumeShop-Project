// src/components/BrandList.js
import React, { useEffect, useState } from "react";
// 1. THAY ĐỔI API: Import từ brandApi (bạn sẽ cần tạo file này)
import { getAllBrands, deleteBrand, addBrand, updateBrand } from "../api/brandApi";
import "./List.css"; // Dùng chung CSS

function BrandList() {
  // 2. ĐỔI TÊN STATE
  const [brands, setBrands] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null); // để edit

  // 3. ĐỔI TÊN HÀM FETCH
  const fetchBrands = async () => {
    try {
      const res = await getAllBrands();
      // Giả sử API trả về cấu trúc tương tự: { data: { data: [...] } }
      setBrands(res.data.data || res.data); // setCategories -> setBrands
    } catch (error) {
      console.error("Lỗi khi lấy thương hiệu:", error);
    }
  };

  useEffect(() => {
    fetchBrands(); // fetchCategories -> fetchBrands
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      await deleteBrand(id); // deleteCategory -> deleteBrand
      fetchBrands();
    }
  };

  const openModal = (brand = null) => { // category -> brand
    setCurrentBrand(brand); // setCurrentCategory -> setCurrentBrand
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentBrand(null); // setCurrentCategory -> setCurrentBrand
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { name: form.name.value };

    if (currentBrand) { // currentCategory -> currentBrand
      await updateBrand(currentBrand.id, data); // updateCategory -> updateBrand
    } else {
      await addBrand(data); // addCategory -> addBrand
    }

    closeModal();
    fetchBrands(); // fetchCategories -> fetchBrands
  };

  // 4. ĐỔI TÊN BIẾN LỌC
  const filteredBrands = brands.filter((b) => // c -> b
    b.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="card">
      {/* 5. CẬP NHẬT TIÊU ĐỀ VÀ VĂN BẢN */}
      <h2>Danh sách thương hiệu</h2>
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search brands..." // Cập nhật placeholder
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="add-btn" onClick={() => openModal()}>
          + Add Brand {/* Cập nhật nút */}
        </button>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBrands.length > 0 ? ( // filteredCategories -> filteredBrands
            filteredBrands.map((b) => ( // c -> b
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>
                  <button className="edit" onClick={() => openModal(b)}>Edit</button> {/* c -> b */}
                  <button className="delete" onClick={() => handleDelete(b.id)}>Delete</button> {/* c.id -> b.id */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No brands found {/* Cập nhật thông báo */}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* Cập nhật tiêu đề Modal */}
            <h3>{currentBrand ? "Edit Brand" : "Add Brand"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                defaultValue={currentBrand?.name || ""} // currentCategory -> currentBrand
                placeholder="Brand Name" // Cập nhật placeholder
                required
              />
              <div className="modal-actions">
                <button type="submit" className="add-btn">
                  {currentBrand ? "Update" : "Add"} {/* currentCategory -> currentBrand */}
                </button>
                <button type="button" className="delete" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandList;