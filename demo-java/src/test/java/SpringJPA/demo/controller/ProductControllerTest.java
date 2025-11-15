package SpringJPA.demo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import SpringJPA.demo.dto.ProductDto;
import SpringJPA.demo.exception.GlobalExceptionHandler;
import SpringJPA.demo.exception.ResourceNotFoundException;
import SpringJPA.demo.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductController.class) // Chỉ test ProductController
@Import(GlobalExceptionHandler.class) // Import GlobalExceptionHandler để test lỗi 404
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc; // Dùng để giả lập các request HTTP

    @Autowired
    private ObjectMapper objectMapper; // Dùng để chuyển DTO -> JSON

    @MockBean // Tạo mock bean cho Service (vì Controller phụ thuộc vào nó)
    private ProductService productService;

    private ProductDto productDto1;

    @BeforeEach
    void setUp() {
        productDto1 = ProductDto.builder()
                .id(1)
                .name("Chanel No. 5")
                
                .categoryId(1L)
                .build();
    }

    // Test: Kiểm tra thêm sản phẩm thành công (POST)
    @Test
    void whenAddProduct_shouldReturn200AndProduct() throws Exception {
        // Arrange
        when(productService.addProduct(any(ProductDto.class))).thenReturn(productDto1);

        // Act & Assert
        mockMvc.perform(post("/api/products") // Gửi request POST
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productDto1))) // Gửi body JSON
                .andExpect(status().isOk()) // Mong đợi status 200 OK
                .andExpect(jsonPath("$.message").value("Thêm sản phẩm thành công"))
                .andExpect(jsonPath("$.data.name").value("Chanel No. 5"))
                .andExpect(jsonPath("$.data._links.self.href").exists()); // Test HATEOAS
    }

    // Test: Kiểm tra lấy sản phẩm theo ID (GET)
    @Test
    void whenGetProductById_shouldReturn200AndProduct() throws Exception {
        // Arrange
        when(productService.getProductById(1)).thenReturn(productDto1);

        // Act & Assert
        mockMvc.perform(get("/api/products/1")) // Gửi request GET
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Lấy sản phẩm thành công"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data._links.self.href").value("http://localhost/api/products/1"));
    }

    // Test: Kiểm tra ngoại lệ khi ID không tồn tại (GET)
    @Test
    void whenGetProductById_withInvalidId_shouldReturn404AndErrorResponse() throws Exception {
        // Arrange
        int invalidId = 999;
        String errorMessage = "Product not found with id: " + invalidId;
        // Giả lập service ném ra exception
        when(productService.getProductById(invalidId)).thenThrow(new ResourceNotFoundException(errorMessage));

        // Act & Assert
        mockMvc.perform(get("/api/products/" + invalidId))
                .andExpect(status().isNotFound()) // Mong đợi status 404 Not Found
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value(errorMessage))
                .andExpect(jsonPath("$.path").value("/api/products/" + invalidId));
    }
}