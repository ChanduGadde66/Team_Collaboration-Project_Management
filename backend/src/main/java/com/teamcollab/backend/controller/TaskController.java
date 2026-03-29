package com.teamcollab.backend.controller;

import com.teamcollab.backend.entity.Task;
import com.teamcollab.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestParam Long projectId,
            @RequestParam Long userId,
            @RequestBody Task task
    ) {
        Task savedTask = taskService.createTask(projectId, userId, task);
        return ResponseEntity.ok(savedTask);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Task>> getTasksByUser() {
        return ResponseEntity.ok(taskService.getTasksByUser());
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateStatus(
            @PathVariable Long taskId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(taskService.updateStatus(taskId, status));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Task deleted successfully");
    }
}