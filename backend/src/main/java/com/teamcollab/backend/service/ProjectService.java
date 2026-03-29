package com.teamcollab.backend.service;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.User;

import java.util.List;

public interface ProjectService {

    Project createProject(Project project);

    List<Project> getMyProjects();

    List<Project> getAssignedProjects();

    Project getProjectById(Long id);

    Project updateProject(Long id, Project updatedProject);

    void deleteProject(Long id);

    void addMember(Long projectId, String email);

    void removeMember(Long projectId, String email);
}