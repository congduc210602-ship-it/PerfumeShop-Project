package SpringJPA.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerDto {
    private Long id;
    private String imageUrl;
    private String linkUrl;
    private String title;
    private Boolean active;
    private Integer displayOrder;
}
