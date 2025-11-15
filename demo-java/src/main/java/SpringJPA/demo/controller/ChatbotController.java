package SpringJPA.demo.controller;

import SpringJPA.demo.dto.ChatRequest;
import SpringJPA.demo.dto.ChatResponse;
import SpringJPA.demo.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatResponse> handleChatMessage(@RequestBody ChatRequest chatRequest) {
        
        // 1. Lấy câu trả lời từ service
        String reply = chatbotService.getBotResponse(chatRequest.getMessage());
        
        // 2. Đóng gói và gửi về cho React
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}