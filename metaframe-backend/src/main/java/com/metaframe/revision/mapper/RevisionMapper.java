// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.revision.mapper;

import com.metaframe.revision.dto.RevisionResponse;
import com.metaframe.revision.entity.RevisionEntity;
import org.springframework.stereotype.Component;

@Component
public class RevisionMapper {

    public RevisionResponse toResponse(RevisionEntity entity) {
        return new RevisionResponse(
            entity.revisionId(),
            entity.scopeType(),
            entity.scopeId(),
            entity.fileId(),
            entity.saveType(),
            entity.summary(),
            entity.schemaVersion(),
            entity.snapshot(),
            entity.parentRevisionId(),
            entity.createdBy(),
            entity.createdAt()
        );
    }
}
