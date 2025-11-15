package SpringJPA.demo.repository;

import SpringJPA.demo.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Long> {
    
    // Tìm giỏ hàng bằng ID của người dùng
    Optional<CartEntity> findByUserId(Long userId);
}