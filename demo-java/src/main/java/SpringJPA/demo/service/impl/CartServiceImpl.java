package SpringJPA.demo.service.impl;

import SpringJPA.demo.dto.AddItemRequestDTO;
import SpringJPA.demo.dto.AdminCartDTO; // <-- 1. IMPORT
import SpringJPA.demo.dto.CartDTO;
import SpringJPA.demo.entity.CartEntity;
import SpringJPA.demo.entity.CartItemEntity;
import SpringJPA.demo.entity.ProductVariant;
import SpringJPA.demo.entity.UserEntity;
import SpringJPA.demo.mapper.CartMapper;
import SpringJPA.demo.repository.CartItemRepository;
import SpringJPA.demo.repository.CartRepository;
import SpringJPA.demo.repository.ProductVariantRepository;
import SpringJPA.demo.repository.UserRepository;
import SpringJPA.demo.service.CartService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List; // <-- 2. IMPORT
import java.util.Optional;
import java.util.stream.Collectors; // <-- 3. IMPORT

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           ProductVariantRepository productVariantRepository,
                           UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
    }

    private UserEntity getUserFromAuthentication(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    // Giữ nguyên: không có @Transactional
    public CartEntity getOrCreateCart(UserEntity user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    CartEntity newCart = new CartEntity(user);
                    return cartRepository.save(newCart);
                });
    }

    // 1. Lấy giỏ hàng (ĐÃ SỬA: Bỏ readOnly=true)
    @Override
    @Transactional
    public CartDTO getCart(Authentication authentication) {
        UserEntity user = getUserFromAuthentication(authentication);
        CartEntity cart = getOrCreateCart(user);
        return CartMapper.toCartDTO(cart);
    }

    // 2. Thêm sản phẩm vào giỏ (ĐÃ SỬA)
    @Override
    @Transactional
    public CartDTO addItemToCart(AddItemRequestDTO request, Authentication authentication) {
        UserEntity user = getUserFromAuthentication(authentication);
        CartEntity cart = getOrCreateCart(user); // 'cart' bây giờ là đối tượng managed

        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new RuntimeException("ProductVariant not found"));
        
        if (request.getQuantity() > variant.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

        Optional<CartItemEntity> existingItemOpt = cartItemRepository
                .findByCartIdAndProductVariantId(cart.getId(), request.getProductVariantId());

        if (existingItemOpt.isPresent()) {
            CartItemEntity existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            
            if (newQuantity > variant.getQuantity()) {
                newQuantity = variant.getQuantity();
            }
            existingItem.setQuantity(newQuantity);
        } else {
            CartItemEntity newItem = new CartItemEntity(cart, variant, request.getQuantity());
            cart.getItems().add(newItem); 
        }
        
        return CartMapper.toCartDTO(cart);
    }

    // 3. Cập nhật số lượng (ĐÃ SỬA)
    @Override
    @Transactional
    public CartDTO updateCartItem(Long cartItemId, int quantity, Authentication authentication) throws AccessDeniedException {
        UserEntity user = getUserFromAuthentication(authentication);
        CartItemEntity item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));
        
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not own this cart item");
        }
        
        if (quantity <= 0) {
            item.getCart().getItems().remove(item);
        } else {
            if (quantity > item.getProductVariant().getQuantity()) {
               quantity = item.getProductVariant().getQuantity();
            }
            item.setQuantity(quantity);
        }

        return CartMapper.toCartDTO(item.getCart());
    }

    // 4. Xóa một món hàng khỏi giỏ (ĐÃ SỬA)
    @Override
    @Transactional
    public CartDTO removeItemFromCart(Long cartItemId, Authentication authentication) throws AccessDeniedException {
        UserEntity user = getUserFromAuthentication(authentication);
        CartItemEntity item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));
        
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not own this cart item");
        }
        
        CartEntity cart = item.getCart(); // Lấy giỏ hàng cha
        cart.getItems().remove(item);
        
        return CartMapper.toCartDTO(cart);
    }

    // --- 4. THÊM HÀM MỚI CHO ADMIN ---
    @Override
    @Transactional(readOnly = true) // Chỉ đọc
    public List<AdminCartDTO> getAllCarts() {
        // Lấy TẤT CẢ giỏ hàng
        List<CartEntity> allCarts = cartRepository.findAll();
        
        // Chuyển đổi sang DTO
        return allCarts.stream()
                .map(AdminCartDTO::fromEntity)
                .collect(Collectors.toList());
    }
}