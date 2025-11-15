package SpringJPA.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

import org.springframework.hateoas.RepresentationModel;
// import jakarta.validation.constraints.Min; // <-- QUAN TRỌNG: Import Min
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class ProductDto extends RepresentationModel<ProductDto> {
    private Integer id;
    private String name;
    private String description;
    // @NotNull(message = "Giá không được để trống")
    // @Min(value = 0, message = "Giá tiền không được là số âm")
    // private Double price;
    // @NotNull(message = "Số lượng không được để trống")
    // @Min(value = 0, message = "Số lượng không được là số âm")
    // private Integer quantity;
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private Long brandId;
    private String brandName;

    // @NotBlank(message = "Dung tích không được để trống")
    // private String dungTich;

    private List<ProductVariantDto> variants;
}

