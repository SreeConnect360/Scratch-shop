package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_unknown_commands")
@Data
@NoArgsConstructor
public class AIUnknownCommand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", length = 50)
    private String userId;

    @Column(name = "command_text", nullable = false, columnDefinition = "TEXT")
    private String commandText;

    @Column(name = "gemini_response", columnDefinition = "TEXT")
    private String geminiResponse;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
