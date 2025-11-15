package SpringJPA.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import SpringJPA.demo.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    // Spring Data JPA sẽ tự động tạo các hàm CRUD cơ bản
}