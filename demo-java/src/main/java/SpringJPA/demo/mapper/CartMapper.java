package SpringJPA.demo.mapper;

import SpringJPA.demo.dto.CartDTO;
import SpringJPA.demo.dto.CartItemDTO;
import SpringJPA.demo.entity.CartEntity;
import SpringJPA.demo.entity.CartItemEntity;
import SpringJPA.demo.entity.Product;
import SpringJPA.demo.entity.ProductVariant;

import java.util.List;
import java.util.stream.Collectors;

public class CartMapper {

    public static CartDTO toCartDTO(CartEntity cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(CartMapper::toCartItemDTO)
                .collect(Collectors.toList());

        double totalPrice = itemDTOs.stream()
                .mapToDouble(CartItemDTO::getLinePrice)
                .sum();
        
        int totalItems = itemDTOs.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        return CartDTO.builder()
                .cartId(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemDTOs)
                .totalPrice(totalPrice)
                .totalItems(totalItems)
                .build();
    }

    public static CartItemDTO toCartItemDTO(CartItemEntity item) {
        ProductVariant variant = item.getProductVariant();
        Product product = variant.getProduct(); // Lấy product cha từ variant

        return CartItemDTO.builder()
                .cartItemId(item.getId())
                .productVariantId(variant.getId())
                .productName(product.getName()) // Lấy tên từ product cha
                .productImageUrl(product.getImageUrl()) // Lấy ảnh từ product cha
                .dungTich(variant.getDungTich())
                .price(variant.getPrice())
                .quantity(item.getQuantity())
                .linePrice(variant.getPrice() * item.getQuantity())
                .build();
    }
}