package SpringJPA.demo.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import SpringJPA.demo.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    // Tìm user theo username (để xác thực đăng nhập)
    Optional<UserEntity> findByUsername(String username);
}
