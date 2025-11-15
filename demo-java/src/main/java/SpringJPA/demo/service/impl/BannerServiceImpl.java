package SpringJPA.demo.service.impl;

import SpringJPA.demo.dto.BannerDto;
import SpringJPA.demo.entity.Banner;
import SpringJPA.demo.exception.ResourceNotFoundException;
import SpringJPA.demo.mapper.BannerMapper;
import SpringJPA.demo.repository.BannerRepository;
import SpringJPA.demo.service.BannerService;
import lombok.RequiredArgsConstructor; // Sử dụng @RequiredArgsConstructor cho gọn
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Tự động inject BannerRepository
@Transactional
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    @Override
    public List<BannerDto> getAllBanners() {
        return bannerRepository.findAll().stream()
                .map(BannerMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BannerDto> getActiveBanners() {
        return bannerRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(BannerMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BannerDto addBanner(BannerDto bannerDto) {
        // imageUrl sẽ được set sau khi file đã upload thành công
        Banner banner = BannerMapper.toEntity(bannerDto);
        // banner.setImageUrl(null); // Đảm bảo imageUrl là null ban đầu
        Banner savedBanner = bannerRepository.save(banner);
        return BannerMapper.toDto(savedBanner);
    }

     @Override
    public BannerDto setBannerImageUrl(Long id, String imageUrl) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));
        banner.setImageUrl(imageUrl);
        Banner updatedBanner = bannerRepository.save(banner);
        return BannerMapper.toDto(updatedBanner);
    }

    @Override
    public BannerDto updateBanner(Long id, BannerDto bannerDto) {
        Banner existingBanner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));

        // Chỉ cập nhật các trường được phép thay đổi (không cho đổi imageUrl trực tiếp ở đây)
        existingBanner.setLinkUrl(bannerDto.getLinkUrl());
        existingBanner.setTitle(bannerDto.getTitle());
        existingBanner.setActive(bannerDto.getActive() != null ? bannerDto.getActive() : existingBanner.getActive());
        existingBanner.setDisplayOrder(bannerDto.getDisplayOrder() != null ? bannerDto.getDisplayOrder() : existingBanner.getDisplayOrder());

        Banner updatedBanner = bannerRepository.save(existingBanner);
        return BannerMapper.toDto(updatedBanner);
    }

    @Override
    public void deleteBanner(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Banner not found with id: " + id);
        }
        // TODO: Cần thêm logic xóa file ảnh liên quan trên server nếu cần
        bannerRepository.deleteById(id);
    }
}
