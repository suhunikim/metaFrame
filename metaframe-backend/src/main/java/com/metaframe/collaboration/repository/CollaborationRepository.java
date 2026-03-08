// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.collaboration.repository;

import com.metaframe.collaboration.entity.FilePresenceEntity;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CollaborationRepository {

    private final JdbcTemplate jdbcTemplate;

    public CollaborationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FilePresenceEntity> findProjectPresence(UUID projectId) {
        return jdbcTemplate.query(
            """
                SELECT
                  presence_id,
                  project_id,
                  user_id,
                  file_id,
                  page_id,
                  layout_id,
                  open_mode,
                  is_viewing,
                  is_editing,
                  session_id,
                  last_heartbeat
                FROM file_presence
                WHERE project_id = ?
                ORDER BY last_heartbeat DESC
                """,
            this::mapPresence,
            projectId
        );
    }

    public Optional<UUID> findPresenceId(UUID projectId, UUID fileId, String userId, String sessionId) {
        List<UUID> rows = jdbcTemplate.query(
            """
                SELECT presence_id
                FROM file_presence
                WHERE project_id = ?
                  AND file_id = ?
                  AND user_id = ?
                  AND session_id = ?
                """,
            (rs, rowNum) -> rs.getObject("presence_id", UUID.class),
            projectId,
            fileId,
            userId,
            sessionId
        );
        return rows.stream().findFirst();
    }

    public void insertPresence(FilePresenceEntity presence) {
        jdbcTemplate.update(
            """
                INSERT INTO file_presence (
                  presence_id,
                  project_id,
                  user_id,
                  file_id,
                  page_id,
                  layout_id,
                  open_mode,
                  is_viewing,
                  is_editing,
                  session_id,
                  last_heartbeat
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
            presence.presenceId(),
            presence.projectId(),
            presence.userId(),
            presence.fileId(),
            presence.pageId(),
            presence.layoutId(),
            presence.openMode(),
            presence.isViewing(),
            presence.isEditing(),
            presence.sessionId(),
            presence.lastHeartbeat()
        );
    }

    public void updatePresence(FilePresenceEntity presence) {
        jdbcTemplate.update(
            """
                UPDATE file_presence
                SET
                  page_id = ?,
                  layout_id = ?,
                  open_mode = ?,
                  is_viewing = ?,
                  is_editing = ?,
                  last_heartbeat = ?
                WHERE presence_id = ?
                """,
            presence.pageId(),
            presence.layoutId(),
            presence.openMode(),
            presence.isViewing(),
            presence.isEditing(),
            presence.lastHeartbeat(),
            presence.presenceId()
        );
    }

    private FilePresenceEntity mapPresence(ResultSet rs, int rowNum) throws SQLException {
        return new FilePresenceEntity(
            rs.getObject("presence_id", UUID.class),
            rs.getObject("project_id", UUID.class),
            rs.getString("user_id"),
            rs.getObject("file_id", UUID.class),
            rs.getObject("page_id", UUID.class),
            rs.getObject("layout_id", UUID.class),
            rs.getString("open_mode"),
            rs.getBoolean("is_viewing"),
            rs.getBoolean("is_editing"),
            rs.getString("session_id"),
            rs.getObject("last_heartbeat", OffsetDateTime.class)
        );
    }
}
