import React, { useState, useEffect } from "react";

function CategoryForm({ category, onSubmit, onCancel }) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(category?.name || "");
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim() });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{category ? "Edit Category" : "Add Category"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50} // giới hạn tên
          />
          <div className="modal-actions">
            <button type="submit" className="add-btn">
              {category ? "Update" : "Add"}
            </button>
            <button type="button" className="delete" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;
