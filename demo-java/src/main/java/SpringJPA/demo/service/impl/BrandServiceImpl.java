package SpringJPA.demo.service.impl;

import SpringJPA.demo.dto.BrandDto;
import SpringJPA.demo.entity.Brand;
import SpringJPA.demo.exception.ResourceNotFoundException;
import SpringJPA.demo.mapper.BrandMapper;
import SpringJPA.demo.repository.BrandRepository;
import SpringJPA.demo.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(BrandMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BrandDto getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        return BrandMapper.toDto(brand);
    }

    @Override
    public BrandDto addBrand(BrandDto brandDto) {
        Brand brand = BrandMapper.toEntity(brandDto);
        Brand savedBrand = brandRepository.save(brand);
        return BrandMapper.toDto(savedBrand);
    }

    @Override
    public BrandDto updateBrand(Long id, BrandDto brandDto) {
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        
        existingBrand.setName(brandDto.getName());
        // (Thêm các trường khác nếu có)
        
        Brand updatedBrand = brandRepository.save(existingBrand);
        return BrandMapper.toDto(updatedBrand);
    }

    @Override
    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Brand not found with id: " + id);
        }
        brandRepository.deleteById(id);
    }
}