package com.campusexchange.campus_exchange.controller;

import com.campusexchange.campus_exchange.dto.ProductRequestDto;
import com.campusexchange.campus_exchange.dto.ProductResponseDto;
import com.campusexchange.campus_exchange.dto.ReportRequestDto;
import com.campusexchange.campus_exchange.dto.ReportResponseDto;
import com.campusexchange.campus_exchange.service.ProductService;
import com.campusexchange.campus_exchange.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final ReportService reportService;

    public ProductController(ProductService productService, ReportService reportService) {
        this.productService = productService;
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponseDto>> searchProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Page<ProductResponseDto> products = productService.searchProducts(
                search, categoryId, college, minPrice, maxPrice, status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        ProductResponseDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDto> createProduct(
            @RequestPart("product") @Valid ProductRequestDto productRequestDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Principal principal
    ) {
        ProductResponseDto created = productService.createProduct(principal.getName(), productRequestDto, images);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto productRequestDto,
            Principal principal
    ) {
        ProductResponseDto updated = productService.updateProduct(principal.getName(), id, productRequestDto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/sold")
    public ResponseEntity<ProductResponseDto> markAsSold(@PathVariable Long id, Principal principal) {
        ProductResponseDto updated = productService.markAsSold(principal.getName(), id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Principal principal) {
        productService.deleteProduct(principal.getName(), id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product listing deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<ReportResponseDto> reportProduct(
            @PathVariable Long id,
            @Valid @RequestBody ReportRequestDto reportRequestDto,
            Principal principal
    ) {
        ReportResponseDto report = reportService.reportProduct(principal.getName(), id, reportRequestDto);
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }
}
