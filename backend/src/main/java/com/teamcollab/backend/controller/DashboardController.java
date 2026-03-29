package com.teamcollab.backend.controller;

import com.teamcollab.backend.dto.DashboardResponse;
import com.teamcollab.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboard());
    }

    @GetMapping("/user")
    public ResponseEntity<DashboardResponse> getUserDashboard() {
        return ResponseEntity.ok(dashboardService.getUserDashboard());
    }
}