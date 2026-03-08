// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.page.mapper;

import com.metaframe.page.dto.ManagedPageResponse;
import com.metaframe.page.entity.ManagedPageEntity;
import org.springframework.stereotype.Component;

@Component
public class PageMapper {

    public ManagedPageResponse toResponse(ManagedPageEntity entity) {
        return new ManagedPageResponse(
            entity.pageId(),
            entity.fileId(),
            entity.projectId(),
            entity.pageName(),
            entity.routePath(),
            entity.linkedLayoutId(),
            entity.canonicalSnapshotId(),
            entity.revisionHeadId(),
            entity.schemaVersion(),
            entity.editabilityState(),
            entity.exportState(),
            entity.snapshot(),
            entity.createdAt(),
            entity.updatedAt()
        );
    }
}
