package SpringJPA.demo.repository;

import SpringJPA.demo.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

    // Tìm một món hàng cụ thể trong một giỏ hàng cụ thể
    // Dùng để kiểm tra xem sản phẩm đã có trong giỏ chưa
    Optional<CartItemEntity> findByCartIdAndProductVariantId(Long cartId, Long productVariantId);
}