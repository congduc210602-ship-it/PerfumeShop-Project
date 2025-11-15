// src/api/brandApi.js
import api from "./axiosConfig";

export const getAllBrands = () => api.get("/brands");
export const getBrandById = (id) => api.get(`/brands/${id}`);
export const addBrand = (brand) => api.post("/brands", brand);
export const updateBrand = (id, brand) => api.put(`/brands/${id}`, brand);
export const deleteBrand = (id) => api.delete(`/brands/${id}`);