package com.campusexchange.campus_exchange.controller;

import com.campusexchange.campus_exchange.dto.CategoryDto;
import com.campusexchange.campus_exchange.dto.ReportResponseDto;
import com.campusexchange.campus_exchange.dto.UserDto;
import com.campusexchange.campus_exchange.service.CategoryService;
import com.campusexchange.campus_exchange.service.ReportService;
import com.campusexchange.campus_exchange.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final ReportService reportService;
    private final CategoryService categoryService;

    public AdminController(UserService userService, ReportService reportService, CategoryService categoryService) {
        this.userService = userService;
        this.reportService = reportService;
        this.categoryService = categoryService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id, @RequestParam Boolean isActive) {
        userService.toggleUserStatus(id, isActive);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User active status updated to: " + isActive);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        List<ReportResponseDto> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/pending")
    public ResponseEntity<List<ReportResponseDto>> getPendingReports() {
        List<ReportResponseDto> reports = reportService.getPendingReports();
        return ResponseEntity.ok(reports);
    }

    @PatchMapping("/reports/{id}/resolve")
    public ResponseEntity<?> resolveReport(@PathVariable Long id, @RequestParam String action) {
        reportService.resolveReport(id, action);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Report resolved successfully with action: " + action);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto categoryDto) {
        CategoryDto created = categoryService.createCategory(categoryDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDto categoryDto) {
        CategoryDto updated = categoryService.updateCategory(id, categoryDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Category deleted successfully");
        return ResponseEntity.ok(response);
    }
}
