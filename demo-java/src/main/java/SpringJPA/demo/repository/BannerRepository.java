package SpringJPA.demo.repository;

import SpringJPA.demo.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// ----- ĐÂY LÀ FILE BẠN CÓ THỂ ĐANG THIẾU -----
// Nó phải là một INTERFACE và kế thừa JpaRepository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    // Tìm các banner đang hoạt động, sắp xếp theo thứ tự hiển thị
    // Spring Data JPA sẽ tự động tạo query dựa trên tên phương thức này
    List<Banner> findByActiveTrueOrderByDisplayOrderAsc();

}
// ---------------------------------------------

