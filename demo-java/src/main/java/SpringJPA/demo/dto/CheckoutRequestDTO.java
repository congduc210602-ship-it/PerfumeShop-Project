package SpringJPA.demo.dto;

import lombok.Data;
// 1. IMPORT CÁC ANNOTATION
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class CheckoutRequestDTO {
    
    @NotBlank(message = "Tên người nhận không được để trống")
    private String shippingName;
    
    @NotBlank(message = "Địa chỉ không được để trống")
    private String shippingAddress;
    
    // --- 2. THÊM RÀNG BUỘC CHO SĐT ---
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^0\\d{9,10}$", message = "Số điện thoại phải có 10 hoặc 11 số và bắt đầu bằng 0")
    private String shippingPhone;
    // --------------------------------

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod; 
}