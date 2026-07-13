package com.reevibes.ai.service;

import com.reevibes.ai.repository.EmailOtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OtpCleanupScheduler {
    private static final Logger log = LoggerFactory.getLogger(OtpCleanupScheduler.class);

    @Autowired
    private EmailOtpRepository emailOtpRepository;

    // Run every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void cleanExpiredOtps() {
        try {
            log.info("Running background scheduler to remove expired OTP records...");
            emailOtpRepository.deleteExpiredOtps(LocalDateTime.now());
        } catch (Exception e) {
            log.error("Failed to clean expired OTP records", e);
        }
    }
}
