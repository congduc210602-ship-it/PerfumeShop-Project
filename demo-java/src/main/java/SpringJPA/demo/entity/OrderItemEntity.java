package SpringJPA.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "order_item")
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nhiều món hàng thuộc về 1 Đơn hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    // Liên kết với biến thể (để tham chiếu)
    // (Lưu ý: Nếu xóa ProductVariant, liên kết này có thể bị lỗi,
    // nên chúng ta phải snapshot thông tin bên dưới)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id") // Có thể set nullable
    private ProductVariant productVariant;

    // --- Thông tin Snapshot (Rất quan trọng) ---
    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "dung_tich", nullable = false)
    private String dungTich;

    @Column(name = "image_url") // Lưu lại URL ảnh
    private String imageUrl;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_at_purchase", nullable = false)
    private Double price; // Giá của 1 sản phẩm TẠI THỜI ĐIỂM MUA
    // -----------------------------------------

}