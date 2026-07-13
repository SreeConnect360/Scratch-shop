package com.reevibes.ai.service;

import org.springframework.stereotype.Service;

@Service
public class CommandNormalizationService {

    public String normalize(String command) {
        if (command == null) {
            return "";
        }
        
        // 1. Lowercase, strip punctuation and extra spaces
        String normalized = command.toLowerCase()
                .replaceAll("[\\p{Punct}&&[^₹]]", "") // keep currency sign if any
                .replaceAll("\\s+", " ")
                .trim();

        // 2. Synonyms mapping
        normalized = normalized
                .replaceAll("\\b(view|display|open|get|fetch|check)\\b", "show")
                .replaceAll("\\b(purchase|order|buy)\\b", "checkout")
                .replaceAll("\\b(delete|clear|dismiss)\\b", "remove")
                .replaceAll("\\b(my details|account details|user info|dossier)\\b", "profile")
                .replaceAll("\\b(addresses|delivery points|locations)\\b", "address")
                .replaceAll("\\b(coupons|promo codes|active promotional codes)\\b", "coupon")
                .replaceAll("\\b(refunds|returns)\\b", "return")
                .replaceAll("\\b(wallet balance|cashback|cashback history)\\b", "wallet")
                .replaceAll("\\b(color theme|appearance|theme settings)\\b", "theme");

        return normalized;
    }

    public double calculateSimilarity(String s1, String s2) {
        String n1 = normalize(s1);
        String n2 = normalize(s2);
        
        int distance = getLevenshteinDistance(n1, n2);
        int maxLength = Math.max(n1.length(), n2.length());
        
        if (maxLength == 0) {
            return 1.0;
        }
        return 1.0 - ((double) distance / maxLength);
    }

    private int getLevenshteinDistance(String s1, String s2) {
        int[] costs = new int[s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            int lastValue = i;
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) {
                    costs[j] = j;
                } else {
                    if (j > 0) {
                        int newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) {
                costs[s2.length()] = lastValue;
            }
        }
        return costs[s2.length()];
    }
}
