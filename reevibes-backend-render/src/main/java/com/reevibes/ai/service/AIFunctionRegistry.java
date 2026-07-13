package com.reevibes.ai.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIFunctionRegistry {

    private final ProfileService profileService;
    private final AddressService addressService;
    private final ProductService productService;
    private final CartService cartService;
    private final WishlistService wishlistService;
    private final OrderService orderService;
    private final ReturnService returnService;
    private final CouponService couponService;
    private final WalletService walletService;
    private final NotificationService notificationService;
    private final ThemeService themeService;
    private final FashionStylistService fashionStylistService;

    public Map<String, Object> executeAction(String intent, Map<String, Object> parameters, String userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("intent", intent);
        result.put("status", "SUCCESS");

        try {
            switch (intent) {
                case "SHOW_PROFILE":
                case "SHOW_ACCOUNT_OVERVIEW":
                    result.put("message", profileService.showProfile(userId));
                    break;

                case "UPDATE_PROFILE":
                case "UPDATE_NAME":
                case "UPDATE_EMAIL":
                case "UPDATE_PHONE":
                    result.put("message", profileService.updateProfile(userId, parameters));
                    break;

                case "SHOW_ADDRESSES":
                case "SHOW_PRIMARY_ADDRESS":
                    result.put("message", addressService.showAddresses(userId));
                    break;

                case "ADD_ADDRESS":
                case "SET_PRIMARY_ADDRESS":
                    result.put("message", addressService.addAddress(userId, parameters));
                    break;

                case "SHOW_PRODUCTS":
                case "SEARCH_PRODUCTS":
                case "SHOW_TRENDING_PRODUCTS":
                case "SHOW_NEW_ARRIVALS":
                case "SHOW_DISCOUNTED_PRODUCTS":
                    result.put("message", productService.searchProducts((String) parameters.getOrDefault("searchQuery", "")));
                    break;

                case "ADD_TO_CART":
                    String prodId = (String) parameters.getOrDefault("productId", "");
                    String size = (String) parameters.getOrDefault("selectedSize", "M");
                    int qty = Integer.parseInt(parameters.getOrDefault("qty", 1).toString());
                    result.put("message", cartService.addToCart(userId, prodId, size, qty));
                    break;

                case "REMOVE_FROM_CART":
                case "CLEAR_CART":
                case "UPDATE_CART_QUANTITY":
                    result.put("message", cartService.removeFromCart(userId, (String) parameters.getOrDefault("productId", "")));
                    break;

                case "SHOW_WISHLIST":
                case "ADD_TO_WISHLIST":
                case "REMOVE_FROM_WISHLIST":
                case "MOVE_TO_CART":
                    result.put("message", wishlistService.addToWishlist(userId, (String) parameters.getOrDefault("productId", "")));
                    break;

                case "SHOW_ORDERS":
                case "TRACK_ORDER":
                case "CANCEL_ORDER":
                case "REORDER_ORDER":
                    result.put("message", orderService.trackOrder((String) parameters.getOrDefault("orderId", "")));
                    break;

                case "CREATE_RETURN_REQUEST":
                case "SHOW_REFUND_STATUS":
                    result.put("message", returnService.createReturn(
                        (String) parameters.getOrDefault("orderId", ""),
                        (String) parameters.getOrDefault("productId", ""),
                        (String) parameters.getOrDefault("reason", "")
                    ));
                    break;

                case "SHOW_COUPONS":
                case "APPLY_COUPON":
                case "APPLY_BEST_COUPON":
                    result.put("message", couponService.applyCoupon((String) parameters.getOrDefault("couponCode", "")));
                    break;

                case "SHOW_WALLET":
                    result.put("message", walletService.getBalance(userId));
                    break;

                case "SHOW_NOTIFICATIONS":
                    result.put("message", notificationService.getNotifications(userId));
                    break;

                case "CHANGE_THEME":
                case "SWITCH_DARK_MODE":
                case "SWITCH_LIGHT_MODE":
                    result.put("message", themeService.changeTheme((String) parameters.getOrDefault("theme", "")));
                    break;

                case "BUILD_COMPLETE_OUTFIT":
                case "SUGGEST_MATCHING_PRODUCTS":
                    result.put("message", fashionStylistService.buildOutfit(
                        (String) parameters.getOrDefault("occasion", ""),
                        parameters.containsKey("budgetLimit") ? Integer.parseInt(parameters.get("budgetLimit").toString()) : null
                    ));
                    break;

                case "BLOCKED":
                    result.put("status", "BLOCKED");
                    result.put("message", "Action restricted. Cannot access vendor/contest/admin systems.");
                    break;

                default:
                    result.put("status", "DELEGATED_TO_FRONTEND");
                    result.put("message", "Delegating rendering/actions to frontend state controller.");
                    break;
            }
        } catch (Exception e) {
            result.put("status", "FAILED");
            result.put("message", "Action execution error: " + e.getMessage());
        }

        return result;
    }
}
