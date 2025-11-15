package SpringJPA.demo.service;

import SpringJPA.demo.dto.GeminiRequestDTO;
import SpringJPA.demo.dto.GeminiResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class AiService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public AiService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String getChatResponse(String userMessage) {
        
        // --- ĐÂY LÀ PHẦN "HUẤN LUYỆN" (PRE-PROMPT) ---
        String systemPrompt = "Bạn là một trợ lý ảo tư vấn tại shop nước hoa PerfumeShop. " +
                "Hãy trả lời các câu hỏi của khách hàng một cách thân thiện, chuyên nghiệp. " +
                "Tập trung vào việc tư vấn mùi hương, các dòng sản phẩm, nồng độ (EDT/EDP), và các dịp sử dụng. " +
                "Không trả lời các câu hỏi không liên quan đến nước hoa hoặc mua sắm. " +
                "Hãy hỏi thêm câu hỏi để tư vấn tốt hơn nếu cần (ví dụ: 'Bạn tìm nước hoa cho nam hay nữ?', 'Bạn thích phong cách ngọt ngào hay cá tính?'). " +
                "Câu hỏi của khách: ";

        String fullPrompt = systemPrompt + userMessage;
        // ---------------------------------------------

        // Tạo Request Body cho Gemini
        GeminiRequestDTO.Part part = new GeminiRequestDTO.Part(fullPrompt);
        GeminiRequestDTO.Content content = new GeminiRequestDTO.Content(List.of(part));
        GeminiRequestDTO requestBody = new GeminiRequestDTO(List.of(content));

        try {
            // Gọi API
            GeminiResponseDTO response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .body(Mono.just(requestBody), GeminiRequestDTO.class)
                    .retrieve()
                    .bodyToMono(GeminiResponseDTO.class)
                    .block(); // .block() để biến nó thành đồng bộ (synchronous)

            return response.getFirstCandidateText();

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Lỗi khi gọi Gemini API: " + e.getMessage());
            return "Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại sau ít phút.";
        }
    }
}