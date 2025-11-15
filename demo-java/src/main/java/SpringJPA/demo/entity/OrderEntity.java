package SpringJPA.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders") // Đặt tên bảng là 'orders' (số nhiều)
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nhiều đơn hàng thuộc về 1 User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "order_date", nullable = false, updatable = false)
    private LocalDateTime orderDate;

    // --- SỬA LỖI Ở ĐÂY ---
    // @Column(name = "total_price", nullable = false) // Dòng cũ (SAI)
    @Column(name = "total_price", nullable = false) // Sửa lại thành total_amount
    private Double totalAmount;
    // ----------------------

    // Ví dụ: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    @Column(nullable = false)
    private String status; 
    
    // --- Thông tin snapshot (lưu lại) ---
    @Column(name = "shipping_name", nullable = false)
    private String shippingName;
    
    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;

    @Column(name = "shipping_phone", nullable = false)
    private String shippingPhone;

    // Ví dụ: "COD" (Thanh toán khi nhận hàng), "BANK" (Chuyển khoản)
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;
    // ------------------------------------

    // Một đơn hàng có nhiều món hàng
    @OneToMany(
        mappedBy = "order", 
        cascade = CascadeType.ALL, // Xóa Order thì xóa luôn OrderItem
        orphanRemoval = true
    )
    @Builder.Default
    private List<OrderItemEntity> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.orderDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING"; // Mặc định khi mới tạo
        }
    }
    
    // Helper method
    public void addItem(OrderItemEntity item) {
        items.add(item);
        item.setOrder(this);
    }
}