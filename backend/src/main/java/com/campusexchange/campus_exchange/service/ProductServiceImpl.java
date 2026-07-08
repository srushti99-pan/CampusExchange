package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.ProductRequestDto;
import com.campusexchange.campus_exchange.dto.ProductResponseDto;
import com.campusexchange.campus_exchange.entity.Category;
import com.campusexchange.campus_exchange.entity.Product;
import com.campusexchange.campus_exchange.entity.ProductImage;
import com.campusexchange.campus_exchange.entity.User;
import com.campusexchange.campus_exchange.exception.ResourceNotFoundException;
import com.campusexchange.campus_exchange.exception.UnauthorizedException;
import com.campusexchange.campus_exchange.repository.CategoryRepository;
import com.campusexchange.campus_exchange.repository.ProductRepository;
import com.campusexchange.campus_exchange.repository.UserRepository;
import com.campusexchange.campus_exchange.utils.DtoConverter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    public ProductServiceImpl(ProductRepository productRepository, UserRepository userRepository, CategoryRepository categoryRepository, FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public ProductResponseDto createProduct(String email, ProductRequestDto productRequestDto, List<MultipartFile> images) {
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Category category = categoryRepository.findById(productRequestDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productRequestDto.getCategoryId()));

        Product product = Product.builder()
                .seller(seller)
                .title(productRequestDto.getTitle())
                .description(productRequestDto.getDescription())
                .price(productRequestDto.getPrice())
                .itemCondition(productRequestDto.getItemCondition())
                .category(category)
                .status("AVAILABLE")
                .phoneNumber(productRequestDto.getPhoneNumber())
                .images(new ArrayList<>())
                .build();

        // Process images
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    String relativeUrl = fileStorageService.storeFile(file);
                    ProductImage productImage = ProductImage.builder()
                            .product(product)
                            .imageUrl(relativeUrl)
                            .build();
                    product.getImages().add(productImage);
                }
            }
        }

        Product savedProduct = productRepository.save(product);
        return DtoConverter.convertToProductResponseDto(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponseDto updateProduct(String email, Long productId, ProductRequestDto productRequestDto) {
        Product product = getProductEntity(productId);
        checkOwnership(email, product);

        Category category = categoryRepository.findById(productRequestDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productRequestDto.getCategoryId()));

        product.setTitle(productRequestDto.getTitle());
        product.setDescription(productRequestDto.getDescription());
        product.setPrice(productRequestDto.getPrice());
        product.setItemCondition(productRequestDto.getItemCondition());
        product.setCategory(category);
        product.setPhoneNumber(productRequestDto.getPhoneNumber());

        Product updatedProduct = productRepository.save(product);
        return DtoConverter.convertToProductResponseDto(updatedProduct);
    }

    @Override
    @Transactional
    public ProductResponseDto markAsSold(String email, Long productId) {
        Product product = getProductEntity(productId);
        checkOwnership(email, product);

        product.setStatus("SOLD");
        Product updatedProduct = productRepository.save(product);
        return DtoConverter.convertToProductResponseDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(String email, Long productId) {
        Product product = getProductEntity(productId);
        checkOwnership(email, product);
        productRepository.delete(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long productId) {
        Product product = getProductEntity(productId);
        return DtoConverter.convertToProductResponseDto(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> searchProducts(String search, Long categoryId, String college, Double minPrice, Double maxPrice, String status, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String searchQuery = (search == null || search.trim().isEmpty()) ? null : search.trim();
        String collegeQuery = (college == null || college.trim().isEmpty()) ? null : college.trim();
        String statusQuery = (status == null || status.trim().isEmpty()) ? null : status.trim();

        Page<Product> productPage = productRepository.searchProducts(searchQuery, categoryId, collegeQuery, minPrice, maxPrice, statusQuery, pageable);
        return productPage.map(DtoConverter::convertToProductResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getSellerProducts(Long sellerId) {
        return productRepository.findBySellerId(sellerId).stream()
                .map(DtoConverter::convertToProductResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getMyProducts(String email) {
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return getSellerProducts(seller.getId());
    }

    @Override
    @Transactional
    public void adminDeleteProduct(Long productId) {
        Product product = getProductEntity(productId);
        productRepository.delete(product);
    }

    private Product getProductEntity(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    private void checkOwnership(String email, Product product) {
        if (!product.getSeller().getEmail().equals(email)) {
            throw new UnauthorizedException("You do not have permission to modify this product!");
        }
    }
}
