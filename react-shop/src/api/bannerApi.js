import api from "./axiosConfig";

// Lấy tất cả banner (Admin)
export const getAllBannersAdmin = () => api.get("/banners");

// Lấy banner đang hoạt động (User) - Có thể dùng ở ShopPage sau
export const getActiveBanners = () => api.get("/banners/active");

// Thêm banner mới (Gửi FormData vì có file)
export const addBanner = (formData) => {
  return api.post("/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Quan trọng khi gửi file
    },
  });
};

// Cập nhật thông tin banner (Không gửi file)
export const updateBannerInfo = (id, bannerData) => {
  // Chỉ gửi các trường cần update, không gửi file hay imageUrl
  const { imageUrl, ...dataToUpdate } = bannerData;
  return api.put(`/banners/${id}`, dataToUpdate);
};

// Xóa banner
export const deleteBanner = (id) => api.delete(`/banners/${id}`);

// (Optional) API để cập nhật ảnh riêng (Nếu cần)
// export const updateBannerImage = (id, file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     return api.put(`/banners/${id}/image`, formData, { // Cần tạo endpoint này ở Backend
//         headers: { "Content-Type": "multipart/form-data" },
//     });
// };