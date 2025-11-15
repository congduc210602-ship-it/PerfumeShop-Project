package SpringJPA.demo.controller;

import SpringJPA.demo.dto.UserProfileDTO;
import SpringJPA.demo.dto.UserProfileUpdateDTO;
import SpringJPA.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users") // Base URL mới
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * API: PUT /api/users/profile
     * Cập nhật thông tin profile của user đang đăng nhập.
     */
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateMyProfile(
            @Valid @RequestBody UserProfileUpdateDTO updateDTO,
            Authentication authentication) {
        
        // Lấy username từ token (đảm bảo an toàn)
        String username = authentication.getName();
        
        UserProfileDTO updatedUser = userService.updateProfile(username, updateDTO);
        
        return ResponseEntity.ok(updatedUser);
    }
}