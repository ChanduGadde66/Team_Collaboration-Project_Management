package com.teamcollab.backend.dto;

public class AddMemberRequest {

    private Long projectId;
    private String email;

    public AddMemberRequest() {
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getEmail() {
        return email;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}