package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_conversations")
@Data
@NoArgsConstructor
public class AIConversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", length = 50)
    private String userId;

    @Column(name = "session_id", length = 50)
    private String sessionId;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "sender_type", length = 20)
    private String senderType; // 'user' or 'model'

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
