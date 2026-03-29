package com.teamcollab.backend.controller;

import com.teamcollab.backend.dto.AddMemberRequest;
import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project savedProject = projectService.createProject(project);
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getMyProjects() {
        List<Project> projects = projectService.getMyProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<Project>> getAssignedProjects() {
        List<Project> projects = projectService.getAssignedProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        return ResponseEntity.ok(projectService.updateProject(id, project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Project deleted successfully");
    }

    @PostMapping("/add-member")
    public ResponseEntity<String> addMember(@RequestBody AddMemberRequest request) {
        projectService.addMember(
                request.getProjectId(),
                request.getEmail()
        );
        return ResponseEntity.ok("Member added successfully");
    }

    @PostMapping("/remove-member")
    public ResponseEntity<String> removeMember(@RequestBody AddMemberRequest request) {
        projectService.removeMember(
                request.getProjectId(),
                request.getEmail()
        );
        return ResponseEntity.ok("Member removed successfully");
    }
}