package SpringJPA.demo.service;

import java.util.List;

import SpringJPA.demo.dto.ProductDto;

public interface ProductService {
    ProductDto addProduct(ProductDto productDto);
    List<ProductDto> getAllProducts();
    ProductDto getProductById(Integer id);
    ProductDto updateProduct(Integer id, ProductDto productDto);
    void deleteProduct(Integer id);
    List<ProductDto> searchByName(String keyword);
    

}

