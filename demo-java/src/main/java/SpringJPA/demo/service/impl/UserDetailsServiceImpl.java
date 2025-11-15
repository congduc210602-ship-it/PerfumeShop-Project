package SpringJPA.demo.service.impl;
// import java.util.List;
// import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import SpringJPA.demo.dto.ProductDto;
import SpringJPA.demo.entity.Product;
import SpringJPA.demo.entity.UserEntity;
import SpringJPA.demo.entity.Category;
import SpringJPA.demo.exception.ResourceNotFoundException;
import SpringJPA.demo.mapper.ProductMapper;

import SpringJPA.demo.repository.CategoryRepository;
import SpringJPA.demo.repository.ProductRepository;
import SpringJPA.demo.repository.UserRepository;
import SpringJPA.demo.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService{

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User.builder()
        .username(user.getUsername())
        .password(user.getPassword())
        .roles(user.getRole())
        .build();
    }
    
}
