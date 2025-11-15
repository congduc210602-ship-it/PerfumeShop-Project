package SpringJPA.demo.controller;

import SpringJPA.demo.dto.LoginRequest;
import SpringJPA.demo.dto.RegisterRequest;
import SpringJPA.demo.dto.UserDTO;
import SpringJPA.demo.service.UserService;
import SpringJPA.demo.dto.UserProfileDTO;
import SpringJPA.demo.entity.UserEntity;
import SpringJPA.demo.mapper.UserMapper;
import SpringJPA.demo.repository.UserRepository; // <-- IMPORT NÀY CẦN THIẾT

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors; // <-- IMPORT NÀY CẦN THIẾT

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository; // <-- INJECT ĐỐI TƯỢNG BỊ THIẾU

    // ----- CẬP NHẬT CONSTRUCTOR (THÊM UserRepository) -----
    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository; // GÁN GIÁ TRỊ
    }
    // ----------------------------------------------------

    /**
     * Chức năng Đăng ký: Trả về JWT Token.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        String token = userService.register(request);
        return ResponseEntity.ok(Map.of("message", "Registration successful", "token", token));
    }

    /**
     * Chức năng Đăng nhập: Trả về JWT Token và User Info. (Đã sửa lỗi Casting ngầm)
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        
        // 1. UserService xử lý xác thực và trả về Token
        String token = userService.login(request);
        
        // 2. LẤY USER ENTITY TỪ REPOSITORY (Thay vì cast)
        // Dùng username từ request để query DB
        UserEntity userEntity = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication")); // Dù pass đúng nhưng không tìm thấy user

        // 3. Tạo phản hồi cho Frontend
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);
        // Gửi User DTO (chứa username, role) cho Frontend lưu vào Local Storage
        response.put("user", UserProfileDTO.fromEntity(userEntity)); 

        return ResponseEntity.ok(response);
    }
    
    /**
     * Logout (JWT stateless)
     */
     @PostMapping("/logout")
     public ResponseEntity<String> logout() {
         return ResponseEntity.ok("Logged out successfully");
     }

    /**
     * API ADMIN: Lấy danh sách tất cả người dùng (Admin Dashboard)
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserEntity> users = userRepository.findAll(); 
        
        // Hoàn thiện logic map và trả về
        List<UserDTO> userDTOs = users.stream()
                .map(user -> UserMapper.toDto(user)) 
                .collect(Collectors.toList());
        
        // Trả về danh sách users
        return ResponseEntity.ok(userDTOs);
    }
}