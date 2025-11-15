package SpringJPA.demo.mapper;

import SpringJPA.demo.dto.ProductVariantDto;
import SpringJPA.demo.entity.ProductVariant;

public class ProductVariantMapper {

    // Chuyển từ Entity (database) -> DTO (API response)
    public static ProductVariantDto toDto(ProductVariant entity) {
        if (entity == null) return null;
        return ProductVariantDto.builder()
                .id(entity.getId())
                .dungTich(entity.getDungTich())
                .price(entity.getPrice())
                .quantity(entity.getQuantity())
                .imageUrl(entity.getImageUrl())
                .build();
    }

    // Chuyển từ DTO (API request) -> Entity (database)
    // Lưu ý: hàm này CHƯA set product, service sẽ làm việc đó
    public static ProductVariant toEntity(ProductVariantDto dto) {
        if (dto == null) return null;
        return ProductVariant.builder()
                .id(dto.getId()) // Id thường là null khi tạo mới
                .dungTich(dto.getDungTich())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .imageUrl(dto.getImageUrl())
                .build();
    }
}