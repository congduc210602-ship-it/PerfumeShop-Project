package SpringJPA.demo.service.impl;

import SpringJPA.demo.dto.LoginRequest;
import SpringJPA.demo.dto.RegisterRequest;
import SpringJPA.demo.dto.UserProfileDTO; // <-- IMPORT MỚI
import SpringJPA.demo.dto.UserProfileUpdateDTO; // <-- IMPORT MỚI
import SpringJPA.demo.entity.CartEntity;
import SpringJPA.demo.entity.UserEntity;
import SpringJPA.demo.exception.ResourceNotFoundException; // <-- IMPORT MỚI
import SpringJPA.demo.repository.CartRepository;
import SpringJPA.demo.repository.UserRepository;
import SpringJPA.demo.service.JwtService;
import SpringJPA.demo.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final CartRepository cartRepository; 

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           JwtService jwtService, AuthenticationManager authManager,
                           CartRepository cartRepository) { 
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
        this.cartRepository = cartRepository; 
    }

    @Override
    @Transactional 
    public String register(RegisterRequest request) {
        // ... (Code hàm register của bạn giữ nguyên)
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        UserEntity user = UserEntity.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .email(request.getEmail())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .role("USER") 
                .build();
        UserEntity savedUser = userRepository.save(user);
        CartEntity newCart = new CartEntity(savedUser);
        cartRepository.save(newCart);
        return jwtService.generateToken(savedUser);
    }

    @Override
    public String login(LoginRequest request) {
        // ... (Code hàm login của bạn giữ nguyên)
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserEntity user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));
        return jwtService.generateToken(user);
    }

    // --- THÊM HÀM MỚI NÀY ---
    @Override
    @Transactional
    public UserProfileDTO updateProfile(String username, UserProfileUpdateDTO updateDTO) {
        // 1. Tìm user bằng username (từ token)
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        
        // 2. Cập nhật các trường
        user.setName(updateDTO.getName());
        user.setEmail(updateDTO.getEmail());
        user.setAddress(updateDTO.getAddress());
        user.setPhoneNumber(updateDTO.getPhoneNumber());
        
        // 3. Lưu (Hàm @PreUpdate trong UserEntity sẽ tự động cập nhật 'updatedAt')
        UserEntity updatedUser = userRepository.save(user);
        
        // 4. Trả về DTO đầy đủ
        return UserProfileDTO.fromEntity(updatedUser);
    }
    // -----------------------
}