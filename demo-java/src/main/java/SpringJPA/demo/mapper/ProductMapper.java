package SpringJPA.demo.mapper;

import SpringJPA.demo.dto.ProductDto;
import SpringJPA.demo.dto.ProductVariantDto; // <-- IMPORT MỚI
import SpringJPA.demo.entity.Product;
import SpringJPA.demo.entity.Category;
import SpringJPA.demo.entity.Brand;
import SpringJPA.demo.entity.ProductVariant; // <-- IMPORT MỚI

import java.util.Collections; // <-- IMPORT MỚI
import java.util.List; // <-- IMPORT MỚI
import java.util.stream.Collectors; // <-- IMPORT MỚI

public class ProductMapper {

    // Chuyển từ Entity -> DTO (Để trả về cho API)
    public static ProductDto toDto(Product p) {
        if (p == null) return null;

        // Chuyển danh sách Entity Variant -> DTO Variant
        List<ProductVariantDto> variantDtos = (p.getVariants() == null) ? Collections.emptyList() : 
            p.getVariants().stream()
                .map(ProductVariantMapper::toDto) // Gọi mapper con
                .collect(Collectors.toList());

        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .brandId(p.getBrand() != null ? p.getBrand().getId() : null)
                .brandName(p.getBrand() != null ? p.getBrand().getName() : null)
                .imageUrl(p.getImageUrl())
                .variants(variantDtos) // <-- THAY ĐỔI: Dùng danh sách variants
                .build();
    }

    // Chuyển từ DTO -> Entity (Để lưu vào DB)
    public static Product toEntity(ProductDto d, Category category, Brand brand) {
        if (d == null) return null;

        // 1. Tạo Product chính (chưa có variant)
        Product product = Product.builder()
                .id(d.getId())
                .name(d.getName())
                .description(d.getDescription())
                .category(category)
                .brand(brand)
                .imageUrl(d.getImageUrl())
                .build(); // CHƯA build vội, hoặc build rồi set list sau

        // 2. Chuyển danh sách DTO Variant -> Entity Variant
        List<ProductVariant> variants = (d.getVariants() == null) ? Collections.emptyList() :
            d.getVariants().stream()
                .map(dtoVariant -> {
                    ProductVariant entityVariant = ProductVariantMapper.toEntity(dtoVariant);
                    entityVariant.setProduct(product); // <-- RẤT QUAN TRỌNG: Set quan hệ 2 chiều
                    return entityVariant;
                })
                .collect(Collectors.toList());

        // 3. Set danh sách variant vào product
        product.setVariants(variants);

        return product;
    }
}