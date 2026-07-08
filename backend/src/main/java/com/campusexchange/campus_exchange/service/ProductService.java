package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.ProductRequestDto;
import com.campusexchange.campus_exchange.dto.ProductResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductResponseDto createProduct(String email, ProductRequestDto productRequestDto, List<MultipartFile> images);
    ProductResponseDto updateProduct(String email, Long productId, ProductRequestDto productRequestDto);
    ProductResponseDto markAsSold(String email, Long productId);
    void deleteProduct(String email, Long productId);
    ProductResponseDto getProductById(Long productId);
    Page<ProductResponseDto> searchProducts(String search, Long categoryId, String college, Double minPrice, Double maxPrice, String status, int page, int size, String sortBy, String sortDir);
    List<ProductResponseDto> getSellerProducts(Long sellerId);
    List<ProductResponseDto> getMyProducts(String email);
    void adminDeleteProduct(Long productId);
}
