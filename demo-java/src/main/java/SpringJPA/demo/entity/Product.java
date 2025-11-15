package SpringJPA.demo.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany; // <-- IMPORT MỚI
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List; // <-- IMPORT MỚI

@Entity
@Data
@Table(name="product")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    // --- CÁC TRƯỜNG NÀY SẼ BỊ XÓA HOẶC CHUYỂN ĐI ---
    // private Double price; // (Xóa)
    // private Integer quantity; // (Xóa)
    // @Column(name = "dung_tich") // (Xóa)
    // private String dungTich; // (Xóa)
    // --- HẾT PHẦN XÓA ---

    @Column(name = "image_url") // Bạn có thể giữ ảnh chung ở đây, hoặc chuyển xuống Variant
    private String imageUrl; 
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brand_id") 
    private Brand brand;

    // --- THÊM QUAN HỆ MỚI ---
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants;
    // --- HẾT PHẦN MỚI ---
}