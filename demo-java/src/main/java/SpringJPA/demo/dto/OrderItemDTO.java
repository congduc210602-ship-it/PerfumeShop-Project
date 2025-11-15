package SpringJPA.demo.dto;

import SpringJPA.demo.entity.OrderItemEntity;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemDTO {
    private Long id;
    private String productName;
    private String dungTich;
    private String imageUrl;
    private Integer quantity;
    private Double price; // Giá tại thời điểm mua

    // Helper để map (chuyển đổi)
    public static OrderItemDTO fromEntity(OrderItemEntity entity) {
        return OrderItemDTO.builder()
                .id(entity.getId())
                .productName(entity.getProductName())
                .dungTich(entity.getDungTich())
                .imageUrl(entity.getImageUrl())
                .quantity(entity.getQuantity())
                .price(entity.getPrice())
                .build();
    }
}