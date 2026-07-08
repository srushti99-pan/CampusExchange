package com.campusexchange.campus_exchange.repository;

import com.campusexchange.campus_exchange.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:college IS NULL OR LOWER(p.seller.college) LIKE LOWER(CONCAT('%', :college, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:status IS NULL OR p.status = :status)")
    Page<Product> searchProducts(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("college") String college,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("status") String status,
            Pageable pageable
    );

    List<Product> findBySellerId(Long sellerId);
}
