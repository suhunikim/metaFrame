// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.common.audit;

import com.metaframe.common.util.JsonSupport;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AuditRepository {

    private final JdbcTemplate jdbcTemplate;
    private final JsonSupport jsonSupport;

    public AuditRepository(JdbcTemplate jdbcTemplate, JsonSupport jsonSupport) {
        this.jdbcTemplate = jdbcTemplate;
        this.jsonSupport = jsonSupport;
    }

    public void insertActivity(ActivityLogEntity activity) {
        jdbcTemplate.update(
            """
                INSERT INTO activity_log (
                  activity_id,
                  project_id,
                  actor_user_id,
                  action_type,
                  target_type,
                  target_id,
                  payload,
                  created_at
                ) VALUES (?, ?, ?, ?, ?, ?, CAST(? AS jsonb), ?)
                """,
            activity.activityId(),
            activity.projectId(),
            activity.actorUserId(),
            activity.actionType(),
            activity.targetType(),
            activity.targetId(),
            jsonSupport.write(activity.payload()),
            activity.createdAt()
        );
    }
}
