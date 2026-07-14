package com.reevibes.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reevibes.ai.model.ShopOrder;
import com.reevibes.ai.model.PlatformUser;
import com.reevibes.ai.repository.PlatformUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ShiprocketService {

    private final PlatformUserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${shiprocket.email:hello@reevibes.com}")
    private String email;

    @Value("${shiprocket.password:h%7SVDxqFlqttMAM1FgwcV3C1LrB0%bN}")
    private String password;

    private String cachedToken = null;
    private long tokenExpiryTime = 0;

    /**
     * Authenticates with Shiprocket API to get JWT token.
     */
    public synchronized String getAuthToken() {
        if (cachedToken != null && System.currentTimeMillis() < tokenExpiryTime) {
            return cachedToken;
        }

        try {
            String url = "https://apiv2.shiprocket.in/v1/external/auth/login";
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("email", email);
            requestBody.put("password", password);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String token = (String) response.getBody().get("token");
                if (token != null) {
                    cachedToken = token;
                    // Token is usually valid for 10 days, we set expiry to 9 days to be safe
                    tokenExpiryTime = System.currentTimeMillis() + (9 * 24 * 60 * 60 * 1000L);
                    return token;
                }
            }
        } catch (Exception e) {
            System.err.println("Shiprocket Login failed: " + e.getMessage());
        }
        return null;
    }

    /**
     * Creates an adhoc order in Shiprocket for a placed order.
     */
    public Map<String, String> createShiprocketOrder(ShopOrder order) {
        String token = getAuthToken();
        if (token == null) {
            System.err.println("Could not create Shiprocket order: auth token is null");
            return Collections.emptyMap();
        }

        try {
            PlatformUser user = userRepository.findById(order.getUserId()).orElse(null);
            
            // Parse shipping details
            String billingName = "Customer";
            String billingLastName = "ReeVibes";
            String billingEmail = "hello@reevibes.com";
            String billingPhone = "9999999999";
            
            if (user != null) {
                billingName = user.getFirstName() != null && !user.getFirstName().isEmpty() ? user.getFirstName() : billingName;
                billingLastName = user.getLastName() != null && !user.getLastName().isEmpty() ? user.getLastName() : billingLastName;
                billingEmail = user.getEmail() != null && !user.getEmail().isEmpty() ? user.getEmail() : billingEmail;
                billingPhone = user.getPhone() != null ? user.getPhone().replaceAll("[^0-9]", "") : billingPhone;
                if (billingPhone.isEmpty()) billingPhone = "9999999999";
            }

            // Parse address components
            String rawAddress = order.getAddress() != null ? order.getAddress() : "";
            String street = "Indiranagar";
            String city = "Bangalore";
            String state = "Karnataka";
            String pincode = "560038";
            
            String[] parts = rawAddress.split(",");
            if (parts.length >= 4) {
                street = parts[0].trim();
                city = parts[1].trim();
                state = parts[parts.length - 2].trim();
                pincode = parts[parts.length - 1].trim().replaceAll("[^0-9]", "");
            } else {
                // Fallback regex to find pincode
                Pattern pinPattern = Pattern.compile("\\b\\d{6}\\b");
                Matcher matcher = pinPattern.matcher(rawAddress);
                if (matcher.find()) {
                    pincode = matcher.group();
                }
                if (!rawAddress.isEmpty()) {
                    street = rawAddress;
                }
            }

            // Parse items json
            List<Map<String, Object>> orderItems = new ArrayList<>();
            try {
            List<?> itemsList = objectMapper.readValue(order.getItemsJson(), List.class);
            for (Object itemObj : itemsList) {
                if (itemObj instanceof Map) {
                    Map<?, ?> itemMap = (Map<?, ?>) itemObj;
                    Map<String, Object> orderItem = new HashMap<>();
                    orderItem.put("name", itemMap.getOrDefault("name", "Fashion Piece"));
                    orderItem.put("sku", itemMap.getOrDefault("productId", "SKU-" + System.currentTimeMillis()));
                        
                        Object qtyVal = itemMap.get("qty");
                        int units = qtyVal instanceof Number ? ((Number) qtyVal).intValue() : 1;
                        orderItem.put("units", units);
                        
                        Object priceVal = itemMap.get("price");
                        double price = 1000.0;
                        if (priceVal != null) {
                            String priceStr = String.valueOf(priceVal).replaceAll("[^0-9]", "");
                            if (!priceStr.isEmpty()) {
                                price = Double.parseDouble(priceStr);
                            }
                        }
                        orderItem.put("selling_price", price);
                        orderItem.put("discount", 0);
                        orderItem.put("tax", 0);
                        orderItem.put("hsn", 610910); // Standard Apparel HSN
                        orderItems.add(orderItem);
                    }
                }
            } catch (Exception e) {
                // Fallback item
                Map<String, Object> orderItem = new HashMap<>();
                orderItem.put("name", "Fashion Piece Curation");
                orderItem.put("sku", "CUR-01");
                orderItem.put("units", 1);
                orderItem.put("selling_price", order.getTotal().doubleValue());
                orderItem.put("discount", 0);
                orderItem.put("tax", 0);
                orderItem.put("hsn", 610910);
                orderItems.add(orderItem);
            }

            // Build payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("order_id", order.getId());
            payload.put("order_date", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm").format(new java.util.Date()));
            payload.put("pickup_location", "Primary");
            payload.put("billing_customer_name", billingName);
            payload.put("billing_last_name", billingLastName);
            payload.put("billing_address", street);
            payload.put("billing_city", city);
            payload.put("billing_pincode", pincode);
            payload.put("billing_state", state);
            payload.put("billing_country", "India");
            payload.put("billing_email", billingEmail);
            payload.put("billing_phone", billingPhone);
            payload.put("shipping_is_billing", true);
            payload.put("order_items", orderItems);
            payload.put("payment_method", "Prepaid");
            payload.put("sub_total", order.getTotal().doubleValue());
            payload.put("length", 15);
            payload.put("breadth", 15);
            payload.put("height", 10);
            payload.put("weight", 0.5);

            String url = "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map body = response.getBody();
                System.out.println("Shiprocket order created successfully: " + body);
                Map<String, String> res = new HashMap<>();
                if (body.containsKey("order_id")) {
                    res.put("order_id", String.valueOf(body.get("order_id")));
                }
                if (body.containsKey("shipment_id")) {
                    res.put("shipment_id", String.valueOf(body.get("shipment_id")));
                }
                return res;
            } else {
                System.err.println("Failed to create Shiprocket order: " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Exception while creating Shiprocket order: " + e.getMessage());
        }
        return Collections.emptyMap();
    }

    /**
     * Gets available couriers, delivery ETA, cost, and ratings for serviceability.
     */
    public Map getCourierQuotes(String destinationPincode) {
        String token = getAuthToken();
        if (token == null) return Collections.emptyMap();

        try {
            String url = String.format(
                "https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=%s&delivery_postcode=%s&weight=%s&cod=%d",
                "533001", destinationPincode, "0.5", 0
            );

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Exception fetching courier quotes: " + e.getMessage());
        }
        return Collections.emptyMap();
    }

    /**
     * Assigns the courier and generates the AWB number for a shipment.
     */
    public Map assignAWB(String shipmentId, String courierId) {
        String token = getAuthToken();
        if (token == null) return Collections.emptyMap();

        try {
            String url = "https://apiv2.shiprocket.in/v1/external/courier/assign/awb";
            Map<String, Object> payload = new HashMap<>();
            payload.put("shipment_id", shipmentId);
            payload.put("courier_id", courierId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Exception assigning AWB: " + e.getMessage());
        }
        return Collections.emptyMap();
    }

    /**
     * Schedules the pickup for a shipment.
     */
    public Map schedulePickup(String shipmentId, String pickupDate) {
        String token = getAuthToken();
        if (token == null) return Collections.emptyMap();

        try {
            String url = "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup";
            Map<String, Object> payload = new HashMap<>();
            payload.put("shipment_id", Collections.singletonList(shipmentId));
            payload.put("pickup_date", pickupDate);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Exception scheduling pickup: " + e.getMessage());
        }
        return Collections.emptyMap();
    }
}
