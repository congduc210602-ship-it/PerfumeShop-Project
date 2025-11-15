package SpringJPA.demo.dto;

import SpringJPA.demo.entity.OrderEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private Long userId;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private String status;
    private String shippingName;
    private String shippingAddress;
    private String shippingPhone;
    private String paymentMethod;
    private List<OrderItemDTO> items;

    // Helper để map (chuyển đổi)
    public static OrderDTO fromEntity(OrderEntity entity) {
        List<OrderItemDTO> itemDTOs = entity.getItems().stream()
                .map(OrderItemDTO::fromEntity)
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .orderDate(entity.getOrderDate())
                .totalAmount(entity.getTotalAmount())
                .status(entity.getStatus())
                .shippingName(entity.getShippingName())
                .shippingAddress(entity.getShippingAddress())
                .shippingPhone(entity.getShippingPhone())
                .paymentMethod(entity.getPaymentMethod())
                .items(itemDTOs)
                .build();
    }
}