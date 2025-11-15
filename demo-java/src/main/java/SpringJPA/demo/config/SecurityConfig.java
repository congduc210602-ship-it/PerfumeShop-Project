package SpringJPA.demo.config;

import SpringJPA.demo.repository.UserRepository;
// Đảm bảo đường dẫn này đúng tới file filter của bạn
import SpringJPA.demo.security.JwtAuthenticationFilter; // <-- 1. IMPORT
import SpringJPA.demo.service.impl.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; // <-- 2. IMPORT
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // <-- 3. IMPORT

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // KHÔNG CẦN CONSTRUCTOR (Đây là nguyên nhân gây lỗi ở lần trước)

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return new UserDetailsServiceImpl(userRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(DaoAuthenticationProvider authenticationProvider) {
        return new ProviderManager(authenticationProvider);
    }

    // --- CHỈ CẦN SỬA HÀM NÀY ---
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter)
            throws Exception { // <-- 4. TRUYỀN FILTER VÀO ĐÂY
        http
                .cors(cors -> {
                })
                .csrf(csrf -> csrf.disable())

                // --- 5. BẬT STATELESS (BẮT BUỘC CHO JWT) ---
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // --- PUBLIC APIs (Giữ nguyên) ---
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers("/api/brands/**").permitAll()
                        .requestMatchers("/api/files/upload").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/banners/active").permitAll()
                        .requestMatchers("/api/chat").permitAll()
                        .requestMatchers("/api/ai/chat").permitAll()
                        // --- SECURED APIs (Giữ nguyên) ---
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/orders/my-orders").authenticated() // <-- THÊM DÒNG NÀY
                        .requestMatchers(HttpMethod.POST, "/api/orders").authenticated() // <-- THÊM DÒNG NÀY
                        .requestMatchers(HttpMethod.PUT, "/api/users/profile").authenticated()

                        // --- ADMIN APIs (Sửa lỗi bảo mật) ---
                        .requestMatchers("/api/auth/users").hasRole("ADMIN") // <-- SỬA TỪ permitAll
                        .requestMatchers("/api/banners/**").hasRole("ADMIN") // <-- SỬA TỪ permitAll
                        .requestMatchers("/api/brands/**").hasRole("ADMIN") // <-- SỬA TỪ permitAll
                        .requestMatchers("/api/users/**").hasRole("ADMIN") // <-- SỬA TỪ permitAll
                        .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("ADMIN")

                        .anyRequest().authenticated())
                .formLogin(login -> login.disable())
                .httpBasic(httpBasic -> httpBasic.disable())

                // --- 6. GẮN FILTER VÀO CHUỖI ---
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}