// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.repository;

import com.metaframe.auth.entity.OrganizationProfileEntity;
import com.metaframe.auth.entity.UserEntity;
import com.metaframe.auth.entity.UserSessionEntity;
import com.metaframe.common.auth.AuthenticatedUser;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AuthRepository {

    private static final String USER_SELECT = """
        SELECT
          user_id,
          email,
          display_name,
          password_hash,
          global_role,
          account_status,
          extra_identifier,
          theme_preference,
          ui_font_size,
          autosave_interval,
          approved_at,
          approved_by,
          last_login_at,
          created_at,
          updated_at
        FROM metaframe_user
        """;

    private final JdbcTemplate jdbcTemplate;

    public AuthRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean hasInitializedAdmin() {
        Integer count = jdbcTemplate.queryForObject(
            """
                SELECT COUNT(*)
                FROM metaframe_user
                WHERE global_role IN ('owner', 'admin')
                  AND account_status = 'active'
                """,
            Integer.class
        );

        return count != null && count > 0;
    }

    public Optional<OrganizationProfileEntity> findOrganizationProfile() {
        List<OrganizationProfileEntity> rows = jdbcTemplate.query(
            """
                SELECT
                  organization_id,
                  organization_name,
                  bootstrap_completed,
                  self_signup_enabled,
                  signup_mode,
                  created_by,
                  created_at,
                  updated_at
                FROM organization_profile
                ORDER BY created_at ASC
                LIMIT 1
                """,
            this::mapOrganization
        );

        return rows.stream().findFirst();
    }

    public Optional<UserEntity> findUserByEmail(String email) {
        return findSingleUserBy("email", email);
    }

    public Optional<UserEntity> findUserById(String userId) {
        return findSingleUserBy("user_id", userId);
    }

    public void insertUser(UserEntity user) {
        jdbcTemplate.update(
            """
                INSERT INTO metaframe_user (
                  user_id,
                  email,
                  display_name,
                  password_hash,
                  global_role,
                  account_status,
                  extra_identifier,
                  theme_preference,
                  ui_font_size,
                  autosave_interval,
                  approved_at,
                  approved_by,
                  last_login_at,
                  created_at,
                  updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
            user.userId(),
            user.email(),
            user.displayName(),
            user.passwordHash(),
            user.globalRole(),
            user.accountStatus(),
            user.extraIdentifier(),
            user.themePreference(),
            user.uiFontSize(),
            user.autosaveInterval(),
            user.approvedAt(),
            user.approvedBy(),
            user.lastLoginAt(),
            user.createdAt(),
            user.updatedAt()
        );
    }

    public void insertOrganizationProfile(OrganizationProfileEntity organization) {
        jdbcTemplate.update(
            """
                INSERT INTO organization_profile (
                  organization_id,
                  organization_name,
                  bootstrap_completed,
                  self_signup_enabled,
                  signup_mode,
                  created_by,
                  created_at,
                  updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
            organization.organizationId(),
            organization.organizationName(),
            organization.bootstrapCompleted(),
            organization.selfSignupEnabled(),
            organization.signupMode(),
            organization.createdBy(),
            organization.createdAt(),
            organization.updatedAt()
        );
    }

    public void insertSession(UserSessionEntity session) {
        jdbcTemplate.update(
            """
                INSERT INTO auth_session (
                  session_id,
                  user_id,
                  session_token_hash,
                  expires_at,
                  last_accessed_at,
                  created_at,
                  revoked_at,
                  user_agent,
                  client_ip
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
            session.sessionId(),
            session.userId(),
            session.sessionTokenHash(),
            session.expiresAt(),
            session.lastAccessedAt(),
            session.createdAt(),
            session.revokedAt(),
            session.userAgent(),
            session.clientIp()
        );
    }

    public Optional<AuthenticatedUser> findAuthenticatedSession(String tokenHash, OffsetDateTime now) {
        List<AuthenticatedUser> rows = jdbcTemplate.query(
            """
                SELECT
                  u.user_id,
                  u.email,
                  u.display_name,
                  u.global_role,
                  u.account_status,
                  u.theme_preference,
                  u.ui_font_size,
                  u.autosave_interval,
                  s.session_id,
                  s.expires_at
                FROM auth_session s
                JOIN metaframe_user u ON u.user_id = s.user_id
                WHERE s.session_token_hash = ?
                  AND s.revoked_at IS NULL
                  AND s.expires_at > ?
                """,
            this::mapAuthenticatedUser,
            tokenHash,
            now
        );

        return rows.stream().findFirst();
    }

    public void touchSession(UUID sessionId, OffsetDateTime accessedAt) {
        jdbcTemplate.update(
            "UPDATE auth_session SET last_accessed_at = ? WHERE session_id = ?",
            accessedAt,
            sessionId
        );
    }

    public void revokeSession(UUID sessionId, OffsetDateTime revokedAt) {
        jdbcTemplate.update(
            "UPDATE auth_session SET revoked_at = ? WHERE session_id = ?",
            revokedAt,
            sessionId
        );
    }

    public void touchUserLastLogin(String userId, OffsetDateTime loginAt) {
        jdbcTemplate.update(
            "UPDATE metaframe_user SET last_login_at = ?, updated_at = ? WHERE user_id = ?",
            loginAt,
            loginAt,
            userId
        );
    }

    public void updateAccountSettings(
        String userId,
        String displayName,
        String themePreference,
        int uiFontSize,
        int autosaveInterval,
        OffsetDateTime updatedAt
    ) {
        jdbcTemplate.update(
            """
                UPDATE metaframe_user
                SET display_name = ?,
                    theme_preference = ?,
                    ui_font_size = ?,
                    autosave_interval = ?,
                    updated_at = ?
                WHERE user_id = ?
                """,
            displayName,
            themePreference,
            uiFontSize,
            autosaveInterval,
            updatedAt,
            userId
        );
    }

    public void updatePassword(String userId, String passwordHash, OffsetDateTime updatedAt) {
        jdbcTemplate.update(
            """
                UPDATE metaframe_user
                SET password_hash = ?,
                    updated_at = ?
                WHERE user_id = ?
                """,
            passwordHash,
            updatedAt,
            userId
        );
    }

    public void insertPasswordResetRequest(
        UUID requestId,
        String userId,
        String email,
        String extraIdentifier,
        String status,
        OffsetDateTime requestedAt
    ) {
        jdbcTemplate.update(
            """
                INSERT INTO password_reset_request (
                  request_id,
                  user_id,
                  email,
                  extra_identifier,
                  status,
                  requested_at
                ) VALUES (?, ?, ?, ?, ?, ?)
                """,
            requestId,
            userId,
            email,
            extraIdentifier,
            status,
            requestedAt
        );
    }

    private Optional<UserEntity> findSingleUserBy(String columnName, Object value) {
        List<UserEntity> rows = jdbcTemplate.query(
            USER_SELECT + " WHERE " + columnName + " = ?",
            this::mapUser,
            value
        );

        return rows.stream().findFirst();
    }

    private UserEntity mapUser(ResultSet rs, int rowNum) throws SQLException {
        return new UserEntity(
            rs.getString("user_id"),
            rs.getString("email"),
            rs.getString("display_name"),
            rs.getString("password_hash"),
            rs.getString("global_role"),
            rs.getString("account_status"),
            rs.getString("extra_identifier"),
            rs.getString("theme_preference"),
            rs.getInt("ui_font_size"),
            rs.getInt("autosave_interval"),
            rs.getObject("approved_at", OffsetDateTime.class),
            rs.getString("approved_by"),
            rs.getObject("last_login_at", OffsetDateTime.class),
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class)
        );
    }

    private OrganizationProfileEntity mapOrganization(ResultSet rs, int rowNum) throws SQLException {
        return new OrganizationProfileEntity(
            rs.getObject("organization_id", UUID.class),
            rs.getString("organization_name"),
            rs.getBoolean("bootstrap_completed"),
            rs.getBoolean("self_signup_enabled"),
            rs.getString("signup_mode"),
            rs.getString("created_by"),
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class)
        );
    }

    private AuthenticatedUser mapAuthenticatedUser(ResultSet rs, int rowNum) throws SQLException {
        return new AuthenticatedUser(
            rs.getString("user_id"),
            rs.getString("email"),
            rs.getString("display_name"),
            rs.getString("global_role"),
            rs.getString("account_status"),
            rs.getString("theme_preference"),
            rs.getInt("ui_font_size"),
            rs.getInt("autosave_interval"),
            rs.getObject("session_id", UUID.class),
            rs.getObject("expires_at", OffsetDateTime.class)
        );
    }
}
