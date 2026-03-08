// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.collaboration.mapper;

import com.metaframe.collaboration.dto.PresenceResponse;
import com.metaframe.collaboration.entity.FilePresenceEntity;
import org.springframework.stereotype.Component;

@Component
public class CollaborationMapper {

    public PresenceResponse toResponse(FilePresenceEntity entity) {
        return new PresenceResponse(
            entity.presenceId(),
            entity.projectId(),
            entity.userId(),
            entity.fileId(),
            entity.pageId(),
            entity.layoutId(),
            entity.openMode(),
            entity.isViewing(),
            entity.isEditing(),
            entity.sessionId(),
            entity.lastHeartbeat()
        );
    }
}
