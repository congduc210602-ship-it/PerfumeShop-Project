package SpringJPA.demo.mapper;

import SpringJPA.demo.dto.BrandDto;
import SpringJPA.demo.entity.Brand;

public class BrandMapper {
    public static BrandDto toDto(Brand brand) {
        if (brand == null) return null;
        return BrandDto.builder()
                .id(brand.getId())
                .name(brand.getName())
                .build();
    }

    public static Brand toEntity(BrandDto dto) {
        if (dto == null) return null;
        return Brand.builder()
                .id(dto.getId())
                .name(dto.getName())
                .build();
    }
}