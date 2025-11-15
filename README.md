# 🌟 Dự án Trang web Thương mại điện tử - PerfumeShop

Đây là dự án cuối kỳ môn học, xây dựng một trang web full-stack bán nước hoa (tương tự NamPerfume) bằng Spring Boot và React.

## 🛠️ Công nghệ sử dụng

* **Backend:** Spring Boot, Spring Data JPA, Spring Security (JWT)
* **Frontend:** React (với React Router, Axios)
* **Database:** MySQL

## ✨ Tính năng nổi bật

* **Xác thực:** Đăng ký/Đăng nhập an toàn bằng JWT (token được lưu ở client).
* **Phân quyền:** Phân chia rõ ràng 3 vai trò:
    * **Public:** Xem sản phẩm, danh mục, thương hiệu.
    * **USER:** Quản lý giỏ hàng, đặt hàng, xem lịch sử mua hàng cá nhân.
    * **ADMIN:** Toàn quyền quản lý (Sản phẩm, Người dùng, Đơn hàng...).
* **Mega Menu:** Menu điều hướng động 2 cấp, hiển thị Danh mục con và Thương hiệu (tải từ API).
* **Giỏ hàng:** Logic giỏ hàng đầy đủ (thêm, sửa, xóa, tự động chuyển hướng sang Login).
* **Trang Admin:** Giao diện quản lý riêng biệt (User, Cart, Order...).

## 🚀 Hướng dẫn cài đặt và Chạy dự án

Để chạy dự án, bạn cần chạy song song cả Backend và Frontend.

## 👥 Thông tin Tài khoản Mẫu

* **Admin:**
    * Username: `admin`
    * Password: `123456`
* **User:**
    * Username: `user1`
    * Password: `123456`
    * Username: `user2`
    * Password: `123456`
