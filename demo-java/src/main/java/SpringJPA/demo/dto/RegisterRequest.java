package SpringJPA.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String name;
    private String email;
    private String address;
    private String phoneNumber;
    // Có thể thêm các trường tùy chọn khác nếu cần
}