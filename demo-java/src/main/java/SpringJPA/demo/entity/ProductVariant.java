package SpringJPA.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "product_variant") // Tên bảng mới trong DB
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID của riêng biến thể

    @Column(name = "dung_tich", nullable = false)
    private String dungTich; // Ví dụ: "50ml", "100ml"

    @Column(nullable = false)
    private Double price; // Giá cho dung tích này

    @Column(nullable = false)
    private Integer quantity; // Số lượng cho dung tích này
    
    // (Tùy chọn) Bạn có thể có ảnh riêng cho từng biến thể
    @Column(name = "image_url")
    private String imageUrl;

    // Quan hệ ngược lại: Nhiều biến thể thuộc VỀ MỘT sản phẩm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}