// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.filetree.repository;

import com.metaframe.filetree.entity.FileNodeEntity;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FileTreeRepository {

    private final JdbcTemplate jdbcTemplate;

    public FileTreeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FileNodeEntity> findProjectFiles(UUID projectId) {
        return jdbcTemplate.query(
            """
                SELECT
                  file_id,
                  project_id,
                  parent_id,
                  name,
                  path,
                  node_type,
                  managed_type,
                  extension,
                  is_protected,
                  is_deleted,
                  node_order,
                  created_at,
                  updated_at
                FROM file_node
                WHERE project_id = ?
                ORDER BY path ASC, node_order ASC
                """,
            this::mapFileNode,
            projectId
        );
    }

    public void insertFileNodes(List<FileNodeEntity> files) {
        for (FileNodeEntity file : files) {
            jdbcTemplate.update(
                """
                    INSERT INTO file_node (
                      file_id,
                      project_id,
                      parent_id,
                      name,
                      path,
                      node_type,
                      managed_type,
                      extension,
                      is_protected,
                      is_deleted,
                      node_order,
                      created_at,
                      updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                file.fileId(),
                file.projectId(),
                file.parentId(),
                file.name(),
                file.path(),
                file.nodeType(),
                file.managedType(),
                file.extension(),
                file.isProtected(),
                file.isDeleted(),
                file.nodeOrder(),
                file.createdAt(),
                file.updatedAt()
            );
        }
    }

    private FileNodeEntity mapFileNode(ResultSet rs, int rowNum) throws SQLException {
        return new FileNodeEntity(
            rs.getObject("file_id", UUID.class),
            rs.getObject("project_id", UUID.class),
            rs.getObject("parent_id", UUID.class),
            rs.getString("name"),
            rs.getString("path"),
            rs.getString("node_type"),
            rs.getString("managed_type"),
            rs.getString("extension"),
            rs.getBoolean("is_protected"),
            rs.getBoolean("is_deleted"),
            rs.getInt("node_order"),
            rs.getObject("created_at", java.time.OffsetDateTime.class),
            rs.getObject("updated_at", java.time.OffsetDateTime.class)
        );
    }
}
