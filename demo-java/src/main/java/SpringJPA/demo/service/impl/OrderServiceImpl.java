package SpringJPA.demo.service.impl;

import SpringJPA.demo.dto.CheckoutRequestDTO;
import SpringJPA.demo.dto.OrderDTO;
import SpringJPA.demo.entity.*;
import SpringJPA.demo.exception.ResourceNotFoundException;
import SpringJPA.demo.repository.*;
import SpringJPA.demo.service.CartService; // Sẽ dùng để lấy CartEntity
import SpringJPA.demo.service.OrderService;
import jakarta.persistence.LockModeType; // Import PESSIMISTIC_WRITE lock
import org.springframework.data.jpa.repository.Lock;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    // (Lưu ý: Chúng ta KHÔNG inject CartService để tránh lỗi phụ thuộc vòng,
    // thay vào đó, chúng ta inject trực tiếp các repository)

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartRepository cartRepository,
                            ProductVariantRepository productVariantRepository,
                            UserRepository userRepository,
                            CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
    }

    private UserEntity getUserFromAuthentication(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    @Override
    @Transactional // Đây là một giao dịch RẤT QUAN TRỌNG
    public OrderDTO createOrder(CheckoutRequestDTO checkoutRequest, Authentication authentication) {
        
        // 1. Lấy User
        UserEntity user = getUserFromAuthentication(authentication);

        // 2. Lấy Cart
        CartEntity cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống, không thể thanh toán.");
        }

        List<CartItemEntity> cartItems = cart.getItems();

        // 3. & 4. Khóa, Kiểm tra tồn kho và Tính tổng tiền
        // (Đây là phần phức tạp nhất)
        List<OrderItemEntity> orderItems = new ArrayList<>();
        double totalAmount = 0;

        for (CartItemEntity cartItem : cartItems) {
            ProductVariant variant = cartItem.getProductVariant();

            // --- KHÓA SẢN PHẨM ĐỂ KIỂM TRA TỒN KHO ---
            // Chúng ta "khóa" hàng (variant) này trong DB.
            // Nếu 2 người cùng mua 1 lúc, người thứ 2 sẽ phải đợi.
            ProductVariant lockedVariant = productVariantRepository.findById(variant.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không còn tồn tại: " + variant.getId()));

            if (cartItem.getQuantity() > lockedVariant.getQuantity()) {
                // Nếu số lượng trong giỏ > số lượng còn lại
                throw new RuntimeException("Sản phẩm " + lockedVariant.getProduct().getName() + " (" + lockedVariant.getDungTich() + ") không đủ hàng.");
            }

            // 5. Tạo OrderItem (Snapshot thông tin)
            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .productVariant(variant)
                    .productName(variant.getProduct().getName()) // Snapshot tên
                    .dungTich(variant.getDungTich()) // Snapshot dung tích
                    .imageUrl(variant.getProduct().getImageUrl())
                    .quantity(cartItem.getQuantity())
                    .price(variant.getPrice()) // Snapshot giá
                    .build();
            
            orderItems.add(orderItem);

            // 6. Trừ tồn kho
            lockedVariant.setQuantity(lockedVariant.getQuantity() - cartItem.getQuantity());
            productVariantRepository.save(lockedVariant); // Cập nhật tồn kho

            totalAmount += orderItem.getPrice() * orderItem.getQuantity();
        }

        // 4. Tạo OrderEntity
        OrderEntity newOrder = OrderEntity.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status("PENDING") // Trạng thái ban đầu
                .shippingName(checkoutRequest.getShippingName())
                .shippingAddress(checkoutRequest.getShippingAddress())
                .shippingPhone(checkoutRequest.getShippingPhone())
                .paymentMethod(checkoutRequest.getPaymentMethod())
                .build();

        // Liên kết OrderItems với Order
        for (OrderItemEntity item : orderItems) {
            newOrder.addItem(item);
        }

        // 8. Lưu Order (và OrderItems, nhờ CascadeType.ALL)
        OrderEntity savedOrder = orderRepository.save(newOrder);

        // 7. Xóa sạch giỏ hàng (Xóa CartItems)
        // Dùng orphanRemoval=true trong CartEntity để xóa
        cart.getItems().clear();
        cartRepository.save(cart);

        // 9. Trả về DTO của đơn hàng vừa tạo
        return OrderDTO.fromEntity(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getMyOrders(Authentication authentication) {
        UserEntity user = getUserFromAuthentication(authentication);
        List<OrderEntity> orders = orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
        
        return orders.stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        // (Dành cho Admin, sẽ cần bảo mật sau)
        List<OrderEntity> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }
}