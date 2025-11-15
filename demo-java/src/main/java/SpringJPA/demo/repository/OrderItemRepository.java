package SpringJPA.demo.repository;

import SpringJPA.demo.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
    // Hiện tại không cần hàm custom
}