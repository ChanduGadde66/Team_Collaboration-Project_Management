package com.teamcollab.backend.service;

import com.teamcollab.backend.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard();

    DashboardResponse getUserDashboard();
}