package SpringJPA.demo.controller;

import SpringJPA.demo.dto.ApiResponse; // <-- Import ApiResponse
import SpringJPA.demo.dto.BrandDto;
import SpringJPA.demo.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands") // <-- API path mà React đang gọi
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    // GET /api/brands
    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandDto>>> getAllBrands() {
        List<BrandDto> brands = brandService.getAllBrands();
        // Giống như ProductController, chúng ta trả về theo format ApiResponse
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách thương hiệu thành công", brands));
    }

    // GET /api/brands/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandDto>> getBrandById(@PathVariable Long id) {
        BrandDto brand = brandService.getBrandById(id);
        return ResponseEntity.ok(new ApiResponse<>("Lấy thương hiệu thành công", brand));
    }

    // POST /api/brands
    @PostMapping
    public ResponseEntity<ApiResponse<BrandDto>> addBrand(@RequestBody BrandDto brandDto) {
        BrandDto newBrand = brandService.addBrand(brandDto);
        return ResponseEntity.ok(new ApiResponse<>("Thêm thương hiệu thành công", newBrand));
    }

    // PUT /api/brands/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandDto>> updateBrand(@PathVariable Long id, @RequestBody BrandDto brandDto) {
        BrandDto updatedBrand = brandService.updateBrand(id, brandDto);
        return ResponseEntity.ok(new ApiResponse<>("Cập nhật thương hiệu thành công", updatedBrand));
    }

    // DELETE /api/brands/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(new ApiResponse<>("Xóa thương hiệu thành công", null));
    }
}