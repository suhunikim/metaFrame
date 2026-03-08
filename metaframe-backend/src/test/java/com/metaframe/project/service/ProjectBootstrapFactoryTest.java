// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.metaframe.common.util.JsonSupport;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ProjectBootstrapFactoryTest {

    private final ProjectBootstrapFactory factory = new ProjectBootstrapFactory(new JsonSupport(new ObjectMapper()));

    @Test
    void buildCreatesManagedPageAndLayoutBootstrapState() {
        ProjectBootstrapBundle bundle = factory.build(
            UUID.randomUUID(),
            "metaframe-demo",
            "MetaFrame demo project",
            "stable-recommended",
            "1.0.0",
            "stable",
            "19.2.0",
            "7.2.4",
            "main-layout",
            "bootstrap-admin",
            "admin@metaframe.local",
            OffsetDateTime.now()
        );

        assertThat(bundle.files()).extracting(file -> file.managedType()).contains("page", "layout", "system");
        assertThat(bundle.snapshots()).hasSize(2);
        assertThat(bundle.page().snapshot().get("rootNodeId").asText()).isEqualTo("page-root");
        assertThat(bundle.layout().revisionHeadId()).isNotNull();
        assertThat(bundle.revisions()).hasSize(2);
    }
}
