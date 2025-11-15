package SpringJPA.demo.service;

import SpringJPA.demo.dto.CheckoutRequestDTO;
import SpringJPA.demo.dto.OrderDTO;
import org.springframework.security.core.Authentication;
import java.util.List;

public interface OrderService {

    /**
     * Chức năng chính: Tạo một đơn hàng mới từ giỏ hàng của user.
     * Bao gồm: kiểm tra tồn kho, trừ kho, và xóa giỏ hàng.
     */
    OrderDTO createOrder(CheckoutRequestDTO checkoutRequest, Authentication authentication);

    /**
     * Lấy tất cả đơn hàng của user đang đăng nhập (để xem lịch sử).
     */
    List<OrderDTO> getMyOrders(Authentication authentication);
    
    /**
     * (Admin) Lấy tất cả đơn hàng trong hệ thống.
     */
    List<OrderDTO> getAllOrders();
}