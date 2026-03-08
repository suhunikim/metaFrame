// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.service;

import com.metaframe.common.audit.ActivityLogEntity;
import com.metaframe.filetree.entity.FileNodeEntity;
import com.metaframe.page.entity.CanonicalSnapshotEntity;
import com.metaframe.page.entity.ManagedLayoutEntity;
import com.metaframe.page.entity.ManagedPageEntity;
import com.metaframe.page.entity.RouterEntryEntity;
import com.metaframe.project.entity.ProjectEntity;
import com.metaframe.project.entity.ProjectMemberEntity;
import com.metaframe.revision.entity.RevisionEntity;
import java.util.List;

public record ProjectBootstrapBundle(
    ProjectEntity project,
    ProjectMemberEntity ownerMember,
    List<FileNodeEntity> files,
    List<CanonicalSnapshotEntity> snapshots,
    ManagedLayoutEntity layout,
    ManagedPageEntity page,
    RouterEntryEntity routerEntry,
    List<RevisionEntity> revisions,
    ActivityLogEntity initialActivity
) {
}
