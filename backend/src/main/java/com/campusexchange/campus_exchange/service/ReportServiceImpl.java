package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.ReportRequestDto;
import com.campusexchange.campus_exchange.dto.ReportResponseDto;
import com.campusexchange.campus_exchange.entity.Product;
import com.campusexchange.campus_exchange.entity.ProductReport;
import com.campusexchange.campus_exchange.entity.User;
import com.campusexchange.campus_exchange.exception.BadRequestException;
import com.campusexchange.campus_exchange.exception.ResourceNotFoundException;
import com.campusexchange.campus_exchange.repository.ProductReportRepository;
import com.campusexchange.campus_exchange.repository.ProductRepository;
import com.campusexchange.campus_exchange.repository.UserRepository;
import com.campusexchange.campus_exchange.utils.DtoConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final ProductReportRepository reportRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ReportServiceImpl(ProductReportRepository reportRepository, ProductRepository productRepository, UserRepository userRepository, NotificationService notificationService) {
        this.reportRepository = reportRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public ReportResponseDto reportProduct(String reporterEmail, Long productId, ReportRequestDto reportRequest) {
        User reporter = userRepository.findByEmail(reporterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + reporterEmail));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        ProductReport report = ProductReport.builder()
                .reporter(reporter)
                .product(product)
                .reason(reportRequest.getReason())
                .details(reportRequest.getDetails())
                .status("PENDING")
                .build();

        ProductReport saved = reportRepository.save(report);
        return DtoConverter.convertToReportResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponseDto> getAllReports() {
        return reportRepository.findAll().stream()
                .map(DtoConverter::convertToReportResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponseDto> getPendingReports() {
        return reportRepository.findByStatus("PENDING").stream()
                .map(DtoConverter::convertToReportResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void resolveReport(Long reportId, String action) {
        ProductReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        if (!report.getStatus().equals("PENDING")) {
            throw new BadRequestException("Report is already resolved.");
        }

        Product product = report.getProduct();

        if ("DELETE_PRODUCT".equalsIgnoreCase(action)) {
            // Notify seller
            notificationService.createNotification(product.getSeller().getId(),
                    "Your listing '" + product.getTitle() + "' has been removed by an administrator due to reports: " + report.getReason());

            // Delete the listing (related reports and wishlists will cascade or delete)
            productRepository.delete(product);
            
            report.setStatus("RESOLVED");
            reportRepository.save(report);
        } else if ("DISMISS".equalsIgnoreCase(action)) {
            report.setStatus("RESOLVED");
            reportRepository.save(report);
        } else {
            throw new BadRequestException("Invalid action: " + action + ". Must be DISMISS or DELETE_PRODUCT");
        }
    }
}
