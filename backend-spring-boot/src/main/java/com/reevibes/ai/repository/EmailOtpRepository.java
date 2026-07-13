package com.reevibes.ai.repository;

import com.reevibes.ai.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findTopByEmailOrderByCreatedAtDesc(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM EmailOtp e WHERE e.expiresAt < :now")
    void deleteExpiredOtps(LocalDateTime now);

    @Transactional
    @Modifying
    void deleteByEmail(String email);
}
