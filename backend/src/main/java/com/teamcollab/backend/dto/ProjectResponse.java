package com.teamcollab.backend.dto;

import com.teamcollab.backend.entity.Project;
import com.teamcollab.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private UserDTO owner;
    private List<UserDTO> members;

    public static ProjectResponse fromProject(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .owner(UserDTO.fromUser(project.getOwner()))
                .members(project.getMembers().stream()
                        .map(UserDTO::fromUser)
                        .collect(Collectors.toList()))
                .build();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;

        public static UserDTO fromUser(User user) {
            return UserDTO.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .build();
        }
    }
}
