package com.reevibes.ai.service;

import com.reevibes.ai.model.*;
import com.reevibes.ai.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AIQueryProcessingService {

    private final AIIntentRepository intentRepository;
    private final AICommandPatternRepository commandPatternRepository;
    private final AIUnknownCommandRepository unknownCommandRepository;
    private final AIActionLogRepository actionLogRepository;
    private final AIConversationRepository conversationRepository;
    private final CommandNormalizationService normalizationService;
    private final GeminiService geminiService;

    public Map<String, Object> processQuery(String message, String userId, String sessionId) {
        long startTime = System.currentTimeMillis();
        
        // Log conversation history
        AIConversation userMsg = new AIConversation();
        userMsg.setUserId(userId);
        userMsg.setSessionId(sessionId);
        userMsg.setMessage(message);
        userMsg.setSenderType("user");
        conversationRepository.save(userMsg);

        String normalized = normalizationService.normalize(message);
        
        String intentCode = null;
        Map<String, Object> parameters = new HashMap<>();
        String reply = null;
        boolean fromGemini = false;
        double confidence = 1.0;

        // Strict overrides to prevent incorrect redirects
        String lowerMsg = message.toLowerCase().trim();
        if (lowerMsg.contains("go to my cart") || lowerMsg.contains("go to cart") || lowerMsg.equals("cart") || lowerMsg.contains("show cart") || lowerMsg.contains("view cart")) {
            intentCode = "SHOW_CART";
            reply = "Displaying your active shopping cart curation.";
        } else if (lowerMsg.contains("go to my wishlist") || lowerMsg.contains("go to wishlist") || lowerMsg.equals("wishlist") || lowerMsg.contains("show wishlist") || lowerMsg.contains("view wishlist")) {
            intentCode = "SHOW_WISHLIST";
            reply = "Loading your luxury wishlist pieces.";
        }

        // Priority 1: Exact Match in DB Patterns
        if (intentCode == null) {
            Optional<AICommandPattern> exactPattern = commandPatternRepository.findByCommandText(message);
            if (exactPattern.isPresent()) {
                intentCode = exactPattern.get().getIntent().getIntentCode();
                reply = getFallbackReply(intentCode, message);
            }
        }

        // Priority 2: Normalized Match in DB Patterns
        if (intentCode == null) {
            Optional<AICommandPattern> normPattern = commandPatternRepository.findByNormalizedCommand(normalized);
            if (normPattern.isPresent()) {
                intentCode = normPattern.get().getIntent().getIntentCode();
                reply = getFallbackReply(intentCode, message);
            }
        }

        // Priority 3: Similarity Search in DB Patterns (Levenshtein Similarity > 80%)
        if (intentCode == null) {
            List<AICommandPattern> allPatterns = commandPatternRepository.findAll();
            AICommandPattern bestPattern = null;
            double maxSimilarity = 0.0;
            
            for (AICommandPattern pattern : allPatterns) {
                double similarity = normalizationService.calculateSimilarity(message, pattern.getCommandText());
                if (similarity > maxSimilarity) {
                    maxSimilarity = similarity;
                    bestPattern = pattern;
                }
            }
            
            if (bestPattern != null && maxSimilarity >= 0.80) {
                intentCode = bestPattern.getIntent().getIntentCode();
                confidence = maxSimilarity;
                reply = getFallbackReply(intentCode, message);
            }
        }

        // Priority 4: Call Gemini AI
        if (intentCode == null) {
            fromGemini = true;
            List<AIConversation> history = conversationRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
            
            GeminiService.GeminiParsedResponse geminiResp = geminiService.queryGemini(message, userId, history);
            if (geminiResp != null) {
                intentCode = geminiResp.getIntent();
                confidence = geminiResp.getConfidence();
                parameters = geminiResp.getParameters();
                reply = geminiResp.getReply();

                // Learn command if confidence is high (>= 85%) and intent is valid
                if (confidence >= 0.85 && intentCode != null) {
                    Optional<AIIntent> matchedIntent = intentRepository.findByIntentCode(intentCode);
                    if (matchedIntent.isPresent()) {
                        AICommandPattern newPattern = new AICommandPattern();
                        newPattern.setIntent(matchedIntent.get());
                        newPattern.setCommandText(message);
                        newPattern.setNormalizedCommand(normalized);
                        commandPatternRepository.save(newPattern);
                    }
                } else {
                    // Log as unknown command for developer dashboard review
                    AIUnknownCommand unknown = new AIUnknownCommand();
                    unknown.setUserId(userId);
                    unknown.setCommandText(message);
                    unknown.setGeminiResponse(reply);
                    unknown.setConfidenceScore(confidence);
                    unknownCommandRepository.save(unknown);
                }
            }
        }

        // If all else fails, use a safe default
        if (intentCode == null) {
            String lower = message.toLowerCase();
            if (lower.contains("cart") || lower.contains("bag")) {
                intentCode = "SHOW_CART";
                reply = "Displaying your active shopping cart curation.";
            } else if (lower.contains("wishlist") || lower.contains("saved")) {
                intentCode = "SHOW_WISHLIST";
                reply = "Loading your luxury wishlist pieces.";
            } else {
                intentCode = "SEARCH_PRODUCTS";
                parameters.put("searchQuery", message);
                reply = "I've updated the collections to show products matching: " + message;
            }
        }

        // Action Executed Log
        long duration = System.currentTimeMillis() - startTime;
        AIActionLog log = new AIActionLog();
        log.setUserId(userId);
        log.setIntentCode(intentCode);
        log.setActionStatus("SUCCESS");
        log.setExecutionTime(duration);
        actionLogRepository.save(log);

        // Log assistant reply in conversation history
        AIConversation modelMsg = new AIConversation();
        modelMsg.setUserId(userId);
        modelMsg.setSessionId(sessionId);
        modelMsg.setMessage(reply);
        modelMsg.setSenderType("model");
        conversationRepository.save(modelMsg);

        // Response Payload structure for client
        Map<String, Object> clientResponse = new HashMap<>();
        clientResponse.put("intent", intentCode);
        clientResponse.put("parameters", parameters);
        clientResponse.put("reply", reply);
        clientResponse.put("fromGemini", fromGemini);
        clientResponse.put("confidence", confidence);

        return clientResponse;
    }

    private String getFallbackReply(String intentCode, String originalCommand) {
        switch (intentCode) {
            case "SHOW_CART": return "Displaying your active shopping cart curation.";
            case "SHOW_WISHLIST": return "Loading your luxury wishlist pieces.";
            case "SHOW_ORDERS": return "Fetching your Maison Orders Tracker.";
            case "SHOW_COUPONS": return "Displaying available promotional coupons.";
            case "SHOW_SETTINGS": return "Opening your Account settings dashboard.";
            case "SHOW_PROFILE": return "Loading your personal dossier details.";
            case "SHOW_WALLET": return "Retrieving your active wallet balance.";
            case "SHOW_ADDRESSES": return "Opening your delivery destinations registry.";
            case "CHANGE_THEME": return "Updating your display theme layout.";
            case "CHECKOUT_MENS_PRODUCTS": return "I am now initiating the checkout process for all gentlemen's items in your cart. Would you like to proceed to payment?";
            case "CHECKOUT_WOMENS_PRODUCTS": return "I am now initiating the checkout process for all women's items in your cart. Would you like to proceed to payment?";
            default: return "Redirecting you to our curated collections matching: \"" + originalCommand + "\".";
        }
    }
}
