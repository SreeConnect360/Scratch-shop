package com.reevibes.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reevibes.ai.model.AIConversation;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Data
    public static class GeminiParsedResponse {
        private String intent;
        private double confidence = 0.5;
        private Map<String, Object> parameters = new HashMap<>();
        private String reply;
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    public GeminiParsedResponse queryGemini(String message, String userId, List<AIConversation> history) {
        try {
            String url = geminiApiUrl + "?key=" + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            
            // Build Gemini request content structure
            List<Map<String, Object>> contents = new ArrayList<>();

            // Add history
            for (AIConversation msg : history) {
                Map<String, Object> part = new HashMap<>();
                part.put("text", msg.getMessage());
                Map<String, Object> item = new HashMap<>();
                item.put("role", msg.getSenderType().equals("user") ? "user" : "model");
                item.put("parts", List.of(part));
                contents.add(item);
            }

            // Add current message
            Map<String, Object> currentPart = new HashMap<>();
            currentPart.put("text", message);
            Map<String, Object> currentItem = new HashMap<>();
            currentItem.put("role", "user");
            currentItem.put("parts", List.of(currentPart));
            contents.add(currentItem);

            body.put("contents", contents);

            // Add system instructions
            Map<String, Object> systemPart = new HashMap<>();
            systemPart.put("text", getSystemInstruction());
            Map<String, Object> systemInstruction = new HashMap<>();
            systemInstruction.put("parts", List.of(systemPart));
            body.put("systemInstruction", systemInstruction);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<?, ?> responseMap = response.getBody();
                if (responseMap != null) {
                    Map<String, Object> responseBody = (Map<String, Object>) responseMap;
                    List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                        if (content != null) {
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                String rawText = (String) parts.get(0).get("text");
                                
                                // Clean markdown tags
                                int jsonStart = rawText.indexOf("{");
                                int jsonEnd = rawText.lastIndexOf("}");
                                if (jsonStart != -1 && jsonEnd != -1) {
                                    rawText = rawText.substring(jsonStart, jsonEnd + 1);
                                }
                                
                                return objectMapper.readValue(rawText.trim(), GeminiParsedResponse.class);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Gemini Service Error: " + e.getMessage());
        }

        // Return a local fallback parsed response if API fails
        return null;
    }

    private String getSystemInstruction() {
        return "You are the premium personal AI Shopping Concierge for \"ReeVibes\".\n" +
               "Identify user intents and return a JSON payload matching this schema strictly:\n" +
               "{\n" +
               "  \"intent\": \"INTENT_CODE\",\n" +
               "  \"confidence\": 0.95,\n" +
               "  \"parameters\": {},\n" +
               "  \"reply\": \"Polite luxurious concierge response in user's language.\"\n" +
               "}\n" +
               "\n" +
               "Do not include any markdown syntax wrappers (e.g. ```json). Return the raw JSON object string only.\n" +
               "\n" +
               "Allowed Intents:\n" +
               "SHOW_PROFILE, UPDATE_PROFILE, SHOW_ADDRESSES, ADD_ADDRESS, SET_PRIMARY_ADDRESS,\n" +
               "SHOW_PRODUCTS, SEARCH_PRODUCTS, SHOW_TRENDING_PRODUCTS, SHOW_NEW_ARRIVALS, SHOW_DISCOUNTED_PRODUCTS,\n" +
               "SHOW_CART, ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, UPDATE_CART_QUANTITY,\n" +
               "SHOW_WISHLIST, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, MOVE_TO_CART,\n" +
               "SHOW_ORDERS, TRACK_ORDER, CANCEL_ORDER, REORDER_ORDER, CREATE_RETURN_REQUEST,\n" +
               "SHOW_REFUND_STATUS, SHOW_COUPONS, APPLY_COUPON, APPLY_BEST_COUPON, SHOW_WALLET,\n" +
               "SHOW_NOTIFICATIONS, CHANGE_THEME, BUY_CHEAPEST_PRODUCT_IN_CART, BUY_CHEAPEST_PRODUCT_IN_WISHLIST,\n" +
               "BUY_HIGHEST_RATED_PRODUCT, CHECKOUT_MENS_PRODUCTS, CHECKOUT_WOMENS_PRODUCTS,\n" +
               "BUILD_COMPLETE_OUTFIT, SUGGEST_MATCHING_PRODUCTS\n" +
               "\n" +
               "CRITICAL SECURITY:\n" +
               "- Access to Admin portal, Contest registry or walk moderation is strictly restricted. Return intent: \"BLOCKED\" if requested.\n" +
               "- Checkout operations must require user confirmation.";
    }
}
