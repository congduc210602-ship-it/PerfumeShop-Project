import React, { useState, useEffect } from "react";
// Import các hàm API banner mới
import {
  getAllBannersAdmin,
  addBanner,
  updateBannerInfo,
  deleteBanner,
} from "../api/bannerApi";
// Sử dụng lại CSS List
import "./List.css";

function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null); // Banner đang edit
  const [selectedFile, setSelectedFile] = useState(null); // File ảnh mới
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái loading khi submit

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getAllBannersAdmin();
      // API trả về { message: "...", data: [...] }
      const bannerData = res.data.data || res.data; // Xử lý cả 2 trường hợp
      if (Array.isArray(bannerData)) {
        setBanners(bannerData);
      } else {
        console.error("API get all banners không trả về mảng:", res.data);
        setBanners([]);
      }
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách banner.");
      console.error(err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa banner này?")) {
      try {
        await deleteBanner(id);
        fetchBanners(); // Tải lại danh sách
        alert("Xóa banner thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa banner:", err);
        alert(`Xóa thất bại: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const openModal = (banner = null) => {
    setCurrentBanner(banner);
    setSelectedFile(null); // Reset file khi mở modal
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentBanner(null);
    setSelectedFile(null);
    setModalOpen(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // Hàm Submit Form Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear lỗi cũ

    const form = e.target;
    const formData = new FormData(); // Dùng FormData để gửi file

    // Lấy các giá trị từ form
    const title = form.title.value;
    const linkUrl = form.linkUrl.value;
    const active = form.active.checked; // Lấy từ checkbox
    const displayOrder = parseInt(form.displayOrder.value) || 0;

    try {
      if (currentBanner) {
        // --- CHẾ ĐỘ UPDATE ---
        // Backend chỉ cho update thông tin, không cho update ảnh ở đây
        // Nếu muốn update ảnh, cần có API riêng hoặc sửa API PUT
        const bannerData = { title, linkUrl, active, displayOrder };
        await updateBannerInfo(currentBanner.id, bannerData);
        // Nếu người dùng chọn file mới -> Cần gọi API upload riêng (hiện chưa có)
        // if (selectedFile) {
        //   await updateBannerImage(currentBanner.id, selectedFile); // Ví dụ
        // }
         alert("Cập nhật thông tin banner thành công!");

      } else {
        // --- CHẾ ĐỘ ADD NEW ---
        if (!selectedFile) {
          throw new Error("Vui lòng chọn ảnh cho banner mới.");
        }
        // Thêm file và các trường khác vào FormData
        formData.append("file", selectedFile);
        formData.append("title", title);
        formData.append("linkUrl", linkUrl);
        formData.append("active", active);
        formData.append("displayOrder", displayOrder);

        await addBanner(formData); // Gọi API addBanner (đã bao gồm upload)
         alert("Thêm banner mới thành công!");
      }

      setIsSubmitting(false);
      closeModal();
      fetchBanners(); // Tải lại danh sách
    } catch (err) {
      console.error("Lỗi khi lưu banner:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Đã xảy ra lỗi.";
      setError(errorMsg); // Hiển thị lỗi trên modal
      setIsSubmitting(false);
    }
  };

  // ----- KIỂM TRA AN TOÀN TRƯỚC KHI MAP -----
  const safeBanners = Array.isArray(banners) ? banners : [];

  return (
    <div className="card">
      {/* Inject CSS modal (nếu chưa có trong List.css) */}
      <style>{`
        /* Thêm style cho checkbox */
        .modal-content form .checkbox-container {
            grid-column: span 2;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem; /* Thêm margin dưới */
        }
        .modal-content form .checkbox-container input[type="checkbox"] {
            width: auto; /* Reset width */
            margin-bottom: 0;
        }
         .modal-content form .checkbox-container label {
             margin-bottom: 0;
             font-weight: normal; /* Bớt đậm */
         }
         /* Style cho thông báo lỗi trong modal */
         .modal-error {
             color: #dc3545;
             font-size: 0.9rem;
             margin-top: 1rem;
             grid-column: span 2;
             text-align: center;
         }
      `}</style>
      <h2>Quản lý Banner</h2>
      <div className="top-bar">
        {/* Có thể thêm bộ lọc sau này nếu cần */}
        <button className="add-btn" onClick={() => openModal()}>
          + Thêm Banner
        </button>
      </div>

      {loading && <p>Đang tải...</p>}
      {!loading && error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi fetch */}

      {!loading && !error && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tiêu đề</th>
              <th>Link</th>
              <th>Thứ tự</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {safeBanners.length > 0 ? (
              safeBanners.map((banner) => (
                <tr key={banner.id}>
                  <td>{banner.id}</td>
                  <td>
                    {banner.imageUrl ? (
                      <img
                        src={banner.imageUrl}
                        alt={banner.title || "Banner"}
                        style={{
                          width: "100px",
                          height: "50px",
                          objectFit: "contain", // contain để thấy rõ banner
                          borderRadius: "4px",
                          backgroundColor: "#f0f0f0", // Nền nhẹ
                        }}
                         onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x50/f0f0f0/a0a0a0?text=Error' }}
                      />
                    ) : (
                      "Chưa có ảnh"
                    )}
                  </td>
                  <td>{banner.title || "-"}</td>
                  <td title={banner.linkUrl || "-"}>
                    {banner.linkUrl ? banner.linkUrl.slice(0, 30) + (banner.linkUrl.length > 30 ? "..." : "") : "-"}
                  </td>
                  <td>{banner.displayOrder}</td>
                  <td>{banner.active ? "Hiển thị" : "Ẩn"}</td>
                  <td>
                    <button className="edit" onClick={() => openModal(banner)}>
                      Sửa
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(banner.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Chưa có banner nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ----- MODAL ADD/EDIT BANNER ----- */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentBanner ? "Sửa Banner" : "Thêm Banner"}</h3>
            <form onSubmit={handleSubmit}>
              {/* Input Title */}
              <input
                name="title"
                defaultValue={currentBanner?.title || ""}
                placeholder="Tiêu đề (Alt Text)"
                disabled={isSubmitting}
                style={{ gridColumn: "span 2" }}
              />
              {/* Input Link URL */}
              <input
                name="linkUrl"
                defaultValue={currentBanner?.linkUrl || ""}
                placeholder="Link khi click (VD: /products/123)"
                disabled={isSubmitting}
                style={{ gridColumn: "span 2" }}
              />

              {/* Input Ảnh (Chỉ hiển thị khi Thêm mới) */}
              {!currentBanner && (
                <div style={{ gridColumn: "span 2" }}>
                  <label htmlFor="fileInputBanner">Ảnh Banner *</label>
                  <input
                    id="fileInputBanner"
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required // Bắt buộc khi thêm mới
                    disabled={isSubmitting}
                  />
                   {selectedFile && (
                      <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#555' }}>
                        File đã chọn: {selectedFile.name}
                      </p>
                    )}
                </div>
              )}
               {/* Hiển thị ảnh cũ khi Edit */}
               {currentBanner?.imageUrl && (
                 <div style={{ gridColumn: "span 2" }}>
                     <label>Ảnh hiện tại:</label>
                     <img src={currentBanner.imageUrl} alt="Current Banner" style={{width: '150px', height: 'auto', marginTop: '5px', borderRadius: '4px'}}/>
                     <p style={{fontSize: '0.8rem', color: '#888'}}>Để thay đổi ảnh, vui lòng xóa banner này và tạo banner mới.</p>
                 </div>
               )}

              {/* Input Display Order */}
              <input
                type="number"
                name="displayOrder"
                defaultValue={currentBanner?.displayOrder ?? 0}
                placeholder="Thứ tự hiển thị (Số nhỏ trước)"
                min="0"
                disabled={isSubmitting}
              />
              {/* Checkbox Active */}
              <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="activeCheckbox"
                    name="active"
                    defaultChecked={currentBanner ? currentBanner.active : true} // Mặc định true khi thêm
                    disabled={isSubmitting}
                  />
                  <label htmlFor="activeCheckbox">Hiển thị banner này</label>
              </div>


              {/* Nút Submit và Cancel */}
              <div className="modal-actions">
                <button type="submit" className="add-btn" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Đang lưu..."
                    : currentBanner
                    ? "Cập nhật"
                    : "Thêm mới"}
                </button>
                <button
                  type="button"
                  className="delete" // Dùng class delete cho nút Cancel
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
              </div>

               {/* Hiển thị lỗi submit */}
              {error && <p className="modal-error">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BannerList;