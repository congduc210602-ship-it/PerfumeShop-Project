package SpringJPA.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import SpringJPA.demo.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Có thể thêm các phương thức tùy ý, ví dụ tìm theo name
}
