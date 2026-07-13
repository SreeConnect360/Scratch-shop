package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_action_logs")
@Data
@NoArgsConstructor
public class AIActionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", length = 50)
    private String userId;

    @Column(name = "intent_code", nullable = false, length = 100)
    private String intentCode;

    @Column(name = "action_status", nullable = false, length = 50)
    private String actionStatus;

    @Column(name = "execution_time")
    private Long executionTime; // In milliseconds

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
