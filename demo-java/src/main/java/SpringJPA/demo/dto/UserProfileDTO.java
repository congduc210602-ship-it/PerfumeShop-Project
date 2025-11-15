package SpringJPA.demo.dto;

import SpringJPA.demo.entity.UserEntity;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDTO {
    private Long id;
    private String username;
    private String role;
    private String name;
    private String email;
    private String address;
    private String phoneNumber;

    // Hàm helper để chuyển đổi từ Entity
    public static UserProfileDTO fromEntity(UserEntity user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}