package com.teamcollab.backend.service;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.Task;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.repository.ProjectRepository;
import com.teamcollab.backend.repository.TaskRepository;
import com.teamcollab.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository,
                           ProjectRepository projectRepository,
                           UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Task createTask(Long projectId, Long userId, Task task) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setProject(project);
        task.setAssignedTo(user);
        task.setStatus("TODO");

        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByProject(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return taskRepository.findByProject(project);
    }

    @Override
    public List<Task> getTasksByUser() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository.findByAssignedTo(user);
    }

    @Override
    public Task updateStatus(Long taskId, String status) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String email = getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only assigned user can update task status");
        }

        task.setStatus(status);

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String email = getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAssignedUser = task.getAssignedTo() != null && 
                                 task.getAssignedTo().getId().equals(currentUser.getId());
        boolean isProjectOwner = task.getProject() != null && 
                                 task.getProject().getOwner() != null && 
                                 task.getProject().getOwner().getId().equals(currentUser.getId());

        if (isAssignedUser || isProjectOwner) {
            taskRepository.delete(task);
        } else {
            throw new RuntimeException("Not authorized to delete this task");
        }
    }

    private String getCurrentUserEmail() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String email = (String) auth.getPrincipal();
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("User email not found");
        }
        return email;
    }
}