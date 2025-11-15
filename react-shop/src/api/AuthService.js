import api from "./axiosConfig";

const TOKEN_KEY = "jwt_token";
const USER_KEY = "user_info";

const AuthService = {

  /**
   * Đăng nhập
   */
  login: async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    const { token, user } = res.data;

    if (token && user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return user;
  },

  /**
   * Đăng ký: SỬA LẠI THAM SỐ
   */
  // SỬA: Chấp nhận 1 tham số duy nhất là "registerData" (giống hệt Register.js)
  register: async (registerData) => {

    // SỬA: Không cần tạo "const data" nữa, chỉ cần gửi thẳng registerData
    const res = await api.post("/auth/register", registerData);

    const { token, message } = res.data;

    // (Logic còn lại giữ nguyên)
    if (token) {
      // ...
    }

    return res.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => {
    try {
      const userInfo = localStorage.getItem(USER_KEY);
      if (userInfo) {
        return JSON.parse(userInfo);
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
     * Cập nhật thông tin user trong localStorage sau khi update profile.
     * @param {object} updatedUser - Object user DTO mới từ API trả về.
     */
  updateLocalUser: (updatedUser) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem(USER_KEY));
      // Giữ lại các trường cũ (nếu có) và ghi đè các trường mới
      const newUserInfo = { ...currentUser, ...updatedUser };
      localStorage.setItem(USER_KEY, JSON.stringify(newUserInfo));
    } catch (e) {
      console.error("Failed to update local user info:", e);
    }
  }
};

export default AuthService;