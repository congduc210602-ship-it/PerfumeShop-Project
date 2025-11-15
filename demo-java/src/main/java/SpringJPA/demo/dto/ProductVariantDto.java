package SpringJPA.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantDto {

    private Long id; // ID của biến thể

    @NotBlank(message = "Dung tích không được để trống")
    private String dungTich;

    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá tiền không được là số âm")
    private Double price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được là số âm")
    private Integer quantity;

    private String imageUrl;
    // Không cần productId ở đây vì nó sẽ nằm trong ProductDto
}