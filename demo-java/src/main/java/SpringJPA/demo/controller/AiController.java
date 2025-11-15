package SpringJPA.demo.controller;

import SpringJPA.demo.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    // Nhận một object { "message": "..." }
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatWithAi(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("response", "Tin nhắn không được để trống."));
        }

        String aiResponse = aiService.getChatResponse(userMessage);
        
        // Trả về một object { "response": "..." }
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}