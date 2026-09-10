package com.reevibes.ai.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RenderKeepAliveService {

    private static final Logger log = LoggerFactory.getLogger(RenderKeepAliveService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.render.health.url:https://scratch-render-sj9n.onrender.com/health}")
    private String renderHealthUrl;

    /**
     * Render free instances spin down after 15 minutes of inactivity.
     * This scheduled ping sends an external incoming HTTP request to Render's router
     * every 9 minutes (540,000 ms), resetting Render's idle inactivity timer and
     * preventing 50+ second cold starts.
     */
    @Scheduled(fixedRate = 540000, initialDelay = 60000)
    public void sendRenderKeepAlivePing() {
        try {
            log.info("RenderKeepAliveService: Sending keep-alive ping to {}", renderHealthUrl);
            String response = restTemplate.getForObject(renderHealthUrl, String.class);
            log.info("RenderKeepAliveService: Ping successful, instance is kept active: {}", response);
        } catch (Exception e) {
            log.warn("RenderKeepAliveService: Keep-alive ping notice: {}", e.getMessage());
        }
    }
}
