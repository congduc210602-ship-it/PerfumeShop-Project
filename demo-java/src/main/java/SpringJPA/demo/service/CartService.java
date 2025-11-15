package SpringJPA.demo.service;

import SpringJPA.demo.dto.AddItemRequestDTO;
import SpringJPA.demo.dto.AdminCartDTO; // <-- 1. IMPORT
import SpringJPA.demo.dto.CartDTO;
import org.springframework.security.core.Authentication;
import java.nio.file.AccessDeniedException;
import java.util.List; // <-- 2. IMPORT

public interface CartService {

    /**
     * Lấy giỏ hàng (hoặc tạo mới nếu chưa có) cho user đang đăng nhập.
     */
    CartDTO getCart(Authentication authentication);

    /**
     * Thêm một sản phẩm (dựa trên productVariantId) vào giỏ hàng.
     */
    CartDTO addItemToCart(AddItemRequestDTO request, Authentication authentication);

    /**
     * Cập nhật số lượng của một món hàng trong giỏ.
     */
    CartDTO updateCartItem(Long cartItemId, int quantity, Authentication authentication) throws AccessDeniedException;

    /**
     * Xóa một món hàng khỏi giỏ.
     */
    CartDTO removeItemFromCart(Long cartItemId, Authentication authentication) throws AccessDeniedException;

    // --- 3. THÊM HÀM MỚI CHO ADMIN ---
    /**
     * (Admin) Lấy tất cả giỏ hàng trong hệ thống.
     */
    List<AdminCartDTO> getAllCarts();
}