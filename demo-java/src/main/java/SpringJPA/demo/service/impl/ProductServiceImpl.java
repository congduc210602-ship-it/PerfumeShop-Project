package SpringJPA.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import SpringJPA.demo.dto.ProductDto;
import SpringJPA.demo.entity.Product;
import SpringJPA.demo.entity.Category;
import SpringJPA.demo.entity.Brand;
import SpringJPA.demo.entity.ProductVariant; // <-- IMPORT MỚI
import SpringJPA.demo.exception.ResourceNotFoundException;
import SpringJPA.demo.mapper.ProductMapper;
import SpringJPA.demo.mapper.ProductVariantMapper; // <-- IMPORT MỚI

import SpringJPA.demo.repository.CategoryRepository;
import SpringJPA.demo.repository.ProductRepository;
import SpringJPA.demo.repository.BrandRepository; 
// Không cần ProductVariantRepository vì cascade
import SpringJPA.demo.service.ProductService;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository; 

    // Constructor vẫn như cũ (giống file của bạn)
    public ProductServiceImpl(ProductRepository productRepository, 
                                CategoryRepository categoryRepository, 
                                BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    @Override
    public ProductDto addProduct(ProductDto productDto) {
        // 1. Tìm Category
        Category category = null;
        if (productDto.getCategoryId() != null) {
            category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        // 2. Tìm Brand
        Brand brand = null;
        if (productDto.getBrandId() != null) {
            brand = brandRepository.findById(productDto.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        }
        
        // 3. Mapper lo hết: Chuyển ProductDto (có List<VariantDto>) 
        //    thành Product (có List<Variant>)
        Product product = ProductMapper.toEntity(productDto, category, brand);
        
        // 4. Lưu Product. Nhờ CascadeType.ALL, JPA tự động lưu cả các Variants
        Product saved = productRepository.save(product);
        return ProductMapper.toDto(saved);
    }

    @Override
    public ProductDto updateProduct(Integer id, ProductDto productDto) {
        // 1. Tìm sản phẩm cũ
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // 2. Cập nhật các trường đơn giản (name, desc, image)
        existing.setName(productDto.getName());
        existing.setDescription(productDto.getDescription());
        existing.setImageUrl(productDto.getImageUrl());

        // 3. Cập nhật Category
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            existing.setCategory(category);
        } else {
            existing.setCategory(null);
        }

        // 4. Cập nhật Brand
        if (productDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(productDto.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
            existing.setBrand(brand);
        } else {
            existing.setBrand(null);
        }

        // 5. CẬP NHẬT DANH SÁCH VARIANTS (PHỨC TẠP NHẤT)
        // Nhờ "orphanRemoval=true", ta chỉ cần xóa list cũ và thêm list mới
        
        // Xóa tất cả variant cũ
        existing.getVariants().clear(); 
        
        // Chuyển đổi các DTO variant mới thành Entity
        if (productDto.getVariants() != null) {
            List<ProductVariant> newVariants = productDto.getVariants().stream()
                .map(variantDto -> {
                    ProductVariant variant = ProductVariantMapper.toEntity(variantDto);
                    variant.setProduct(existing); // Set quan hệ 2 chiều
                    return variant;
                })
                .collect(Collectors.toList());
            
            // Thêm tất cả variant mới vào
            existing.getVariants().addAll(newVariants);
        }
        
        // 6. Lưu lại. JPA sẽ tự động:
        //    - UPDATE product
        //    - DELETE các variants cũ (do orphanRemoval)
        //    - INSERT các variants mới
        Product saved = productRepository.save(existing);
        return ProductMapper.toDto(saved);
    }


    // ===============================================
    // CÁC HÀM NÀY KHÔNG THAY ĐỔI GÌ CẢ
    // Vì ProductMapper.toDto đã lo việc chuyển đổi
    // ===============================================

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toDto) // Mapper đã được cập nhật
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductMapper.toDto(product); // Mapper đã được cập nhật
    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        // Nhờ Cascade, xóa Product sẽ tự động xóa các Variant
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDto> searchByName(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(ProductMapper::toDto) // Mapper đã được cập nhật
                .collect(Collectors.toList());
    }
}