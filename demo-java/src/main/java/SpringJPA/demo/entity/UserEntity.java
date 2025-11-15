package SpringJPA.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class UserEntity implements UserDetails { // Implement UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // --- Các trường bổ sung theo đề bài ---
    private String name;
    private String email;
    private String address;
    @Column(name = "phone_number")
    private String phoneNumber;
    private String status; // active, inactive
    private String avatar; // URL ảnh đại diện
    @Column(name = "date_of_birth")
    private String dateOfBirth; // Giả sử lưu dưới dạng String (MM/DD/YYYY)
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    // ------------------------------------

    @Column
    private String role; // ADMIN, USER

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE"; 
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


    // --- IMPLEMENT USERDETAILS METHODS ---

    // Quan trọng: Trả về quyền (ROLE)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Đảm bảo role luôn có tiền tố "ROLE_" và viết hoa (Spring Security yêu cầu)
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.toUpperCase()));
    }

    // Các phương thức cơ bản (giữ nguyên true nếu không dùng logic phức tạp)
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return "ACTIVE".equalsIgnoreCase(this.status); }
    // -------------------------------------
}