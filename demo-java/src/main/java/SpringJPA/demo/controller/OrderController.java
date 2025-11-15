package SpringJPA.demo.controller;

import SpringJPA.demo.dto.CheckoutRequestDTO;
import SpringJPA.demo.dto.OrderDTO;
import SpringJPA.demo.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders") // Đặt base URL là /api/orders
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * API 1: (POST /api/orders) - TẠO ĐƠN HÀNG MỚI (Thanh toán)
     * Đây là API mà frontend sẽ gọi khi bấm nút "Đặt hàng".
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CheckoutRequestDTO checkoutRequest,
                                         Authentication authentication) {
        try {
            OrderDTO newOrder = orderService.createOrder(checkoutRequest, authentication);
            return ResponseEntity.ok(newOrder);
        } catch (RuntimeException e) {
            // Trả về lỗi (ví dụ: hết hàng, giỏ hàng rỗng)
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * API 2: (GET /api/orders/my-orders) - Lấy lịch sử đơn hàng của tôi
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        List<OrderDTO> orders = orderService.getMyOrders(authentication);
        return ResponseEntity.ok(orders);
    }

    /**
     * API 3: (GET /api/orders) - Lấy TẤT CẢ đơn hàng (Dành cho Admin)
     */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        // (Lưu ý: API này nên được bảo vệ chỉ cho ADMIN)
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
}