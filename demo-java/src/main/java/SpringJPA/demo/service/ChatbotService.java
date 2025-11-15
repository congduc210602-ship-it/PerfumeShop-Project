package SpringJPA.demo.service;

import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    // Đây là logic chính của bot
    public String getBotResponse(String userQuery) {
        
        // 1. Chuẩn hóa input (chuyển về chữ thường, bỏ dấu...)
        String query = userQuery.toLowerCase().trim();

        // 2. Định nghĩa các luật
        if (query.contains("vận chuyển") || query.contains("ship") || query.contains("giao hàng")) {
            return "Chào bạn, phí ship đồng giá 30.000đ cho tất cả các đơn hàng nhé.";
        
        } else if (query.contains("địa chỉ") || query.contains("address")|| query.contains("cửa hàng")) {
            return "Bạn có thể đến xem hàng trực tiếp tại 216 đường Hai Bà Trưng, Quận 1, TPHCM.";

        } else if (query.contains("chính hãng") || query.contains("thật không")) {
            return "PerfumeShop cam kết 100% sản phẩm là hàng chính hãng. Bạn có thể check mã vạch thoải mái ạ.";

        } else if (query.contains("chào") || query.contains("hello")) {
            return "PerfumeShop xin chào. Bạn cần hỗ trợ vấn đề gì ạ?";
        
        } else {
            // Câu trả lời mặc định
            return "Cảm ơn bạn đã nhắn tin. Mình chưa hiểu rõ câu hỏi, bạn có thể mô tả chi tiết hơn không?";
        }
    }
}