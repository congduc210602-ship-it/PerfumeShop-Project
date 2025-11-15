package SpringJPA.demo.service;

import SpringJPA.demo.dto.BannerDto;
import java.util.List;

public interface BannerService {
    List<BannerDto> getAllBanners(); // Lấy tất cả (cho admin)
    List<BannerDto> getActiveBanners(); // Lấy banner đang hoạt động (cho user)
    BannerDto addBanner(BannerDto bannerDto); // Thêm mới (imageUrl sẽ được set sau khi upload)
    BannerDto updateBanner(Long id, BannerDto bannerDto); // Cập nhật
    void deleteBanner(Long id); // Xóa
    BannerDto setBannerImageUrl(Long id, String imageUrl); // Cập nhật imageUrl sau khi upload
}
