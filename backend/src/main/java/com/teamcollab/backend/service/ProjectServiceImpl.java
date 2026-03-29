package com.teamcollab.backend.service;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.repository.ProjectRepository;
import com.teamcollab.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Project createProject(Project project) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String email = (String) auth.getPrincipal();
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("User email not found");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        project.setOwner(user);

        return projectRepository.save(project);
    }

    @Override
    public List<Project> getMyProjects() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String email = (String) auth.getPrincipal();
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("User email not found");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return projectRepository.findByOwner(user);
    }

    @Override
    public List<Project> getAssignedProjects() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String email = (String) auth.getPrincipal();
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("User email not found");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return projectRepository.findByMembersContaining(user);
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public Project updateProject(Long id, Project updatedProject) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        existing.setName(updatedProject.getName());
        existing.setDescription(updatedProject.getDescription());

        return projectRepository.save(existing);
    }

    @Override
    public void deleteProject(Long id) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(existing);
    }

    @Override
    public void addMember(Long projectId, String email) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (project.getMembers() == null) {
            project.setMembers(new java.util.ArrayList<>());
        }

        if (!project.getMembers().contains(user)) {
            project.getMembers().add(user);
        }

        projectRepository.save(project);
    }

    @Override
    public void removeMember(Long projectId, String email) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (project.getMembers() != null) {
            project.getMembers().removeIf(member -> member.getId().equals(user.getId()));
            projectRepository.save(project);
        }
    }
}