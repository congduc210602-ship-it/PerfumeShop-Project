package SpringJPA.demo.service;

import SpringJPA.demo.dto.LoginRequest;
import SpringJPA.demo.dto.RegisterRequest;
import SpringJPA.demo.dto.UserDTO; // Thêm UserDTO để trả về thông tin user khi login
import SpringJPA.demo.dto.UserProfileDTO; // <-- IMPORT MỚI
import SpringJPA.demo.dto.UserProfileUpdateDTO; // <-- IMPORT MỚI
import java.util.List;
public interface UserService {
    // Trả về DTO (chứa thông tin user) và Token
    String register(RegisterRequest request); 
    String login(LoginRequest request);
    

    UserProfileDTO updateProfile(String username, UserProfileUpdateDTO updateDTO);

}