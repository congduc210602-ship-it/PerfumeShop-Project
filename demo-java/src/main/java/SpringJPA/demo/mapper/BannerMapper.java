package SpringJPA.demo.mapper;

import SpringJPA.demo.dto.BannerDto;
import SpringJPA.demo.entity.Banner;

public class BannerMapper {

    public static BannerDto toDto(Banner entity) {
        if (entity == null) return null;
        return BannerDto.builder()
                .id(entity.getId())
                .imageUrl(entity.getImageUrl())
                .linkUrl(entity.getLinkUrl())
                .title(entity.getTitle())
                .active(entity.getActive())
                .displayOrder(entity.getDisplayOrder())
                .build();
    }

    public static Banner toEntity(BannerDto dto) {
        if (dto == null) return null;
        return Banner.builder()
                .id(dto.getId()) // ID sẽ null khi thêm mới
                .imageUrl(dto.getImageUrl())
                .linkUrl(dto.getLinkUrl())
                .title(dto.getTitle())
                .active(dto.getActive() != null ? dto.getActive() : true) // Mặc định true nếu null
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0) // Mặc định 0 nếu null
                .build();
    }
}
