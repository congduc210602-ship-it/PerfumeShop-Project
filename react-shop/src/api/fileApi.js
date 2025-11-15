import api from "./axiosConfig";

export const uploadFile = (file) => {
  // 1. Tạo đối tượng FormData
  const formData = new FormData();
  formData.append("file", file); // Tên "file" phải khớp với @RequestParam("file")

  // 2. Gửi request với header 'multipart/form-data'
  return api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
