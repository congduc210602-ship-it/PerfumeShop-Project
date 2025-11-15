package SpringJPA.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 
import org.springframework.data.jpa.repository.Query; 
import org.springframework.data.repository.query.Param; 

import SpringJPA.demo.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Tìm sản phẩm theo tên, không phân biệt hoa thường
    List<Product> findByNameContainingIgnoreCase(String keyword);
    
    // --- PHẦN ĐƯỢC SỬA ---
    // Phương thức cũ "List<Product> findByPriceBetween(Double minPrice, Double maxPrice);" đã bị HỎNG.
    // Chúng ta thay thế nó bằng @Query để tìm trong các biến thể (variants).
    
    /**
     * Tìm các sản phẩm có ít nhất MỘT biến thể (variant)
     * có giá nằm trong khoảng [minPrice, maxPrice]
     */
    @Query("SELECT DISTINCT p FROM Product p JOIN p.variants v " +
           "WHERE v.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceBetween(
        @Param("minPrice") Double minPrice, 
        @Param("maxPrice") Double maxPrice
    );
    // --- HẾT PHẦN SỬA ---

    // 3️Tìm sản phẩm theo danh mục (Vẫn OK)
    List<Product> findByCategoryId(Long categoryId);

    // (Vẫn OK)
    List<Product> findTop4ByCategoryIdAndIdNot(Long categoryId, Integer productId);

    // (Vẫn OK vì tìm theo 'name')
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Product> searchByNameContaining(
        @Param("query") String query, 
        Pageable pageable
    );
}
// package SpringJPA.demo.repository;

// import java.util.List;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.domain.Page; // <-- Import Page
// import org.springframework.data.domain.Pageable; // <-- Import Pageable
// import org.springframework.data.jpa.repository.Query; // <-- Import Query
// import org.springframework.data.repository.query.Param; // <-- Import Param

// import SpringJPA.demo.entity.Product;

// public interface ProductRepository extends JpaRepository<Product, Integer> {
//     // Tìm sản phẩm theo tên, không phân biệt hoa thường
//     List<Product> findByNameContainingIgnoreCase(String keyword);
    
//     // 2️Tìm sản phẩm theo khoảng giá
//     List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

//     // 3️Tìm sản phẩm theo danh mục
//     List<Product> findByCategoryId(Long categoryId);

//     List<Product> findTop4ByCategoryIdAndIdNot(Long categoryId, Integer productId);

//     @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
//     Page<Product> searchByNameContaining(
//         @Param("query") String query, 
//         Pageable pageable
//     );
// }