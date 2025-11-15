import React, { useState, useEffect } from "react";

function ProductForm({ product, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
    description: "", // thêm description
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        quantity: product.quantity || "",
        categoryId: product.categoryId || "",
        description: product.description || "", // load description
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // validation cơ bản
    if (!formData.name || formData.price < 0 || formData.quantity < 0) return;
    onSubmit(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{product ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            maxLength={200} // giới hạn chiều dài
          />
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="modal-actions">
            <button type="submit" className="add-btn">
              {product ? "Update" : "Add"}
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

export default ProductForm;
