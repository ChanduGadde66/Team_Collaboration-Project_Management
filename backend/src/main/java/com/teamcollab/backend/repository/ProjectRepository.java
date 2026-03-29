package com.teamcollab.backend.repository;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwner(User user);

    List<Project> findByMembersContaining(User member);
}