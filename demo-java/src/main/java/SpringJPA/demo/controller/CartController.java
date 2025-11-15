package SpringJPA.demo.controller;

import SpringJPA.demo.dto.AddItemRequestDTO;
import SpringJPA.demo.dto.CartDTO;
import SpringJPA.demo.service.CartService; // <-- Inject Interface
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService; // <-- Inject Interface

    public CartController(CartService cartService) { // <-- Nhận Interface
        this.cartService = cartService;
    }

    // 1. GET /api/cart - Lấy giỏ hàng của user hiện tại
    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        CartDTO cart = cartService.getCart(authentication);
        return ResponseEntity.ok(cart);
    }

    // 2. POST /api/cart/items - Thêm một món hàng vào giỏ
    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItem(@RequestBody AddItemRequestDTO request, Authentication authentication) {
        try {
            CartDTO cart = cartService.addItemToCart(request, authentication);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            // Nên trả về lỗi rõ ràng hơn
            return ResponseEntity.badRequest().body(null); 
        }
    }

    // 3. PUT /api/cart/items/{itemId} - Cập nhật số lượng
    @PutMapping("/items/{itemId}")
    public ResponseEntity<?> updateItem(@PathVariable Long itemId, 
                                        @RequestBody Map<String, Integer> requestBody, 
                                        Authentication authentication) {
        try {
            int quantity = requestBody.get("quantity");
            CartDTO cart = cartService.updateCartItem(itemId, quantity, authentication);
            return ResponseEntity.ok(cart);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Denied"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 4. DELETE /api/cart/items/{itemId} - Xóa một món hàng
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long itemId, Authentication authentication) {
        try {
            CartDTO cart = cartService.removeItemFromCart(itemId, authentication);
            return ResponseEntity.ok(cart);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Denied"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}