package SpringJPA.demo.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // Khóa bí mật JWT, lấy từ application.properties (jwt.secret)
    @Value("${jwt.secret}") 
    private String SECRET_KEY;

    // Thời gian hết hạn, lấy từ application.properties (jwt.expiration)
    @Value("${jwt.expiration}") 
    private long EXPIRATION_TIME; 

    private Key getSignKey() {
        // Giải mã khóa từ Base64 (bắt buộc cho Jwts.builder)
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY); 
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    // Hàm tạo token (sử dụng khi đăng ký/đăng nhập thành công)
    public String generateToken(UserDetails userDetails) {
        // Đặt Role vào Claims để filter có thể đọc được (tùy chọn nhưng hữu ích)
        Map<String, Object> claims = new HashMap<>();
        // claims.put("roles", userDetails.getAuthorities().stream().map(Object::toString).toList()); // Tùy chọn

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }
}