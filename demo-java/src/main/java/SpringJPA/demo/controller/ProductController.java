package SpringJPA.demo.controller;

// Thêm các import HATEOAS
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
// ---
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import SpringJPA.demo.dto.ApiResponse;
import SpringJPA.demo.dto.ProductDto;
import SpringJPA.demo.service.ProductService;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Lấy danh sách sản phẩm
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        
        // Thêm links cho từng sản phẩm trong danh sách
        products.forEach(this::addLinksToProduct);
        
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách sản phẩm thành công", products));
    }

    // Lấy sản phẩm theo id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable("id") Integer id) {
        ProductDto product = productService.getProductById(id);
        
        // Thêm links cho sản phẩm
        addLinksToProduct(product);
        
        return ResponseEntity.ok(new ApiResponse<>("Lấy sản phẩm thành công", product));
    }

    // Thêm sản phẩm mới
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> addProduct(@Valid @RequestBody ProductDto productDto) {
        ProductDto newProduct = productService.addProduct(productDto);
        
        // Thêm links cho sản phẩm vừa tạo
        addLinksToProduct(newProduct);
        
        return ResponseEntity.ok(new ApiResponse<>("Thêm sản phẩm thành công", newProduct));
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@PathVariable("id") Integer id,
                                                                 @Valid @RequestBody ProductDto productDto) {
        ProductDto updatedProduct = productService.updateProduct(id, productDto);
        
        // Thêm links cho sản phẩm vừa cập nhật
        addLinksToProduct(updatedProduct);
        
        return ResponseEntity.ok(new ApiResponse<>("Cập nhật sản phẩm thành công", updatedProduct));
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable("id") Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>("Xóa sản phẩm thành công", null));
    }

    // Tìm kiếm sản phẩm theo tên
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductDto>>> searchProducts(@RequestParam String keyword) {
        List<ProductDto> results = productService.searchByName(keyword);
        
        // Thêm links cho từng sản phẩm
        results.forEach(this::addLinksToProduct);
        
        return ResponseEntity.ok(new ApiResponse<>("Tìm kiếm thành công", results));
    }

    // --- Phương thức private helper để thêm HATEOAS links ---
    private void addLinksToProduct(ProductDto product) {
        // Link 'self': trỏ đến chính nó
        product.add(linkTo(methodOn(ProductController.class).getProductById(product.getId())).withSelfRel());
        
        // Link 'all-products': trỏ đến danh sách tất cả sản phẩm
        product.add(linkTo(methodOn(ProductController.class).getAllProducts()).withRel("all-products"));
        
        // Link 'category': trỏ đến danh mục của nó (nếu có)
        if (product.getCategoryId() != null) {
            product.add(linkTo(methodOn(CategoryController.class).getCategoryById(product.getCategoryId())).withRel("category"));
        }
    }
}