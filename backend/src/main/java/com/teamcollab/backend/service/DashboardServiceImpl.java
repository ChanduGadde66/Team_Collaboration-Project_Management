package com.teamcollab.backend.service;

import com.teamcollab.backend.dto.DashboardResponse;
import com.teamcollab.backend.entity.Task;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.repository.ProjectRepository;
import com.teamcollab.backend.repository.TaskRepository;
import com.teamcollab.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(ProjectRepository projectRepository,
                                TaskRepository taskRepository,
                                UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DashboardResponse getDashboard() {

        long totalProjects = projectRepository.count();
        long totalTasks = taskRepository.count();
        long completed = taskRepository.countByStatus("COMPLETED");
        long inProgress = taskRepository.countByStatus("IN_PROGRESS");
        long todo = taskRepository.countByStatus("TODO");

        return new DashboardResponse(
                totalProjects,
                totalTasks,
                completed,
                inProgress,
                todo
        );
    }

    @Override
    public DashboardResponse getUserDashboard() {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String email = (String) auth.getPrincipal();
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("User email not found");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found in database"));

        long totalProjects = projectRepository.findByOwner(user).size();
        long assignedProjects = projectRepository.findByMembersContaining(user).size();
        
        List<Task> userTasks = taskRepository.findByAssignedTo(user);
        long totalTasks = userTasks.size();
        long completed = userTasks.stream()
                .filter(t -> t.getStatus() != null && "COMPLETED".equals(t.getStatus()))
                .count();
        long inProgress = userTasks.stream()
                .filter(t -> t.getStatus() != null && "IN_PROGRESS".equals(t.getStatus()))
                .count();
        long todo = userTasks.stream()
                .filter(t -> t.getStatus() != null && "TODO".equals(t.getStatus()))
                .count();

        return new DashboardResponse(
                totalProjects + assignedProjects,
                totalTasks,
                completed,
                inProgress,
                todo
        );
    }
}