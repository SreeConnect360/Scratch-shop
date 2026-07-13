// AI Assistant client service to communicate with Gemini API and identify intents.
import { BACKEND_URL } from "../../lib/config";

export interface AssistantResponse {
  intent: string;
  parameters: Record<string, any>;
  reply: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export async function queryGeminiAssistant(
  message: string,
  history: { role: "user" | "model"; content: string }[],
  stateContext: {
    user: any;
    cart: any[];
    wishlist: string[];
    addresses: string[];
    coupons: any[];
    products: any[];
    orders: any[];
    walletBalance: number;
    notifications: any[];
  }
): Promise<AssistantResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const productsCtx = stateContext.products
    .map(p => `ID: ${p.id}, Name: ${p.name}, Brand/House: ${p.house || p.brand || ""}, Price: ${p.price}, OriginalPrice: ${p.originalPrice || ""}, Categories: ${JSON.stringify(p.categories || [])}, Category: ${p.category || ""}, Gender: ${p.gender || ""}, CustomTags: ${JSON.stringify(p.tags || [])}, Colors: ${p.colors || p.color || ""}, FabricMaterial: ${p.fabricMaterial || p.fabric || ""}, Sizes: ${JSON.stringify(p.sizes || [])}, StockPerSize: ${JSON.stringify(p.stockPerSize || {})}`)
    .join("\n");

  const systemInstruction = `You are the premium personal AI Shopping Concierge for "ReeVibes".
Your goal is to identify user intents from natural language queries and return structured JSON parameters.

CRITICAL SCOPE SECURITY:
- Only allow shopping portal functionality: /shop, products, cart, wishlist, profile, orders, returns, coupons, wallet, notifications, fashion styling recommendations, and smart comparisons.
- Strictly block admin portal, vendor dashboard, system configuration, or contest moderation (return intent: "BLOCKED").

UNRECOGNIZED MESSAGES RULE:
- If you do not understand the user's message, or if it is completely unrelated to the ReeVibes shopping portal, set the intent to "UNKNOWN" and reply politely, explaining what you can help them with (e.g., product search, cart, wishlist, orders, checkout, wallet balance, returns).

ADDRESS COLLECTION & VALIDATION RULES:
When the user wants to add an address:
1. You must check for critical fields: **pincode** and **phone number**.
2. If the user DID NOT provide a pincode or phone number, DO NOT return the "ADD_ADDRESS" intent yet. Instead, return intent "MISSING_ADDRESS_INFO" and reply politely asking only for the missing information. Provide a clear example of the format, e.g.:
   "To finalize adding your delivery coordinates, could you please provide your phone number and pincode? For example: '9845321456, 560001'"
3. If pincode is provided, automatically fetch/infer the corresponding **State** and **District** (e.g., 560xxx is Bangalore, Karnataka; 533xxx is East Godavari, Andhra Pradesh; 500xxx is Hyderabad, Telangana; 110xxx is Delhi). Include these inferred details inside the address parameters.
4. If all details are present, return intent "ADD_ADDRESS" with the parameters:
   - "address": A structured object containing { "name", "phone", "pincode", "streetAddress", "district", "state" }

INTENT REGISTRY:
Map the user query to one of the following exact intent labels:1. PROFILE FUNCTIONS:
- SHOW_PROFILE
- UPDATE_PROFILE (parameters: "firstName", "lastName", "email", "phone", "country")
- UPDATE_NAME (parameters: "firstName")
- UPDATE_EMAIL (parameters: "email")
- UPDATE_PHONE (parameters: "phone")
- SHOW_ACCOUNT_OVERVIEW
- SHOW_SETTINGS

2. ADDRESS FUNCTIONS:
- SHOW_ADDRESSES
- ADD_ADDRESS (parameters: "address" object)
- DELETE_ADDRESS (parameters: "index")
- SET_PRIMARY_ADDRESS (parameters: "address")
- SHOW_PRIMARY_ADDRESS

3. PRODUCT SEARCH & DISCOVERY:
- SEARCH_PRODUCTS (parameters: "searchQuery")
- FILTER_BY_GENDER (parameters: "gender" [Men/Women])
- FILTER_BY_CATEGORY (parameters: "category")
- FILTER_BY_SIZE (parameters: "size")
- FILTER_BY_COLOR (parameters: "color")
- FILTER_BY_PRICE (parameters: "priceLimit")
- SHOW_NEW_ARRIVALS
- SHOW_TRENDING_PRODUCTS
- SHOW_BESTSELLERS
- SHOW_COLLECTIONS
- SHOW_ALL_PRODUCTS
- COMPARE_PRODUCTS (parameters: "productIds")

4. CART FUNCTIONS:
- SHOW_CART
- ADD_TO_CART (parameters: "productId", "selectedSize", "qty")
- REMOVE_FROM_CART (parameters: "productId", "selectedSize")
- CLEAR_CART
- UPDATE_CART_QUANTITY (parameters: "productId", "selectedSize", "qty")
- REMOVE_PRODUCTS_BY_GENDER (parameters: "gender")
- REMOVE_PRODUCTS_BY_CATEGORY (parameters: "category")
- MOVE_CART_ITEM_TO_WISHLIST (parameters: "productId")
- CALCULATE_CART_TOTAL

5. WISHLIST FUNCTIONS:
- SHOW_WISHLIST
- ADD_TO_WISHLIST (parameters: "productId")
- REMOVE_FROM_WISHLIST (parameters: "productId")
- MOVE_TO_CART (parameters: "productId")
- MOVE_ALL_TO_CART

6. CHECKOUT FUNCTIONS:
- CHECKOUT_CART
- CHECKOUT_MENS_PRODUCTS
- CHECKOUT_WOMENS_PRODUCTS
- APPLY_BEST_COUPON
- APPLY_COUPON (parameters: "couponCode")
- USE_WALLET_BALANCE
- PROCEED_TO_PAYMENT

7. ORDER & RETURNS FUNCTIONS:
- SHOW_ORDERS
- TRACK_ORDER (parameters: "orderId")
- TRACK_LATEST_ORDER
- REORDER_LAST_ORDER
- CREATE_RETURN_REQUEST (parameters: "orderId", "productId", "reason", "comment")
- SHOW_RETURN_STATUS
- SHOW_REFUND_STATUS

8. COUPONS & WALLET:
- SHOW_COUPONS
- SHOW_WALLET_BALANCE
- SHOW_WALLET_TRANSACTIONS

9. REVIEWS & NOTIFICATIONS:
- SHOW_MY_REVIEWS
- ADD_REVIEW (parameters: "productId", "rating", "comment")
- SHOW_NOTIFICATIONS
- MARK_NOTIFICATION_READ (parameters: "notificationId")
- MARK_ALL_NOTIFICATIONS_READ

10. FASHION AI FUNCTIONS:
- BUILD_COMPLETE_OUTFIT (parameters: "occasion", "budgetLimit")
- SUGGEST_MATCHING_PRODUCTS (parameters: "productId")
- SUGGEST_TRENDING_LOOK

11. SMART SHOPPING FUNCTIONS:
- BUY_CHEAPEST_PRODUCT_IN_CART
- BUY_CHEAPEST_PRODUCT_IN_WISHLIST
- BUY_HIGHEST_RATED_PRODUCT (parameters: "category")
- FIND_BEST_DEAL (parameters: "priceLimit")

PRODUCTS IN STORE DATA:
${productsCtx}

CURRENT USER STATE:
- Logged in user: ${stateContext.user ? `${stateContext.user.firstName} ${stateContext.user.lastName} (ID: ${stateContext.user.id})` : "Guest"}
- Cart items: ${JSON.stringify(stateContext.cart)}
- Wishlist items: ${JSON.stringify(stateContext.wishlist)}
- Saved addresses: ${JSON.stringify(stateContext.addresses)}
- Wallet balance: ₹${stateContext.walletBalance}

USER LANGUAGE & INTERFACE TRANSLATIONS:
- Adapt/reply matching the user's preferred language (English, Hindi, Spanish, etc.), while keeping the JSON response format strictly standard.
- Map any navigation queries like "New Arrivals", "Trending", "Collections", "All products", "Wishlist", "Cart", "Account Dashboard", "My Orders", "Maison Coupons", "Delivery Points/Addresses", "Profile", "Returns & Refunds", "Wallet", and "Settings" directly to their corresponding intents.

RESPOND ONLY IN VALID JSON FORMAT:
{
  "intent": "INTENT_NAME",
  "parameters": { ...extracted params... },
  "reply": "An elegant, luxury concierge response."
}

Do not include any markdown syntax wrappers (e.g. \`\`\`json). Return the raw JSON object string only.`;

  const contents = [
    ...history.map(h => ({
      role: h.role === "model" ? "model" : "user",
      parts: [{ text: h.content }]
    })),
    {
      role: "user",
      parts: [{ text: message }]
    }
  ];

  const backendUrl = `${BACKEND_URL}/api/ai/chat`;
  const userId = stateContext.user ? stateContext.user.id : "USR-1000";

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        userId,
        sessionId: "session-" + userId
      })
    });

    if (!response.ok) {
      console.warn(`Spring Boot AI API returned status ${response.status}. Using local query parser fallback.`);
      return localFallbackParser(message);
    }

    const data = await response.json();
    return {
      intent: data.intent,
      parameters: data.parameters || {},
      reply: data.reply
    };
  } catch (err) {
    console.error("Error connecting to Spring Boot backend, using local fallback parser:", err);
    return localFallbackParser(message);
  }
}


function localFallbackParser(message: string): AssistantResponse {
  const query = message.toLowerCase().replace(/['’]s\b/g, "");

  // 0. Greetings & Conversational overrides
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "namaste"];
  if (greetings.some(g => query === g || query.startsWith(g + " "))) {
    return {
      intent: "GREETING",
      parameters: {},
      reply: "Hello! I am your Maison Concierge. How may I assist your style curation today? You can ask me to view your cart, check your wishlist, toggle dark mode, or search for specific products."
    };
  }

  const gratitude = ["thank you", "thanks", "appreciate it", "awesome", "great"];
  if (gratitude.some(g => query.includes(g))) {
    return {
      intent: "GRATITUDE",
      parameters: {},
      reply: "It is my absolute pleasure. Let me know if you need help with anything else!"
    };
  }

  const help = ["help", "what can you do", "features", "how to use"];
  if (help.some(h => query.includes(h))) {
    return {
      intent: "HELP",
      parameters: {},
      reply: "I am your personal Styling & Shopping Concierge. You can ask me to:\n- Show your cart or wishlist\n- Search for products (e.g. 'find red dress')\n- Filter products by gender (e.g. 'show men\'s clothes')\n- Change theme to dark or light mode\n- Check your wallet balance"
    };
  }

  const isConversational = ["who are you", "what is your name", "how are you", "what's up"].some(q => query.includes(q));
  if (isConversational) {
    return {
      intent: "CONVERSATION",
      parameters: {},
      reply: "I am the Maison Concierge, your dedicated AI styling assistant at ReeVibes. I'm here to help you navigate our luxury collections."
    };
  }

  // 1. Cart and Wishlist overrides
  if (query.includes("cart") || query.includes("bag")) {
    return {
      intent: "SHOW_CART",
      parameters: {},
      reply: "Certainly. Displaying your active shopping cart curation."
    };
  }
  if (query.includes("wishlist") || query.includes("saved")) {
    return {
      intent: "SHOW_WISHLIST",
      parameters: {},
      reply: "Certainly. Opening your style curation wishlist."
    };
  }

  // 2. Theme controls
  if (query.includes("dark mode") || query.includes("noir mode") || query.includes("theme to dark")) {
    return {
      intent: "SWITCH_DARK_MODE",
      parameters: {},
      reply: "Understood. Switching your boutique interface to our luxurious dark theme mode."
    };
  }
  if (query.includes("light mode") || query.includes("theme to light")) {
    return {
      intent: "SWITCH_LIGHT_MODE",
      parameters: {},
      reply: "Certainly. Switching your boutique interface to our premium light theme mode."
    };
  }

  // 3. Checkout gender specific
  if (query.includes("checkout") || query.includes("order") || query.includes("buy")) {
    if (query.includes("men")) {
      return {
        intent: "CHECKOUT_MENS_PRODUCTS",
        parameters: {},
        reply: "I am now initiating the checkout process for all gentlemen's items in your cart. Would you like to proceed to payment?"
      };
    }
    if (query.includes("women")) {
      return {
        intent: "CHECKOUT_WOMENS_PRODUCTS",
        parameters: {},
        reply: "I am now initiating the checkout process for all women's items in your cart. Would you like to proceed to payment?"
      };
    }
  }

  // 4. Navigation shortcuts
  if (query.includes("new arrival") || query.includes("latest")) {
    return { intent: "SHOW_NEW_ARRIVALS", parameters: {}, reply: "Redirecting you to our latest arrivals." };
  }
  if (query.includes("trend") || query.includes("popular")) {
    return { intent: "SHOW_TRENDING_PRODUCTS", parameters: {}, reply: "Redirecting you to our trending curation." };
  }
  if (query.includes("collection") || query.includes("lookbook")) {
    return { intent: "SHOW_COLLECTIONS", parameters: {}, reply: "Redirecting you to our curated collections lookbooks." };
  }
  if (query.includes("settings")) {
    return { intent: "SHOW_SETTINGS", parameters: {}, reply: "Opening your Maison Settings dashboard." };
  }
  if (query.includes("coupon") || query.includes("promo")) {
    return { intent: "SHOW_COUPONS", parameters: {}, reply: "Opening your available coupons." };
  }
  if (query.includes("order") || query.includes("track")) {
    return { intent: "SHOW_ORDERS", parameters: {}, reply: "Opening your Maison Orders Tracker." };
  }
  if (query.includes("wallet") || query.includes("balance")) {
    return { intent: "SHOW_WALLET_BALANCE", parameters: {}, reply: "Opening your Wallet Balance." };
  }
  if (query.includes("address") || query.includes("delivery")) {
    return { intent: "SHOW_ADDRESSES", parameters: {}, reply: "Opening your Delivery Points details." };
  }
  if (query.includes("profile") || query.includes("account")) {
    return { intent: "SHOW_PROFILE", parameters: {}, reply: "Opening your Boutique Profile." };
  }

  // 5. Default fallback: search products if it looks like a search query, else conversational fallback
  const productKeywords = ["show", "find", "search", "buy", "product", "dress", "shirt", "cape", "corset", "gown", "trench", "heel", "trouser", "top", "pant", "skirt", "jacket", "coat", "suit", "shoes", "wear", "outfit", "style", "mens", "womens", "collection", "look"];
  const containsProductKeyword = productKeywords.some(kw => query.includes(kw));

  if (containsProductKeyword || query.length < 20) {
    return {
      intent: "SEARCH_PRODUCTS",
      parameters: { searchQuery: message },
      reply: `Redirecting you to our curated collections matching: "${message}".`
    };
  }

  return {
    intent: "CHAT_FALLBACK",
    parameters: {},
    reply: "I understand. I can help you with product curation, managing your cart/wishlist, or updating your profile. Could you please specify how I can assist you with your wardrobe or shopping experience?"
  };
}
