// src/api/axiosConfig.js
import axios from 'axios';

// 1. ĐỊNH NGHĨA KEY Ở ĐÂY (Phải khớp với AuthService.js)
const TOKEN_KEY = "jwt_token"; 
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// ----- INTERCEPTOR ĐÃ SỬA (Không import AuthService) -----
api.interceptors.request.use(
  (config) => {
    // 2. ĐỌC TRỰC TIẾP TỪ LOCAL STORAGE
    const token = localStorage.getItem(TOKEN_KEY); 

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ------------------------------------------------

// (Interceptor response có thể giữ nguyên)
api.interceptors.response.use(
  (response) => response,
  (error) => {
      // Tùy chọn: Tự động logout nếu token hết hạn
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Bạn có thể xử lý logout ở đây nếu muốn
          // localStorage.removeItem(TOKEN_KEY);
          // localStorage.removeItem("user_info");
          // window.location.href = '/login'; 
      }
      return Promise.reject(error);
  }
);

export default api;




// import axios from 'axios';
// import AuthService from './AuthService'; // Cần import AuthService để lấy token

// const API_BASE_URL = 'http://localhost:8080/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   // GIỮ withCredentials TRUE ĐỂ TRÁNH LỖI SESSION CŨ VÀ CÁC LỖI CORS PHỤ
//   withCredentials: true, 
// });

// // ----- INTERCEPTOR QUAN TRỌNG NHẤT CHO JWT -----
// // Thêm token vào header của mọi request đi ra
// api.interceptors.request.use(
//   (config) => {
//     const token = AuthService.getToken(); // Lấy Token từ Local Storage

//     // Kiểm tra và đính kèm Token vào Header nếu có
//     if (token) {
//       // Chuẩn JWT yêu cầu tiền tố "Bearer "
//       config.headers['Authorization'] = `Bearer ${token}`; 
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// // ------------------------------------------------

// // (Tùy chọn) Interceptor xử lý lỗi 401 khi token hết hạn
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // Nếu server trả về 401 hoặc 403, có nghĩa là token hết hạn/không hợp lệ
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             // Chỉ cần gọi AuthService.logout()
//             // (Nếu bạn đã có logic này trong App.js, bạn có thể bỏ qua)
//         }
//         return Promise.reject(error);
//     }
// );


// export default api;