import React from 'react';
import './Footer.css'; // Sử dụng file CSS này

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // ----- SVG Icons cho Social Media (Ví dụ) -----
  const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  );
  const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  );
  const WebIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
  );
  // Thêm các icon khác tương tự...
  // ---------------------------------------------

  return (
    <footer className="shop-footer-new">
      <div className="footer-container-new">

        {/* ----- Phần Nội dung chính (chia cột) ----- */}
        <div className="footer-main-content">
          {/* ... (Các cột khác giữ nguyên) ... */}
          {/* Cột 1: Thông tin Shop */}
          <div className="footer-column">
            <h4>PerfumeShop</h4>
            <ul>
              <li><a href="#about">Giới thiệu</a></li>
              <li><a href="#contact">Liên hệ</a></li>
              <li><a href="#careers">Tuyển dụng</a></li>
              <li><a href="#support">Hỗ trợ khách hàng</a></li>
            </ul>
          </div>
          {/* Cột 2: Hỗ trợ */}
          <div className="footer-column">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#faq">Câu hỏi thường gặp</a></li>
              <li><a href="#how-to-buy">Cách thức mua hàng</a></li>
              <li><a href="#shipping">Phương thức vận chuyển</a></li>
              <li><a href="#payment">Phương thức thanh toán</a></li>
              <li><a href="#returns">Chính sách đổi trả</a></li>
              <li><a href="#privacy">Chính sách bảo mật</a></li>
            </ul>
          </div>
          {/* Cột 3: Địa chỉ */}
          <div className="footer-column">
            <h4>Địa chỉ cửa hàng</h4>
            <p>420/6 Lê Văn Sỹ, P.14, Q.3, TP.HCM</p>
            <p>1379-1381 Đường 3/2, P.16, Q.11, TP.HCM</p>
          </div>


          {/* Cột 4: Mạng xã hội (ĐÃ SỬA) */}
          <div className="footer-column">
            <h4>Theo dõi chúng tôi</h4>
            <ul className="social-links">
              {/* ----- SỬA LẠI HREF VÀ THÊM target, rel ----- */}
              <li>
                <a
                  href="https://www.instagram.com/namperfumee/" // <-- Thay bằng link Instagram thật
                  target="_blank" // Mở tab mới
                  rel="noopener noreferrer" // Bảo mật
                >
                  <InstagramIcon /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/Namperfumee/?locale=vi_VN" // <-- Thay bằng link Facebook thật
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon /> Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://namperfume.net/?gad_source=1&gad_campaignid=22991835256&gbraid=0AAAABBTeTMihK0u96YyCISnNpswMt1tQR&ref=gcli-CjwKCAjwpOfHBhAxEiwAm1SwEmfceWNn5AfXrhu2RGrje2c5TT4iJV9k-itS8ynUPiCqtwYuyksHuRoC6pgQAvD_BwE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WebIcon /> Website
                </a>
              </li>
              {/* Thêm Youtube, Tiktok... tương tự */}
              {/* <li><a href="YOUTUBE_LINK" target="_blank" rel="noopener noreferrer"><YoutubeIcon /> Youtube</a></li> */}
              {/* ------------------------------------------------ */}
            </ul>
          </div>

          {/* ... (Cột 5 giữ nguyên) ... */}
          <div className="footer-column footer-column-wide">
            <h4>Nơi mùi hương là bạn đồng hành</h4>
            <p>Đăng ký thông báo và nhận tin</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Nhập email của bạn" required />
              <button type="submit">Gửi</button>
            </form>
            <div className="footer-contact-info">
              GỌI ĐẶT MUA: <strong>0900 0123</strong> (9:00 - 21:00)
            </div>
          </div>
        </div>

        {/* ----- Đường kẻ ngang ----- */}
        <hr className="footer-divider" />

        {/* ----- Phần Copyright & Thông tin thêm ----- */}
        <div className="footer-bottom">
          <p>Copyright {currentYear} &copy; PerfumeShop. All Rights Reserved.</p>
          <p>GPKD: 0316990114, Ngày cấp: 09/08/2021. Nơi cấp: Sở KH&ĐT TP.HCM</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;