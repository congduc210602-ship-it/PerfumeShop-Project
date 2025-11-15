package SpringJPA.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemDTO {
    private Long cartItemId; // ID của món hàng (để xóa/cập nhật)
    private Long productVariantId; // ID của biến thể
    private String productName;
    private String productImageUrl;
    private String dungTich;
    private Double price; // Giá của 1 sản phẩm
    private int quantity;
    private Double linePrice; // (price * quantity)
}