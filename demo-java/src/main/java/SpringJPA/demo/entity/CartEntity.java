package SpringJPA.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "cart")
public class CartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết một-một với User. 
    // Khi xóa User, giỏ hàng cũng bị xóa (nhưng thường ta không xóa user)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    // Một giỏ hàng có nhiều món hàng
    // cascade = CascadeType.ALL: Khi xóa giỏ hàng, các món hàng bên trong cũng bị xóa
    // orphanRemoval = true: Khi xóa một món hàng (item) khỏi list 'items', 
    //                      nó cũng sẽ bị xóa khỏi database.
    @OneToMany(
        mappedBy = "cart", 
        cascade = CascadeType.ALL, 
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<CartItemEntity> items = new ArrayList<>();

    // Constructor tiện lợi
    public CartEntity(UserEntity user) {
        this.user = user;
    }
    
    // Helper methods để thêm và xóa item (đồng bộ 2 chiều)
    public void addItem(CartItemEntity item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItemEntity item) {
        items.remove(item);
        item.setCart(null);
    }
}