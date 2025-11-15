// src/components/CategoryList.js
import React, { useEffect, useState } from "react";
import { getAllCategories, deleteCategory, addCategory, updateCategory } from "../api/categoryApi";
import "./List.css";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // để edit

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  const openModal = (category = null) => {
    setCurrentCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCategory(null);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { name: form.name.value };

    if (currentCategory) {
      await updateCategory(currentCategory.id, data);
    } else {
      await addCategory(data);
    }

    closeModal();
    fetchCategories();
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="card">
      <h2>Danh sách danh mục</h2>
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search categories..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="add-btn" onClick={() => openModal()}>
          + Add Category
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
          {filteredCategories.length > 0 ? (
            filteredCategories.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>
                  <button className="edit" onClick={() => openModal(c)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentCategory ? "Edit Category" : "Add Category"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                defaultValue={currentCategory?.name || ""}
                placeholder="Category Name"
                required
              />
              <div className="modal-actions">
                <button type="submit" className="add-btn">
                  {currentCategory ? "Update" : "Add"}
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

export default CategoryList;
