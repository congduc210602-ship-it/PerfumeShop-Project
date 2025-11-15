package SpringJPA.demo.controller;

import SpringJPA.demo.dto.AdminCartDTO;
import SpringJPA.demo.service.CartService; // <-- Inject Service
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // <-- Import
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin") // <-- Đường dẫn chung là /api/admin
public class AdminCartController {

    private final CartService cartService;

    public AdminCartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Endpoint mới để Admin lấy tất cả giỏ hàng
     *
     * URL: GET /api/admin/carts
     * Cần quyền: ADMIN
     */
    @GetMapping("/carts") // <-- Đường dẫn cụ thể là /carts
    @PreAuthorize("hasRole('ADMIN')") // <-- Bảo vệ endpoint này, chỉ ADMIN mới vào được
    public ResponseEntity<List<AdminCartDTO>> getAllCarts() {
        // Gọi service method bạn đã tạo
        List<AdminCartDTO> allCarts = cartService.getAllCarts();
        return ResponseEntity.ok(allCarts);
    }

    // Bạn có thể thêm các API admin khác vào đây (ví dụ: quản lý user, quản lý đơn hàng...)
}