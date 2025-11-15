// productApi.js
import api from "./axiosConfig";

export const getAllProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);
export const addProduct = (product) => api.post("/products", product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const searchProducts = (keyword) => api.get(`/products/search?keyword=${keyword}`);

// import axios from "axios";

// const API_URL = "http://localhost:8080/api/products";

// export const getAllProducts = () => axios.get(API_URL);
// export const getProductById = (id) => axios.get(`${API_URL}/${id}`);
// export const addProduct = (product) => axios.post(API_URL, product);
// export const updateProduct = (id, product) => axios.put(`${API_URL}/${id}`, product);
// export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);
// export const searchProducts = (keyword) => axios.get(`${API_URL}/search?keyword=${keyword}`);
