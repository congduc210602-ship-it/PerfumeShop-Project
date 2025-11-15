package SpringJPA.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry; // <-- THÊM IMPORT NÀY

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        
        // Cấu hình CORS cho API
        registry.addMapping("/api/**") // Áp dụng cho tất cả API
            .allowedOrigins("http://localhost:3000") // React chạy ở port 3000
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // <-- THÊM "OPTIONS"
            .allowedHeaders("*")
            .allowCredentials(true);
            
        // ----- THÊM CẤU HÌNH MỚI NÀY -----
        // Cấu hình CORS cho file tĩnh (ảnh đã upload)
        registry.addMapping("/uploads/**") // Áp dụng cho thư mục /uploads
            .allowedOrigins("http://localhost:3000") // Cho phép React xem
            .allowedMethods("GET"); // Chỉ cần GET (xem ảnh)
        // ------------------------------------
    }

    // ----- THÊM HÀM NÀY ĐỂ HIỂN THỊ ẢNH -----
    // Hàm này map đường dẫn /uploads/** với thư mục uploads/ trên ổ đĩa
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/"); // "file:" trỏ đến thư mục uploads/
    }
    // ----------------------------------------
}

