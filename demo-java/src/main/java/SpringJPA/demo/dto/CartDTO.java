package SpringJPA.demo.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CartDTO {
    private Long cartId;
    private Long userId;
    private List<CartItemDTO> items;
    private Double totalPrice;
    private int totalItems; // Tổng số lượng sản phẩm
}