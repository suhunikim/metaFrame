// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.repository;

import com.metaframe.project.entity.ProjectEntity;
import com.metaframe.project.entity.ProjectMemberEntity;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectRepository {

    private static final String PROJECT_SELECT = """
        SELECT
          p.project_id,
          p.project_name,
          p.project_description,
          p.template_type,
          p.schema_version,
          p.version_preset,
          p.react_version,
          p.vite_version,
          p.layout_preset,
          p.collaboration_mode,
          p.autosave_enabled,
          p.owner_user_id,
          p.owner_email,
          p.is_deleted,
          p.deleted_at,
          p.deleted_by,
          pm.role AS current_user_role,
          prv.last_opened_at,
          p.created_at,
          p.updated_at,
          (
            SELECT COUNT(*)
            FROM managed_page mp
            WHERE mp.project_id = p.project_id
          ) AS page_count,
          (
            SELECT COUNT(*)
            FROM managed_layout ml
            WHERE ml.project_id = p.project_id
          ) AS layout_count
        FROM project p
        JOIN project_member pm
          ON pm.project_id = p.project_id
         AND pm.user_id = ?
         AND pm.is_active = TRUE
        LEFT JOIN project_recent_visit prv
          ON prv.project_id = p.project_id
         AND prv.user_id = ?
        """;

    private final JdbcTemplate jdbcTemplate;

    public ProjectRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ProjectEntity> findAllProjectSummaries(String userId, String deletedMode, String query, String sort) {
        List<Object> params = new ArrayList<>();
        params.add(userId);
        params.add(userId);

        StringBuilder sql = new StringBuilder(PROJECT_SELECT).append(" WHERE 1=1");
        if ("deleted".equalsIgnoreCase(deletedMode)) {
            sql.append(" AND p.is_deleted = TRUE");
        } else if (!"all".equalsIgnoreCase(deletedMode)) {
            sql.append(" AND p.is_deleted = FALSE");
        }

        if (query != null && !query.isBlank()) {
            sql.append(" AND (LOWER(p.project_name) LIKE ? OR LOWER(COALESCE(p.project_description, '')) LIKE ?)");
            String like = "%" + query.trim().toLowerCase() + "%";
            params.add(like);
            params.add(like);
        }

        sql.append(" ORDER BY ").append(resolveSort(sort));
        return jdbcTemplate.query(sql.toString(), this::mapProjectEntity, params.toArray());
    }

    public Optional<ProjectEntity> findProjectSummary(UUID projectId, String userId) {
        List<ProjectEntity> rows = jdbcTemplate.query(
            PROJECT_SELECT + " WHERE p.project_id = ?",
            this::mapProjectEntity,
            userId,
            userId,
            projectId
        );
        return rows.stream().findFirst();
    }

    public void insertProject(ProjectEntity project) {
        jdbcTemplate.update(
            """
                INSERT INTO project (
                  project_id,
                  project_name,
                  project_description,
                  template_type,
                  schema_version,
                  version_preset,
                  react_version,
                  vite_version,
                  layout_preset,
                  collaboration_mode,
                  autosave_enabled,
                  owner_user_id,
                  owner_email,
                  is_deleted,
                  deleted_at,
                  deleted_by,
                  created_at,
                  updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
            project.projectId(),
            project.projectName(),
            project.projectDescription(),
            project.templateType(),
            project.schemaVersion(),
            project.versionPreset(),
            project.reactVersion(),
            project.viteVersion(),
            project.layoutPreset(),
            project.collaborationMode(),
            project.autosaveEnabled(),
            project.ownerUserId(),
            project.ownerEmail(),
            project.isDeleted(),
            project.deletedAt(),
            project.deletedBy(),
            project.createdAt(),
            project.updatedAt()
        );
    }

    public void insertProjectMember(ProjectMemberEntity member) {
        jdbcTemplate.update(
            """
                INSERT INTO project_member (
                  project_id,
                  user_id,
                  role,
                  status,
                  joined_at,
                  invited_by,
                  is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
            member.projectId(),
            member.userId(),
            member.role(),
            member.status(),
            member.joinedAt(),
            member.invitedBy(),
            member.isActive()
        );
    }

    public void touchProject(UUID projectId, OffsetDateTime updatedAt) {
        jdbcTemplate.update(
            "UPDATE project SET updated_at = ? WHERE project_id = ?",
            updatedAt,
            projectId
        );
    }

    public void markProjectOpened(UUID projectId, String userId, OffsetDateTime openedAt) {
        jdbcTemplate.update(
            """
                INSERT INTO project_recent_visit (
                  project_id,
                  user_id,
                  last_opened_at
                ) VALUES (?, ?, ?)
                ON CONFLICT (project_id, user_id)
                DO UPDATE SET last_opened_at = EXCLUDED.last_opened_at
                """,
            projectId,
            userId,
            openedAt
        );
    }

    public void softDeleteProject(UUID projectId, String deletedBy, OffsetDateTime deletedAt) {
        jdbcTemplate.update(
            """
                UPDATE project
                SET is_deleted = TRUE,
                    deleted_at = ?,
                    deleted_by = ?,
                    updated_at = ?
                WHERE project_id = ?
                """,
            deletedAt,
            deletedBy,
            deletedAt,
            projectId
        );
    }

    public void restoreProject(UUID projectId, OffsetDateTime restoredAt) {
        jdbcTemplate.update(
            """
                UPDATE project
                SET is_deleted = FALSE,
                    deleted_at = NULL,
                    deleted_by = NULL,
                    updated_at = ?
                WHERE project_id = ?
                """,
            restoredAt,
            projectId
        );
    }

    private String resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return "p.updated_at DESC";
        }

        return switch (sort) {
            case "name_asc" -> "p.project_name ASC";
            case "created_desc" -> "p.created_at DESC";
            case "updated_asc" -> "p.updated_at ASC";
            case "recent_opened" -> "prv.last_opened_at DESC NULLS LAST, p.updated_at DESC";
            default -> "p.updated_at DESC";
        };
    }

    private ProjectEntity mapProjectEntity(ResultSet rs, int rowNum) throws SQLException {
        return new ProjectEntity(
            rs.getObject("project_id", UUID.class),
            rs.getString("project_name"),
            rs.getString("project_description"),
            rs.getString("template_type"),
            rs.getString("schema_version"),
            rs.getString("version_preset"),
            rs.getString("react_version"),
            rs.getString("vite_version"),
            rs.getString("layout_preset"),
            rs.getString("collaboration_mode"),
            rs.getBoolean("autosave_enabled"),
            rs.getString("owner_user_id"),
            rs.getString("owner_email"),
            rs.getBoolean("is_deleted"),
            rs.getObject("deleted_at", OffsetDateTime.class),
            rs.getString("deleted_by"),
            rs.getString("current_user_role"),
            rs.getObject("last_opened_at", OffsetDateTime.class),
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class),
            rs.getLong("page_count"),
            rs.getLong("layout_count")
        );
    }
}
