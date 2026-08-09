package com.reevibes.ai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_command_patterns")
@Data
@NoArgsConstructor
public class AICommandPattern {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "intent_id", nullable = false)
    private AIIntent intent;

    @Column(name = "command_text", nullable = false, columnDefinition = "TEXT")
    private String commandText;

    @Column(name = "normalized_command", nullable = false, columnDefinition = "TEXT")
    private String normalizedCommand;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AIIntent getIntent() { return intent; }
    public void setIntent(AIIntent intent) { this.intent = intent; }

    public String getCommandText() { return commandText; }
    public void setCommandText(String commandText) { this.commandText = commandText; }

    public String getNormalizedCommand() { return normalizedCommand; }
    public void setNormalizedCommand(String normalizedCommand) { this.normalizedCommand = normalizedCommand; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
