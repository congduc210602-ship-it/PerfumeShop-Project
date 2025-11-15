package SpringJPA.demo.dto;

import lombok.Data;

@Data
public class AddItemRequestDTO {
    // Frontend chỉ cần gửi ID của biến thể (ví dụ: 100ml)
    private Long productVariantId; 
    private int quantity;
}