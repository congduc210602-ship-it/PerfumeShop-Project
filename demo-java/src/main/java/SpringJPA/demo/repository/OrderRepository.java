package SpringJPA.demo.repository;

import SpringJPA.demo.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    // Tìm tất cả đơn hàng của một user (để xem lịch sử đơn hàng)
    List<OrderEntity> findByUserIdOrderByOrderDateDesc(Long userId);
}