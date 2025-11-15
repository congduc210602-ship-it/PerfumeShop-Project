package SpringJPA.demo.mapper;

import SpringJPA.demo.dto.UserDTO;
import SpringJPA.demo.entity.UserEntity;

public class UserMapper {

    // Chuyển từ Entity → DTO
    public static UserDTO toDto(UserEntity user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }

    // Chuyển từ DTO → Entity
    public static UserEntity toEntity(UserDTO dto) {
        if (dto == null) return null;
        return UserEntity.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .role(dto.getRole())
                .build();
    }
}
