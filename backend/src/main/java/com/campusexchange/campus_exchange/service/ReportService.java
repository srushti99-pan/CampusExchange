package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.ReportRequestDto;
import com.campusexchange.campus_exchange.dto.ReportResponseDto;

import java.util.List;

public interface ReportService {
    ReportResponseDto reportProduct(String reporterEmail, Long productId, ReportRequestDto reportRequest);
    List<ReportResponseDto> getAllReports();
    List<ReportResponseDto> getPendingReports();
    void resolveReport(Long reportId, String action);
}
