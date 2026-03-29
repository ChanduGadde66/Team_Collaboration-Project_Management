package com.teamcollab.backend.service;

import com.teamcollab.backend.entity.Task;

import java.util.List;

public interface TaskService {

    Task createTask(Long projectId, Long userId, Task task);

    List<Task> getTasksByProject(Long projectId);

    List<Task> getTasksByUser();

    Task updateStatus(Long taskId, String status);

    void deleteTask(Long taskId);
}