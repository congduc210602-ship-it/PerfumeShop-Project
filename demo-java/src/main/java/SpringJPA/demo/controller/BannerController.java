package SpringJPA.demo.controller;

import SpringJPA.demo.dto.ApiResponse;
import SpringJPA.demo.dto.BannerDto;
import SpringJPA.demo.service.BannerService;
import SpringJPA.demo.service.FileStorageService; // Sử dụng lại FileStorageService
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import MultipartFile


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;
    private final FileStorageService fileStorageService; // Inject FileStorageService

    // API cho User: Lấy các banner đang hoạt động
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<BannerDto>>> getActiveBanners() {
        List<BannerDto> banners = bannerService.getActiveBanners();
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách banner hoạt động thành công", banners));
    }

    // --- API cho Admin ---

    // Lấy tất cả banner (cho Admin quản lý)
    @GetMapping
    public ResponseEntity<ApiResponse<List<BannerDto>>> getAllBanners() {
        // TODO: Thêm @PreAuthorize("hasRole('ADMIN')") nếu cần bảo mật
        List<BannerDto> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(new ApiResponse<>("Lấy tất cả banner thành công", banners));
    }

    // Thêm banner mới (Kèm upload ảnh)
    @PostMapping(consumes = {"multipart/form-data"}) // Chỉ định kiểu content-type
    public ResponseEntity<ApiResponse<BannerDto>> addBanner(
            @RequestParam("file") MultipartFile file, // Nhận file ảnh
            @RequestParam(value = "linkUrl", required = false) String linkUrl,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "active", defaultValue = "true") boolean active,
            @RequestParam(value = "displayOrder", defaultValue = "0") int displayOrder) {
        // TODO: Thêm @PreAuthorize("hasRole('ADMIN')") nếu cần bảo mật

        // 3. Upload file ảnh
         // Lấy URL truy cập ảnh
        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUri = fileStorageService.getFileUrl(fileName);
        // 1. Tạo DTO ban đầu (chưa có imageUrl)
        BannerDto bannerDto = BannerDto.builder()
                .linkUrl(linkUrl)
                .title(title)
                .active(active)
                .displayOrder(displayOrder)
                .imageUrl(fileDownloadUri)
                .build();

        // 2. Lưu thông tin banner (trừ ảnh) để lấy ID
        BannerDto createdBanner = bannerService.addBanner(bannerDto);

        

        // 4. Cập nhật imageUrl cho banner vừa tạo
        BannerDto finalBanner = bannerService.setBannerImageUrl(createdBanner.getId(), fileDownloadUri);

        return ResponseEntity.ok(new ApiResponse<>("Thêm banner thành công", finalBanner));
    }

    // Cập nhật thông tin banner (KHÔNG cập nhật ảnh ở đây)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BannerDto>> updateBannerInfo(
            @PathVariable Long id,
            @RequestBody BannerDto bannerDto) { // Chỉ nhận thông tin, không nhận file
         // TODO: Thêm @PreAuthorize("hasRole('ADMIN')") nếu cần bảo mật
        BannerDto updatedBanner = bannerService.updateBanner(id, bannerDto);
        return ResponseEntity.ok(new ApiResponse<>("Cập nhật thông tin banner thành công", updatedBanner));
    }

    // Xóa banner
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBanner(@PathVariable Long id) {
        // TODO: Thêm @PreAuthorize("hasRole('ADMIN')") nếu cần bảo mật
        // Lưu ý: Cần thêm logic xóa file ảnh vật lý trong BannerServiceImpl.deleteBanner
        bannerService.deleteBanner(id);
        return ResponseEntity.ok(new ApiResponse<>("Xóa banner thành công", null));
    }
}
