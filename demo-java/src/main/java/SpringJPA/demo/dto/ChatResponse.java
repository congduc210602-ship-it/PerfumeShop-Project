package SpringJPA.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Thêm constructor để tạo nhanh
public class ChatResponse {
    private String reply;
}