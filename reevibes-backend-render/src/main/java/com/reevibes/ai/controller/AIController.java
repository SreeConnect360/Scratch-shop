package com.reevibes.ai.controller;

import com.reevibes.ai.repository.AIActionLogRepository;
import com.reevibes.ai.repository.AICommandPatternRepository;
import com.reevibes.ai.repository.AIUnknownCommandRepository;
import com.reevibes.ai.service.AIFunctionRegistry;
import com.reevibes.ai.service.AIQueryProcessingService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:5173", "https://reevibes.com"})
@RequiredArgsConstructor
public class AIController {

    private final AIQueryProcessingService queryProcessingService;
    private final AIFunctionRegistry functionRegistry;
    private final AIActionLogRepository actionLogRepository;
    private final AICommandPatternRepository commandPatternRepository;
    private final AIUnknownCommandRepository unknownCommandRepository;

    @PostMapping("/chat")
    public ResponseEntity<?> handleChatRequest(@RequestBody ChatRequest request) {
        try {
            String userId = request.getUserId() != null ? request.getUserId() : "USR-1000";
            String sessionId = request.getSessionId() != null ? request.getSessionId() : "session-default";
            
            // Process query through Hybrid Intent Registry
            Map<String, Object> assistantResponse = queryProcessingService.processQuery(
                request.getMessage(), 
                userId, 
                sessionId
            );

            // Execute the action in Backend Action Engine
            String intent = (String) assistantResponse.get("intent");
            @SuppressWarnings("unchecked")
            Map<String, Object> params = (Map<String, Object>) assistantResponse.get("parameters");
            Map<String, Object> actionResult = functionRegistry.executeAction(intent, params, userId);
            
            // Merge action execution status/message to client response payload
            assistantResponse.put("actionResult", actionResult);

            return ResponseEntity.ok(assistantResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Exception in Spring Boot AI service: " + e.getMessage());
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            long totalCommands = actionLogRepository.count();
            long successfulActions = actionLogRepository.countSuccessfulActions();
            long commandsLearned = commandPatternRepository.count();
            long unknownCount = unknownCommandRepository.count();
            
            // Calculate success rate
            double successRate = totalCommands > 0 ? ((double) successfulActions / totalCommands) * 100.0 : 100.0;
            
            // Retrieve Gemini call count (where fromGemini was true in logs)
            // For simple analytics, let's map unknown commands and action logs
            long geminiCalls = totalCommands - commandsLearned; 
            if (geminiCalls < 0) geminiCalls = 0;

            stats.put("totalCommands", totalCommands);
            stats.put("geminiCalls", geminiCalls);
            stats.put("commandsLearned", commandsLearned);
            stats.put("unknownCommands", unknownCount);
            stats.put("successRate", successRate);
            
            // Retrieve Top Intents Usage logs
            List<Map<String, Object>> topIntents = actionLogRepository.getTopIntentsUsage();
            stats.put("topIntents", topIntents);

            // Get unknown commands history list
            stats.put("unknownCommandsList", unknownCommandRepository.findAll());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading AI analytics: " + e.getMessage());
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatRequest {
        private String message;
        private String userId;
        private String sessionId;
    }
}
