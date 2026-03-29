package com.teamcollab.backend.repository;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.Task;
import com.teamcollab.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignedTo(User user);

    long countByStatus(String status);

    long countByProject(Project project);
}