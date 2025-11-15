package SpringJPA.demo.dto;

import SpringJPA.demo.entity.CartEntity;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminCartDTO {
    private Long id;
    private Long userId;
    private String userUsername; // Tên của chủ giỏ hàng
    private int totalItems;
    private double totalPrice;
    private LocalDateTime updatedAt; // Lần cuối người dùng hoạt động

    // Hàm helper để chuyển đổi từ Entity
    public static AdminCartDTO fromEntity(CartEntity cart) {
        
        // Tính toán tổng tiền và số lượng
        int items = 0;
        double price = 0.0;

        // Kiểm tra null an toàn
        if (cart.getItems() != null && !cart.getItems().isEmpty()) {
            items = cart.getItems().stream()
                        .mapToInt(item -> item.getQuantity())
                        .sum();
            price = cart.getItems().stream()
                        .mapToDouble(item -> item.getQuantity() * item.getProductVariant().getPrice())
                        .sum();
        }

        // Lấy thông tin User (nếu có)
        Long userId = null;
        String username = "N/A";
        LocalDateTime lastUpdate = null; // Tạm thời

        if (cart.getUser() != null) {
            userId = cart.getUser().getId();
            username = cart.getUser().getUsername();
            // Lý tưởng nhất, CartEntity nên có trường updatedAt riêng
            // Tạm thời, chúng ta dùng updatedAt của User
            lastUpdate = cart.getUser().getUpdatedAt();
        }

        return AdminCartDTO.builder()
                .id(cart.getId())
                .userId(userId)
                .userUsername(username)
                .totalItems(items)
                .totalPrice(price)
                .updatedAt(lastUpdate)
                .build();
    }
}