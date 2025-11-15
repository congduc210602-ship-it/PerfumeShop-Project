package SpringJPA.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="banners") // Tên bảng trong CSDL
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", length = 500) // Mặc định nullable = true
private String imageUrl;

    @Column(name = "link_url", length = 500) // URL khi click (tùy chọn)
    private String linkUrl;

    @Column(name = "title", length = 255) // Tiêu đề/Alt text (tùy chọn)
    private String title;

    @Column(name = "is_active", nullable = false)
    @Builder.Default // Giá trị mặc định khi tạo bằng Builder
    private Boolean active = true; // Mặc định là hiển thị

    @Column(name = "display_order") // Thứ tự hiển thị (tùy chọn)
    private Integer displayOrder = 0;
}
