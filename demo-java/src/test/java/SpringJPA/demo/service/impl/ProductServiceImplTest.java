package SpringJPA.demo.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import SpringJPA.demo.dto.ProductDto;
import SpringJPA.demo.dto.ProductVariantDto; // <-- IMPORT MỚI
import SpringJPA.demo.entity.Brand; // <-- IMPORT MỚI
import SpringJPA.demo.entity.Category;
import SpringJPA.demo.entity.Product;
import SpringJPA.demo.entity.ProductVariant; // <-- IMPORT MỚI
import SpringJPA.demo.exception.ResourceNotFoundException;
import SpringJPA.demo.repository.BrandRepository; // <-- IMPORT MỚI
import SpringJPA.demo.repository.CategoryRepository;
import SpringJPA.demo.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock // <-- THÊM MOCK CHO BRAND REPO
    private BrandRepository brandRepository;

    @InjectMocks
    private ProductServiceImpl productService; // Tự động inject cả 3 mock trên vào đây

    // Dữ liệu mẫu
    private Product product1;
    private Product product2;
    private Category category1;
    private Brand brand1;
    private ProductDto productDto1;
    private ProductVariant variant1;
    private ProductVariantDto variantDto1;

    @BeforeEach // Chạy trước mỗi @Test
    void setUp() {
        // Chuẩn bị dữ liệu mẫu
        category1 = Category.builder().id(1L).name("Nữ").build();
        brand1 = Brand.builder().id(1L).name("Chanel").build();

        // 1. Tạo DTO (Dữ liệu gửi từ API)
        variantDto1 = ProductVariantDto.builder()
                .dungTich("50ml")
                .price(3500000.0)
                .quantity(10)
                .build();
        
        productDto1 = ProductDto.builder()
                .id(1)
                .name("Chanel No. 5")
                .categoryId(1L)
                .brandId(1L)
                .variants(Collections.singletonList(variantDto1)) // Gán variant
                .build();

        // 2. Tạo Entity (Dữ liệu trong Database)
        product1 = Product.builder()
                .id(1)
                .name("Chanel No. 5")
                .category(category1)
                .brand(brand1)
                .build(); // KHÔNG CÒN .price()

        variant1 = ProductVariant.builder()
                .id(1L)
                .dungTich("50ml")
                .price(3500000.0)
                .quantity(10)
                .product(product1) // Quan hệ 2 chiều
                .build();
        
        product1.setVariants(Collections.singletonList(variant1)); // Gán variant cho product

        // (Tạo product2 để dùng cho test GetAll)
        product2 = Product.builder().id(2).name("Dior Sauvage").category(category1).brand(brand1).build();
        ProductVariant variant2 = ProductVariant.builder().id(2L).dungTich("100ml").price(2800000.0).quantity(5).product(product2).build();
        product2.setVariants(Collections.singletonList(variant2));
    }

    // Test: Kiểm tra thêm sản phẩm thành công.
    @Test
    void whenAddProduct_shouldReturnSavedProductDto() {
        // Arrange (Chuẩn bị)
        // Dạy mock cách hoạt động
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category1));
        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand1));
        when(productRepository.save(any(Product.class))).thenReturn(product1); // Trả về product1 (có variant)

        // Act (Thực thi)
        ProductDto result = productService.addProduct(productDto1);

        // Assert (Kiểm tra)
        assertNotNull(result);
        assertEquals("Chanel No. 5", result.getName());
        assertEquals(1, result.getId());
        assertEquals(1L, result.getCategoryId());
        // Kiểm tra xem variant có được map đúng không
        assertNotNull(result.getVariants());
        assertEquals(1, result.getVariants().size());
        assertEquals("50ml", result.getVariants().get(0).getDungTich());
        assertEquals(3500000.0, result.getVariants().get(0).getPrice());
    }

    // Test: Kiểm tra lấy sản phẩm theo ID.
    @Test
    void whenGetProductById_shouldReturnProductDto() {
        // Arrange
        when(productRepository.findById(1)).thenReturn(Optional.of(product1));

        // Act
        ProductDto result = productService.getProductById(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Chanel No. 5", result.getName());
        // Kiểm tra variant
        assertNotNull(result.getVariants());
        assertEquals(1, result.getVariants().size());
        assertEquals(3500000.0, result.getVariants().get(0).getPrice());
    }

    // Test: Kiểm tra ngoại lệ khi ID không tồn tại.
    @Test
    void whenGetProductById_withInvalidId_shouldThrowResourceNotFoundException() {
        // Arrange
        int invalidId = 999;
        when(productRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> productService.getProductById(invalidId)
        );
        
        assertEquals("Product not found with id: " + invalidId, exception.getMessage());
    }

    // Test: Kiểm tra số lượng sản phẩm trả về đúng.
    @Test
    void whenGetAllProducts_shouldReturnCorrectSize() {
        // Arrange
        List<Product> mockList = Arrays.asList(product1, product2);
        when(productRepository.findAll()).thenReturn(mockList);

        // Act
        List<ProductDto> results = productService.getAllProducts();

        // Assert
        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals("Dior Sauvage", results.get(1).getName());
        // Kiểm tra variant của product 2
        assertEquals(2800000.0, results.get(1).getVariants().get(0).getPrice());
    }
}