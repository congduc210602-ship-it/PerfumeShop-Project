package SpringJPA.demo.service;

import SpringJPA.demo.dto.BrandDto;
import java.util.List;

public interface BrandService {
    List<BrandDto> getAllBrands();
    BrandDto getBrandById(Long id);
    BrandDto addBrand(BrandDto brandDto);
    BrandDto updateBrand(Long id, BrandDto brandDto);
    void deleteBrand(Long id);
}