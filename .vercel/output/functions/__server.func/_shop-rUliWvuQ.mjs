import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { u as usePortal, a as useCartTotal, Q as QuickAddContext, S as ShopNotificationContext, B as BrandLogo, T as ThemeToggle, b as useTheme } from "./_ssr/router-CgqY8r00.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/maplibre-gl.mjs";
import { S as Search, a1 as User, f as ShoppingBag, B as Bell, X, a2 as Minus, P as Plus, n as Sparkles, a3 as MessageCircleCode, a4 as Award, G as ShieldAlert, g as MapPin, W as Wallet, A as ArrowRight, a5 as Send } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "node:fs";
import "node:path";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/framer-motion.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/zod.mjs";
async function queryGeminiAssistant(message, history, stateContext) {
  const productsCtx = stateContext.products.map((p) => `ID: ${p.id}, Name: ${p.name}, Brand/House: ${p.house || p.brand || ""}, Price: ${p.price}, OriginalPrice: ${p.originalPrice || ""}, Categories: ${JSON.stringify(p.categories || [])}, Category: ${p.category || ""}, Gender: ${p.gender || ""}, CustomTags: ${JSON.stringify(p.tags || [])}, Colors: ${p.colors || p.color || ""}, FabricMaterial: ${p.fabricMaterial || p.fabric || ""}, Sizes: ${JSON.stringify(p.sizes || [])}, StockPerSize: ${JSON.stringify(p.stockPerSize || {})}`).join("\n");
  `You are the premium personal AI Shopping Concierge for "ReeVibes".
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
  [
    ...history.map((h) => ({
      role: h.role === "model" ? "model" : "user",
      parts: [{ text: h.content }]
    })),
    {
      role: "user",
      parts: [{ text: message }]
    }
  ];
  const backendUrl = "http://localhost:8081/api/ai/chat";
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
function localFallbackParser(message) {
  const query = message.toLowerCase().replace(/['’]s\b/g, "");
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "namaste"];
  if (greetings.some((g) => query === g || query.startsWith(g + " "))) {
    return {
      intent: "GREETING",
      parameters: {},
      reply: "Hello! I am your Maison Concierge. How may I assist your style curation today? You can ask me to view your cart, check your wishlist, toggle dark mode, or search for specific products."
    };
  }
  const gratitude = ["thank you", "thanks", "appreciate it", "awesome", "great"];
  if (gratitude.some((g) => query.includes(g))) {
    return {
      intent: "GRATITUDE",
      parameters: {},
      reply: "It is my absolute pleasure. Let me know if you need help with anything else!"
    };
  }
  const help = ["help", "what can you do", "features", "how to use"];
  if (help.some((h) => query.includes(h))) {
    return {
      intent: "HELP",
      parameters: {},
      reply: "I am your personal Styling & Shopping Concierge. You can ask me to:\n- Show your cart or wishlist\n- Search for products (e.g. 'find red dress')\n- Filter products by gender (e.g. 'show men's clothes')\n- Change theme to dark or light mode\n- Check your wallet balance"
    };
  }
  const isConversational = ["who are you", "what is your name", "how are you", "what's up"].some((q) => query.includes(q));
  if (isConversational) {
    return {
      intent: "CONVERSATION",
      parameters: {},
      reply: "I am the Maison Concierge, your dedicated AI styling assistant at ReeVibes. I'm here to help you navigate our luxury collections."
    };
  }
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
  const productKeywords = ["show", "find", "search", "buy", "product", "dress", "shirt", "cape", "corset", "gown", "trench", "heel", "trouser", "top", "pant", "skirt", "jacket", "coat", "suit", "shoes", "wear", "outfit", "style", "mens", "womens", "collection", "look"];
  const containsProductKeyword = productKeywords.some((kw) => query.includes(kw));
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
function AssistantWindow({ isOpen, onClose }) {
  const {
    state,
    addToShopCart,
    removeFromShopCart,
    clearShopCart,
    toggleShopWishlist,
    addAddress,
    removeAddress,
    setMajorAddress,
    createOrder,
    addWalletCredit,
    updateUser,
    addReview
  } = usePortal();
  const { shopTotal } = useCartTotal();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [messages, setMessages] = reactExports.useState([
    {
      id: "welcome",
      role: "model",
      content: "Good day. Welcome to Maison ReeVibes. I am your personal Styling & Shopping Concierge. How may I assist your style curation today?"
    }
  ]);
  const [inputValue, setInputValue] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  const user = state.user;
  const userAddresses = user ? state.addresses[user.id] || [] : [];
  const primaryAddress = user ? state.majorAddresses[user.id] || "" : "";
  const walletBalance = user ? state.wallets[user.id] || 0 : 0;
  const userWishlist = user ? state.shopWishlist[user.id] || [] : [];
  const userOrders = user ? state.orders[user.id] || [] : [];
  const userNotifications = state.notifications || [];
  const suggestions = [
    "Build a summer wedding outfit",
    "Buy the cheapest item in my wishlist",
    "Remove all women's products",
    "Apply best coupon",
    "Change my name to Sree",
    "Show available coupons"
  ];
  const parsePrice = (priceStr) => {
    return Number(priceStr.replace(/[^0-9.]/g, ""));
  };
  const handleIntentExecution = (response) => {
    const { intent, parameters } = response;
    if (!user && [
      "ADD_TO_CART",
      "ADD_TO_WISHLIST",
      "SHOW_CART",
      "SHOW_WISHLIST",
      "SHOW_ADDRESSES",
      "SHOW_PRIMARY_ADDRESS",
      "ADD_ADDRESS",
      "DELETE_ADDRESS",
      "SET_PRIMARY_ADDRESS",
      "SHOW_WALLET",
      "SHOW_WALLET_BALANCE",
      "SHOW_WALLET_TRANSACTIONS",
      "SHOW_PROFILE",
      "SHOW_ACCOUNT_OVERVIEW",
      "UPDATE_PROFILE",
      "UPDATE_NAME",
      "UPDATE_EMAIL",
      "UPDATE_PHONE",
      "SHOW_ORDERS",
      "TRACK_ORDER",
      "TRACK_LATEST_ORDER",
      "REORDER_LAST_ORDER",
      "CREATE_RETURN_REQUEST",
      "SHOW_RETURN_STATUS",
      "SHOW_REFUND_STATUS",
      "SHOW_MY_REVIEWS",
      "ADD_REVIEW",
      "SHOW_SETTINGS",
      "CHECKOUT_CART",
      "CHECKOUT_MENS_PRODUCTS",
      "CHECKOUT_WOMENS_PRODUCTS",
      "PROCEED_TO_PAYMENT"
    ].includes(intent)) {
      return {
        cardType: "auth_required",
        message: "To manage your personalized luxury boutique experience, please sign in first."
      };
    }
    switch (intent) {
      case "SWITCH_DARK_MODE":
        setTheme("dark");
        return { cardType: "info_success", text: "Noir Dark Mode activated." };
      case "SWITCH_LIGHT_MODE":
        setTheme("light");
        return { cardType: "info_success", text: "Boutique Light Mode activated." };
      case "SHOW_PROFILE":
      case "SHOW_ACCOUNT_OVERVIEW":
        navigate({ to: "/account", search: { tab: "profile" } });
        return { cardType: "profile", user };
      case "SHOW_SETTINGS":
        navigate({ to: "/account", search: { tab: "settings" } });
        return { cardType: "info_success", text: "Opening your Maison Settings dashboard." };
      case "UPDATE_PROFILE":
      case "UPDATE_NAME":
      case "UPDATE_EMAIL":
      case "UPDATE_PHONE":
        if (user) {
          const patch = {};
          if (parameters.firstName) patch.firstName = parameters.firstName;
          if (parameters.lastName) patch.lastName = parameters.lastName;
          if (parameters.email) patch.email = parameters.email;
          if (parameters.phone) patch.phone = parameters.phone;
          if (parameters.country) patch.country = parameters.country;
          updateUser(user.id, patch);
          return { cardType: "info_success", text: "Profile details updated successfully." };
        }
        return null;
      case "SHOW_CART":
      case "CALCULATE_CART_TOTAL":
        navigate({ to: "/cart" });
        return { cardType: "cart_summary", cart: state.shopCart, total: shopTotal };
      case "ADD_TO_CART": {
        const prod = state.products.find((p) => p.id === parameters.productId || p.name.toLowerCase().includes((parameters.productName || "").toLowerCase()));
        if (prod) {
          const size = parameters.selectedSize || "M";
          const qty = parameters.qty || 1;
          addToShopCart({
            productId: prod.id,
            name: prod.name,
            house: prod.house,
            price: prod.price,
            image: prod.image,
            selectedSize: size,
            qty
          });
          return { cardType: "added_to_cart", product: prod, size, qty };
        }
        return null;
      }
      case "REMOVE_FROM_CART":
        if (parameters.productId) {
          removeFromShopCart(parameters.productId, parameters.selectedSize);
          return { cardType: "cart_summary", cart: state.shopCart.filter((c) => c.productId !== parameters.productId), total: shopTotal };
        }
        return null;
      case "REMOVE_PRODUCTS_BY_GENDER":
        if (parameters.gender) {
          const toRemove = state.shopCart.filter((item) => {
            const prod = state.products.find((p) => p.id === item.productId);
            return prod?.gender === parameters.gender;
          });
          toRemove.forEach((item) => removeFromShopCart(item.productId, item.selectedSize));
          return { cardType: "info_success", text: `Removed all ${parameters.gender} products from your cart.` };
        }
        return null;
      case "CLEAR_CART":
        clearShopCart();
        return { cardType: "info_success", text: "Your shopping cart has been cleared." };
      case "SHOW_WISHLIST":
        navigate({ to: "/account", search: { tab: "wishlist" } });
        return { cardType: "wishlist_summary", items: state.products.filter((p) => userWishlist.includes(p.id)) };
      case "MOVE_ALL_TO_CART":
        if (user) {
          userWishlist.forEach((pId) => {
            const prod = state.products.find((p) => p.id === pId);
            if (prod) {
              addToShopCart({
                productId: prod.id,
                name: prod.name,
                house: prod.house,
                price: prod.price,
                image: prod.image,
                selectedSize: "M",
                qty: 1
              });
            }
          });
          return { cardType: "info_success", text: "Moved all wishlist items to your shopping cart." };
        }
        return null;
      case "SHOW_ADDRESSES":
      case "SHOW_PRIMARY_ADDRESS":
        navigate({ to: "/account", search: { tab: "addresses" } });
        return { cardType: "addresses", list: userAddresses, primary: primaryAddress };
      case "ADD_ADDRESS":
        if (parameters.address && user) {
          let addressVal = parameters.address;
          if (typeof addressVal === "object" && addressVal !== null) {
            const { name, phone, pincode, streetAddress, addressLine, district, state: state2 } = addressVal;
            const line = streetAddress || addressLine || "";
            addressVal = `${name ? name + ", " : ""}${phone ? "Phone: " + phone + ", " : ""}${line ? line + ", " : ""}${district ? district + ", " : ""}${state2 ? state2 + " - " : ""}${pincode ? pincode : ""}`.trim();
            if (addressVal.endsWith(",")) {
              addressVal = addressVal.substring(0, addressVal.length - 1);
            }
          }
          addAddress(user.id, addressVal);
          return { cardType: "info_success", text: "Address added successfully." };
        }
        return null;
      case "DELETE_ADDRESS":
        if (parameters.index !== void 0 && user) {
          removeAddress(user.id, Number(parameters.index));
          return { cardType: "info_success", text: "Address deleted successfully." };
        }
        return null;
      case "SET_PRIMARY_ADDRESS":
        if (parameters.address && user) {
          let addressVal = parameters.address;
          if (typeof addressVal === "object" && addressVal !== null) {
            const { name, phone, pincode, streetAddress, addressLine, district, state: state2 } = addressVal;
            const line = streetAddress || addressLine || "";
            addressVal = `${name ? name + ", " : ""}${phone ? "Phone: " + phone + ", " : ""}${line ? line + ", " : ""}${district ? district + ", " : ""}${state2 ? state2 + " - " : ""}${pincode ? pincode : ""}`.trim();
            if (addressVal.endsWith(",")) {
              addressVal = addressVal.substring(0, addressVal.length - 1);
            }
          }
          setMajorAddress(user.id, addressVal);
          return { cardType: "info_success", text: "Primary address set successfully." };
        }
        return null;
      case "SHOW_WALLET_BALANCE":
      case "SHOW_WALLET_TRANSACTIONS":
        navigate({ to: "/account", search: { tab: "wallet" } });
        return { cardType: "wallet", balance: walletBalance };
      case "SHOW_COUPONS":
        navigate({ to: "/account", search: { tab: "coupons" } });
        return { cardType: "coupons", coupons: state.coupons };
      case "APPLY_BEST_COUPON": {
        const best = state.coupons.reduce((max, c) => c.discount > max.discount ? c : max, state.coupons[0]);
        return { cardType: "info_success", text: `Best coupon found: ${best.code} (${best.discount}% discount). I will apply it at checkout.` };
      }
      case "APPLY_COUPON":
        if (parameters.couponCode) {
          const match = state.coupons.find((c) => c.code.toUpperCase() === parameters.couponCode.toUpperCase());
          if (match) {
            return { cardType: "info_success", text: `Coupon ${match.code} applied successfully.` };
          }
          return { cardType: "info_error", text: "Coupon code invalid or expired." };
        }
        return null;
      case "SHOW_ORDERS":
        navigate({ to: "/account", search: { tab: "orders" } });
        return { cardType: "orders", orders: userOrders };
      case "SHOW_RETURN_STATUS":
      case "SHOW_REFUND_STATUS":
        navigate({ to: "/account", search: { tab: "returns" } });
        return { cardType: "info_success", text: "Opening your Returns & Refunds overview." };
      case "TRACK_LATEST_ORDER":
        if (userOrders.length > 0) {
          return { cardType: "track_order", order: userOrders[0] };
        }
        return { cardType: "info_error", text: "No orders found." };
      case "CHECKOUT_CART":
      case "PROCEED_TO_PAYMENT":
        if (state.shopCart.length === 0) {
          return { cardType: "info_error", text: "Your cart is empty." };
        }
        return {
          cardType: "checkout_confirm",
          cart: state.shopCart,
          total: shopTotal,
          address: primaryAddress || userAddresses[0] || "",
          balance: walletBalance
        };
      case "CHECKOUT_MENS_PRODUCTS": {
        const mensItems = state.shopCart.filter((item) => {
          const prod = state.products.find((p) => p.id === item.productId);
          return prod?.gender === "Men";
        });
        if (mensItems.length === 0) {
          return { cardType: "info_error", text: "There are no men's products in your shopping cart." };
        }
        const mensTotal = mensItems.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
        return {
          cardType: "checkout_confirm",
          cart: mensItems,
          total: mensTotal,
          address: primaryAddress || userAddresses[0] || "",
          balance: walletBalance
        };
      }
      case "CHECKOUT_WOMENS_PRODUCTS": {
        const womensItems = state.shopCart.filter((item) => {
          const prod = state.products.find((p) => p.id === item.productId);
          return prod?.gender === "Women";
        });
        if (womensItems.length === 0) {
          return { cardType: "info_error", text: "There are no women's products in your shopping cart." };
        }
        const womensTotal = womensItems.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
        return {
          cardType: "checkout_confirm",
          cart: womensItems,
          total: womensTotal,
          address: primaryAddress || userAddresses[0] || "",
          balance: walletBalance
        };
      }
      // --- SMART SHOPPING & FASHION AI INTENTS ---
      case "SEARCH_PRODUCTS":
        navigate({ to: "/categories", search: { q: parameters.searchQuery || "" } });
        return { cardType: "info_success", text: `Searching for "${parameters.searchQuery}" in our collections.` };
      case "FILTER_BY_GENDER":
        navigate({ to: "/categories", search: { gender: parameters.gender } });
        return { cardType: "info_success", text: `Filtering collections for ${parameters.gender}.` };
      case "SHOW_NEW_ARRIVALS":
        navigate({ to: "/categories", search: { tag: "New Arrivals" } });
        return { cardType: "info_success", text: "Showing our latest arrivals." };
      case "SHOW_TRENDING_PRODUCTS":
        navigate({ to: "/categories", search: { tag: "Trending" } });
        return { cardType: "info_success", text: "Showing our trending statements." };
      case "SHOW_COLLECTIONS":
        navigate({ to: "/categories", search: { view: "collections" } });
        return { cardType: "info_success", text: "Showing curated lookbooks." };
      case "SHOW_ALL_PRODUCTS":
        navigate({ to: "/categories" });
        return { cardType: "info_success", text: "Showing all collections." };
      case "BUY_CHEAPEST_PRODUCT_IN_CART": {
        if (state.shopCart.length === 0) return { cardType: "info_error", text: "Your cart is empty." };
        const cheapest = state.shopCart.reduce((min, item) => parsePrice(item.price) < parsePrice(min.price) ? item : min, state.shopCart[0]);
        return {
          cardType: "checkout_confirm",
          cart: [cheapest],
          total: parsePrice(cheapest.price) * cheapest.qty,
          address: primaryAddress || userAddresses[0] || "",
          balance: walletBalance
        };
      }
      case "BUY_CHEAPEST_PRODUCT_IN_WISHLIST": {
        const wishlistProducts = state.products.filter((p) => userWishlist.includes(p.id));
        if (wishlistProducts.length === 0) return { cardType: "info_error", text: "Your wishlist is empty." };
        const cheapest = wishlistProducts.reduce((min, p) => parsePrice(p.price) < parsePrice(min.price) ? p : min, wishlistProducts[0]);
        addToShopCart({
          productId: cheapest.id,
          name: cheapest.name,
          house: cheapest.house,
          price: cheapest.price,
          image: cheapest.image,
          selectedSize: "M",
          qty: 1
        });
        return {
          cardType: "checkout_confirm",
          cart: [{ productId: cheapest.id, name: cheapest.name, house: cheapest.house, price: cheapest.price, image: cheapest.image, selectedSize: "M", qty: 1 }],
          total: parsePrice(cheapest.price),
          address: primaryAddress || userAddresses[0] || "",
          balance: walletBalance
        };
      }
      case "BUILD_COMPLETE_OUTFIT": {
        const searchQ = parameters.occasion ? `${parameters.occasion} outfit` : "outfit";
        navigate({ to: "/categories", search: { q: searchQ } });
        return {
          cardType: "info_success",
          text: `I have curated look recommendations for "${parameters.occasion || "your occasion"}" on our Fashion page.`
        };
      }
      case "SUGGEST_MATCHING_PRODUCTS": {
        const prod = state.products.find((p) => p.id === parameters.productId);
        const searchQ = prod ? `${prod.category} matching ${prod.name}` : "Matching products";
        navigate({ to: "/categories", search: { q: searchQ } });
        return {
          cardType: "info_success",
          text: `Curating matching statement pieces for you on our Fashion page.`
        };
      }
      case "BLOCKED":
        return { cardType: "blocked_scope" };
      default:
        return null;
    }
  };
  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;
    const userMsg = { id: `msg-${Date.now()}`, role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    const ctxPayload = {
      user,
      cart: state.shopCart,
      wishlist: userWishlist,
      addresses: userAddresses,
      coupons: state.coupons,
      products: state.products,
      orders: userOrders,
      walletBalance,
      notifications: userNotifications
    };
    const historyContext = messages.slice(-4).map((m) => ({
      role: m.role,
      content: m.content
    }));
    try {
      const response = await queryGeminiAssistant(textToSend, historyContext, ctxPayload);
      const cardData = handleIntentExecution(response);
      const assistantMsg = {
        id: `msg-${Date.now()}`,
        role: "model",
        content: response.reply,
        intent: response.intent,
        cardData
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      toast.error("Failed to connect with AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheckoutConfirm = (address, total) => {
    if (!user) return;
    createOrder(user.id, {
      items: state.shopCart,
      total,
      address
    });
    toast.success("Order Placed Successfully!");
    setMessages((prev) => [
      ...prev,
      {
        id: `ord-success-${Date.now()}`,
        role: "model",
        content: "Congratulations. Your order has been placed successfully. A style confirmation summary was dispatched to your email address."
      }
    ]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `ai-assistant-window ${isOpen ? "open" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-reflection" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-accent/20 bg-black/10 dark:bg-white/5 relative z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-accent/25 flex items-center justify-center border border-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-5 h-5 text-accent animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-base font-bold text-foreground tracking-wide", children: "Maison Concierge" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-accent font-bold", children: "ReeVibes Premium AI" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4.5 h-4.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-5 space-y-4 relative z-20 scrollbar-thin", children: [
      messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed ${msg.role === "user" ? "bg-accent text-white rounded-tr-none shadow-[0_4px_12px_rgba(212,175,55,0.25)] font-semibold" : "bg-foreground/5 text-foreground rounded-tl-none border border-border-subtle"}`,
            children: msg.content
          }
        ),
        msg.cardData && ["cart_summary", "blocked_scope", "checkout_confirm", "outfit_curation", "wallet", "profile"].includes(msg.cardData.cardType) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 w-full max-w-[90%] bg-background/80 dark:bg-black/40 border border-accent/30 rounded-2xl p-4 space-y-3 shadow-lg", children: [
          msg.cardData.cardType === "cart_summary" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-wider text-accent font-bold flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-3.5 h-3.5" }),
              " Shopping Bag"
            ] }),
            msg.cardData.cart.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Your bag is currently empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-24 overflow-y-auto space-y-1.5", children: msg.cardData.cart.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  item.name,
                  " (",
                  item.selectedSize,
                  ") x ",
                  item.qty
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent", children: item.price })
              ] }, idx)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle pt-2 flex justify-between text-xs font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
                  "₹",
                  msg.cardData.total.toLocaleString()
                ] })
              ] })
            ] })
          ] }),
          msg.cardData.cardType === "blocked_scope" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-center py-2 text-rose-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-7 h-7 mx-auto text-rose-400 mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "Restricted Operation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Maison Concierge is restricted from altering admin, vendor, or contest data." })
          ] }),
          msg.cardData.cardType === "checkout_confirm" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold border-b border-accent/20 pb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent" }),
              " Complete Couture Purchase"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-24 overflow-y-auto space-y-1 border-b border-border-subtle pb-2", children: msg.cardData.cart.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  item.name,
                  " (x",
                  item.qty,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: item.price })
              ] }, idx)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                  "₹",
                  msg.cardData.total.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col bg-foreground/5 p-2 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-accent" }),
                  " Delivery Address"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate mt-0.5", children: msg.cardData.address || "No address saved" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-accent/10 p-2 rounded-xl text-accent border border-accent/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-3.5 h-3.5" }),
                  " Wallet Balance:"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                  "₹",
                  msg.cardData.balance.toLocaleString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleCheckoutConfirm(msg.cardData.address, msg.cardData.total),
                className: "w-full py-2.5 bg-accent hover:bg-accent/80 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                children: [
                  "Confirm and Pay ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5" })
                ]
              }
            )
          ] }),
          msg.cardData.cardType === "outfit_curation" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold flex items-center gap-1.5 text-accent border-b border-accent/20 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
              " Custom Curation: ",
              msg.cardData.occasion
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: msg.cardData.items.map((prod) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center bg-foreground/5 p-2 rounded-xl border border-border-subtle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: prod.image, className: "w-9 h-11 object-cover rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold truncate", children: prod.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-muted-foreground", children: prod.house })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold text-accent", children: prod.price })
            ] }, prod.id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-bold border-t border-border-subtle pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Look Cost:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
                "₹",
                msg.cardData.totalCost.toLocaleString()
              ] })
            ] })
          ] }),
          msg.cardData.cardType === "wallet" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-center py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-8 h-8 mx-auto text-accent mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Wallet Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-serif font-bold text-foreground", children: [
              "₹",
              msg.cardData.balance.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  addWalletCredit(user.id, 5e3);
                  toast.success("Credited ₹5,000 to wallet");
                },
                className: "text-[10px] text-accent underline cursor-pointer bg-transparent border-none outline-none font-bold",
                children: "+ Topup ₹5,000 demo credit"
              }
            )
          ] }),
          msg.cardData.cardType === "profile" && msg.cardData.user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-accent font-bold border-b border-border-subtle pb-1", children: "Boutique Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Name: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                msg.cardData.user.firstName || "",
                " ",
                msg.cardData.user.lastName || ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Email: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: msg.cardData.user.email || "" })
            ] }),
            msg.cardData.user.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Phone: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: msg.cardData.user.phone })
            ] })
          ] })
        ] })
      ] }, msg.id)),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-foreground/5 border border-border-subtle rounded-3xl rounded-tl-none p-4 text-xs text-muted-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-150" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-300" })
        ] }),
        "Concierge is thinking..."
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-2 flex gap-2 overflow-x-auto scrollbar-none border-t border-border-subtle bg-black/5 dark:bg-white/5 relative z-20", children: suggestions.map((chip, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => handleSendMessage(chip),
        className: "whitespace-nowrap text-[10px] uppercase tracking-wider bg-foreground/5 hover:bg-accent hover:text-white border border-border-subtle rounded-full py-1.5 px-3.5 transition-all text-foreground cursor-pointer",
        children: chip
      },
      idx
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-t border-accent/20 bg-background/90 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        },
        className: "flex items-center gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              disabled: isLoading,
              placeholder: "Type your styling request…",
              className: "flex-1 bg-foreground/5 border border-border-subtle pl-4 pr-3 py-3 rounded-full text-xs outline-none focus:border-accent transition-all text-foreground placeholder:text-muted-foreground/50",
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: !inputValue.trim() || isLoading,
              className: "w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 cursor-pointer",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
            }
          )
        ]
      }
    ) })
  ] });
}
function AssistantLauncher() {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "ai-assistant-launcher",
        onClick: () => setIsOpen(!isOpen),
        title: "Open Styling Concierge",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ai-assistant-pulse" }),
          isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-accent animate-spin-slow" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircleCode, { className: "w-6 h-6 text-accent" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AssistantWindow, { isOpen, onClose: () => setIsOpen(false) })
  ] });
}
function useQuickAdd() {
  const ctx = reactExports.useContext(QuickAddContext);
  if (!ctx) throw new Error("useQuickAdd must be used inside QuickAddProvider");
  return ctx;
}
function useShopNotification() {
  const ctx = reactExports.useContext(ShopNotificationContext);
  if (!ctx) throw new Error("useShopNotification must be used inside ShopNotificationProvider");
  return ctx;
}
function LiveCountdown({
  endsAt,
  onComplete
}) {
  const [timeLeft, setTimeLeft] = reactExports.useState("");
  const onCompleteRef = reactExports.useRef(onComplete);
  const hasCompleted = reactExports.useRef(false);
  reactExports.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  reactExports.useEffect(() => {
    const calculateTime = () => {
      const target = new Date(endsAt).getTime();
      if (isNaN(target)) {
        setTimeLeft("");
        return;
      }
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft("00H 00M 00S");
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onCompleteRef.current?.();
        }
        return;
      }
      const totalSecs = Math.floor(diff / 1e3);
      const days = Math.floor(totalSecs / (3600 * 24));
      const hours = Math.floor(totalSecs % (3600 * 24) / 3600);
      const minutes = Math.floor(totalSecs % 3600 / 60);
      const seconds = totalSecs % 60;
      const pad = (num) => String(num).padStart(2, "0");
      let formatted = "";
      if (days > 0) {
        formatted += `${days}D `;
      }
      formatted += `${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`;
      setTimeLeft(formatted);
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1e3);
    return () => clearInterval(interval);
  }, [endsAt]);
  if (!timeLeft) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 font-mono bg-black/20 px-2.5 py-0.5 rounded text-[9px]", children: timeLeft });
}
function ShopLayout() {
  const {
    state,
    toggleShopWishlist,
    removeFromShopCart,
    updateHomepageLayout,
    updateHomepageLayoutDraft,
    addToShopCart,
    markNotificationsRead,
    dismissNotification
  } = usePortal();
  const {
    shopCount
  } = useCartTotal();
  useNavigate();
  const [quickAddProduct, setQuickAddProduct] = reactExports.useState(null);
  const [activeFooterPopup, setActiveFooterPopup] = reactExports.useState(null);
  const [showNotifications, setShowNotifications] = reactExports.useState(false);
  const notifRef = reactExports.useRef(null);
  const [popup, setPopup] = reactExports.useState({
    visible: false,
    message: "",
    undo: () => {
    },
    undoMessage: "",
    redo: () => {
    },
    redoMessage: "",
    isUndoState: false
  });
  const popupTimerRef = reactExports.useRef(null);
  const triggerPopup = (message, undo, undoMessage, redo, redoMessage) => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    setPopup({
      visible: true,
      message,
      undo,
      undoMessage,
      redo,
      redoMessage,
      isUndoState: false
    });
    popupTimerRef.current = setTimeout(() => {
      setPopup((prev) => ({
        ...prev,
        visible: false
      }));
    }, 2e3);
  };
  const handleUndoClick = () => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popup.undo();
    setPopup((prev) => ({
      ...prev,
      message: prev.undoMessage,
      isUndoState: true
    }));
    popupTimerRef.current = setTimeout(() => {
      setPopup((prev) => ({
        ...prev,
        visible: false
      }));
    }, 2e3);
  };
  const handleRedoClick = () => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popup.redo();
    setPopup((prev) => ({
      ...prev,
      message: prev.redoMessage,
      isUndoState: false
    }));
    popupTimerRef.current = setTimeout(() => {
      setPopup((prev) => ({
        ...prev,
        visible: false
      }));
    }, 2e3);
  };
  const openQuickAdd = (product) => {
    setQuickAddProduct(product);
  };
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showSuggestions, setShowSuggestions] = reactExports.useState(false);
  const searchRef = reactExports.useRef(null);
  const products = (state.products || []).filter((p) => !p.status || p.status === "PUBLISHED" || p.status === "published");
  const suggestions = searchQuery.trim() ? products.filter((p) => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (p.house || "").toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) : [];
  reactExports.useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      window.open(`/search?q=${encodeURIComponent(searchQuery.trim())}`, "_blank");
    }
  };
  state.user;
  const unreadNotifCount = state.notifications.filter((n) => n.unread).length;
  const twoDaysMs = 2 * 24 * 3600 * 1e3;
  const visibleNotifications = (state.notifications || []).filter((n) => {
    if (n.createdAt) {
      return Date.now() - n.createdAt < twoDaysMs;
    }
    const lowerTime = (n.time || "").toLowerCase();
    if (lowerTime.includes("3d") || lowerTime.includes("4d") || lowerTime.includes("5d") || lowerTime.includes("2 days") || lowerTime.includes("3 days")) {
      return false;
    }
    return true;
  });
  const isPreview = typeof window !== "undefined" && window.location.search.includes("preview=true");
  const layout = isPreview ? state.homepageLayoutDraft : state.homepageLayout;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAddContext.Provider, { value: {
    openQuickAdd
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ShopNotificationContext.Provider, { value: {
    triggerPopup
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-portal-layout min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300", children: [
      layout?.announcement?.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        backgroundColor: layout.announcement.backgroundColor
      }, className: "w-full text-center py-2.5 text-[10px] font-semibold tracking-widest uppercase text-white animate-in slide-in-from-top-2 duration-300 sticky top-0 z-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: layout.announcement.linkUrl, className: "hover:underline", children: layout.announcement.text }),
        layout.announcement.countdownActive && /* @__PURE__ */ jsxRuntimeExports.jsx(LiveCountdown, { endsAt: layout.announcement.countdownEndsAt, onComplete: () => {
          if (isPreview) {
            updateHomepageLayoutDraft({
              announcement: {
                ...layout.announcement,
                enabled: false
              }
            });
          } else {
            updateHomepageLayout({
              announcement: {
                ...layout.announcement,
                enabled: false
              }
            });
          }
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 lg:px-8 pt-4 sticky top-10 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "liquid-glass-header liquid-glass h-20 px-6 lg:px-12 flex items-center justify-between rounded-full border border-white/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-10", children: [
          layout?.navigation?.visibleItems?.includes("Logo") !== false && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "w-28 h-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[7px] uppercase tracking-[0.25em] text-muted-foreground mt-1", children: "House of Fashion" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-semibold text-foreground/85", children: layout?.navigation?.itemsOrder ? layout.navigation.itemsOrder.map((item) => {
            const isVisible = layout.navigation.visibleItems.includes(item);
            if (!isVisible || item === "Logo" || ["Search", "Wishlist", "Account", "Cart"].includes(item)) return null;
            if (item === "Men") return null;
            if (item === "Women") {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", className: "hover:text-accent transition-colors", children: "Fashion" }, item);
            }
            if (item === "Collections") {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", search: {
                view: "collections"
              }, className: "hover:text-accent transition-colors", children: item }, item);
            }
            let linkSearch = {};
            if (item === "New Arrivals") linkSearch = {
              tag: "New"
            };
            else if (item === "Trending") linkSearch = {
              tag: "Trending"
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", search: linkSearch, className: "hover:text-accent transition-colors", children: item }, item);
          }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-accent transition-colors", children: "Shop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", className: "hover:text-accent transition-colors", children: "Collections" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/live-contest", className: "hover:text-accent transition-colors", children: "Contests" })
          ] }) })
        ] }),
        (!layout || layout.navigation.visibleItems.includes("Search")) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: searchRef, className: "relative max-w-md w-full mx-6 hidden md:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "relative flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search luxury fashion curation…", className: "w-full bg-white/5 dark:bg-white/5 border border-white/10 pl-12 pr-4 py-2.5 rounded-full text-xs outline-none focus:border-accent focus:bg-white/10 transition-all placeholder:text-muted-foreground/50 text-foreground", value: searchQuery, onChange: (e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }, onFocus: () => setShowSuggestions(true) })
          ] }),
          showSuggestions && (searchQuery.trim() || suggestions.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 mt-3 bg-background/95 backdrop-blur-xl border border-white/10 dark:border-white/10 p-5 space-y-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 rounded-3xl", children: suggestions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-2", children: "Product Matches" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: suggestions.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/product/$productId", params: {
              productId: p.id
            }, onClick: () => setShowSuggestions(false), className: "flex items-center gap-3 p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "w-8 h-10 object-cover rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-foreground", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: p.house })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto text-xs text-accent font-semibold", children: p.price })
            ] }, p.id)) })
          ] }) : searchQuery.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => {
            setShowSuggestions(false);
            window.open(`/search?q=${encodeURIComponent(searchQuery.trim())}`, "_blank");
          }, className: "text-xs text-muted-foreground py-2 hover:text-accent cursor-pointer transition-colors", children: "No direct products match. Click here or press Enter to search curation." }) : null })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
          (!layout || layout.navigation.visibleItems.includes("Account")) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group/account py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", search: {
              tab: "profile"
            }, className: "relative text-foreground/75 hover:text-foreground p-2 block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4.5 h-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 -translate-x-1/2 top-full mt-1 w-52 bg-background/95 backdrop-blur-xl border border-accent/20 rounded-3xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 opacity-0 pointer-events-none group-hover/account:opacity-100 group-hover/account:pointer-events-auto transition-all duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [{
              tab: "profile",
              label: "Profile"
            }, {
              tab: "orders",
              label: "My Orders"
            }, {
              tab: "wishlist",
              label: "Wishlist Curation"
            }, {
              tab: "coupons",
              label: "Maison Coupons"
            }, {
              tab: "addresses",
              label: "Address"
            }, {
              tab: "returns",
              label: "Returns & Refunds"
            }, {
              tab: "wallet",
              label: "Wallet"
            }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", search: {
              tab: item.tab
            }, className: "block text-[11px] uppercase tracking-wider font-bold px-3 py-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all", children: item.label }, item.tab)) }) })
          ] }),
          (!layout || layout.navigation.visibleItems.includes("Cart")) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", className: "relative text-foreground/75 hover:text-foreground p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4.5 h-4.5" }),
            shopCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0.5 right-0.5 w-4 h-4 bg-accent text-white rounded-full flex items-center justify-center text-[9px] font-bold", children: shopCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: notifRef, className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setShowNotifications(!showNotifications);
              markNotificationsRead();
            }, className: "relative text-foreground/75 hover:text-foreground p-2 focus:outline-none cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4.5 h-4.5" }),
              unreadNotifCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-accent rounded-full animate-ping" })
            ] }),
            showNotifications && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-3 w-80 bg-background/95 backdrop-blur-xl border border-accent/20 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 animate-in fade-in slide-in-from-top-2 duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-sm font-semibold text-foreground", children: "Notifications" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNotifications(false), className: "text-muted-foreground hover:text-foreground cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-60 overflow-y-auto pr-1", children: visibleNotifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground text-center py-4", children: "No recent notifications." }) : visibleNotifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl flex items-start gap-2.5 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-foreground leading-snug", children: n.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5 leading-normal", children: n.body }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-accent/70 mt-1 font-mono", children: n.time })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => dismissNotification(n.id), className: "text-muted-foreground hover:text-rose-400 p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer", title: "Dismiss notification", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }) })
              ] }, n.id)) })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      !layout || layout.footer.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border-subtle bg-background px-6 lg:px-16 py-16 text-xs text-muted-foreground space-y-8 animate-in fade-in duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold text-foreground text-lg tracking-widest", children: "REEVIBES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "leading-relaxed", children: layout?.footer?.aboutText || "ReeVibes is a high-fidelity luxury e-commerce experience designed for global styling curators." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground font-semibold uppercase tracking-wider", children: "Quick Links" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveFooterPopup("about"), className: "hover:text-accent transition-colors text-left font-semibold cursor-pointer bg-transparent border-none p-0 outline-none", children: "About Us" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveFooterPopup("returns"), className: "hover:text-accent transition-colors text-left font-semibold cursor-pointer bg-transparent border-none p-0 outline-none", children: "Returns & Exchanges" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveFooterPopup("privacy"), className: "hover:text-accent transition-colors text-left font-semibold cursor-pointer bg-transparent border-none p-0 outline-none", children: "Privacy Policy" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveFooterPopup("terms"), className: "hover:text-accent transition-colors text-left font-semibold cursor-pointer bg-transparent border-none p-0 outline-none", children: "Terms of Service" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 font-mono text-[11px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground font-serif font-semibold uppercase tracking-wider not-mono", children: "Concierge Desk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Phone: ",
              layout?.footer?.phone || "+91 98765 43210"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Email: ",
              layout?.footer?.email || "concierge@reevibes.com"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "not-mono text-xs mt-2", children: layout?.footer?.address || "UB City, Level 14, Bangalore, Karnataka - 560001" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border-subtle pt-6 text-center text-[10px]", children: "© 2026 ReeVibes. Designed by Google DeepMind Team. All Rights Reserved." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border-subtle bg-background px-6 lg:px-16 py-8 text-center text-[10px] text-muted-foreground", children: "© 2026 ReeVibes. Designed by Google DeepMind Team. All Rights Reserved." })
    ] }),
    quickAddProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAddModal, { product: quickAddProduct, onClose: () => setQuickAddProduct(null), addToShopCart }),
    activeFooterPopup && /* @__PURE__ */ jsxRuntimeExports.jsx(FooterPopupModal, { type: activeFooterPopup, onClose: () => setActiveFooterPopup(null) }),
    popup.visible && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/20 bg-black/95 text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: popup.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-white/20" }),
      popup.isUndoState ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRedoClick, className: "text-xs font-bold text-accent hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-none p-0 outline-none", children: "Redo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleUndoClick, className: "text-xs font-bold text-accent hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-none p-0 outline-none", children: "Undo" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AssistantLauncher, {})
  ] }) });
}
function FooterPopupModal({
  type,
  onClose
}) {
  const contentMap = {
    about: {
      title: "About Maison ReeVibes",
      subtitle: "ESTABLISHED 2024 · BENGALURU",
      body: "Maison ReeVibes represents the zenith of high-fidelity luxury digital curations. Founded in 2024, our platform bridges the gap between avant-garde runway styling and digital-first pageantry. We curate works from top-tier fashion designers, independent couturiers, and global styling visionaries. Our mission is to democratize high fashion while preserving its pristine artisanal excellence."
    },
    returns: {
      title: "Returns & Exchanges Curation",
      subtitle: "CONCIERGE EXCHANGE POLICY",
      body: "We offer a 14-day complimentary returns concierge service for all unworn, tag-intact garments. To initiate a return, navigate to your Account Portal, select Order History, and request a return. A courier concierge will be scheduled for home pick-up within 48 hours. Refunds are credited directly to your ReeVibes Wallet or original payment method upon standard quality inspections."
    },
    privacy: {
      title: "Privacy & Data Protection",
      subtitle: "SECURE LUXURY TRANSACTION GUARANTEE",
      body: "Maison ReeVibes respects your absolute privacy. All transactions are routed through bank-grade SSL encryption and secure payment gateways. We store only necessary address credentials to optimize your delivery logistics. Your style preferences and viewing histories are parsed exclusively to customize your digital styling feed and are never shared with external advertisers."
    },
    terms: {
      title: "Terms of Couture Service",
      subtitle: "USER ENGAGEMENT & AGREEMENT",
      body: "By accessing Maison ReeVibes, you agree to engage with our portal in accordance with luxury retail etiquettes. All products listed are subject to size-limited availability. Intellectual assets, editorial images, and design configurations remain the exclusive property of Maison ReeVibes. We reserve the right to moderate reviews, adjust member tiers, and suspend accounts failing validation protocols."
    }
  };
  const current = contentMap[type];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-xl overflow-hidden liquid-glass bg-background/90 border border-accent/40 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.25)] p-8 text-foreground animate-in zoom-in-95 duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-6 right-6 p-2 text-muted-foreground hover:text-accent transition-colors rounded-full bg-foreground/5 hover:bg-foreground/10 border border-accent/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] text-accent font-bold", children: current.subtitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl mt-2 text-foreground font-bold tracking-wide border-b border-accent/20 pb-4", children: current.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed font-sans mt-4", children: current.body }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-6 py-2 bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent-foreground transition-all duration-300 shadow-[0_0_12px_rgba(212,175,55,0.3)] border border-accent/20 cursor-pointer", children: "Acknowledge" }) })
    ] })
  ] }) });
}
function QuickAddModal({
  product,
  onClose,
  addToShopCart
}) {
  const {
    removeFromShopCart
  } = usePortal();
  const {
    triggerPopup
  } = useShopNotification();
  const [selectedSize, setSelectedSize] = reactExports.useState(null);
  const [qty, setQty] = reactExports.useState(1);
  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const stockPerSize = product.stockPerSize || {
    S: 5,
    M: 8,
    L: 4,
    XL: 2
  };
  const handleAdd = () => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    const item = {
      productId: product.id,
      name: product.name,
      house: product.house,
      price: product.price,
      image: product.image,
      selectedSize,
      qty
    };
    addToShopCart(item);
    triggerPopup(`${product.name} (${selectedSize} x ${qty}) added to cart!`, () => removeFromShopCart(product.id, selectedSize), `${product.name} (${selectedSize}) removed from cart.`, () => addToShopCart(item), `${product.name} (${selectedSize}) added to cart!`);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-lg overflow-hidden bg-background/95 border border-border-subtle rounded-3xl shadow-2xl p-6 md:p-8 text-foreground animate-in zoom-in-95 duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-foreground/5 hover:bg-foreground/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:w-1/3 aspect-[3/4] bg-foreground/5 rounded-2xl overflow-hidden border border-border-subtle/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-accent font-bold", children: product.house }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl md:text-2xl mt-1 text-foreground font-medium", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-accent font-semibold text-base mt-1", children: product.price })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2", children: "Select Size:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: availableSizes.map((size) => {
            const stock = stockPerSize[size] ?? 0;
            const hasStock = stock > 0;
            const isSelected = selectedSize === size;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !hasStock, onClick: () => setSelectedSize(size), className: `text-xs py-2 px-4 font-bold rounded-full transition-all duration-200 ${!hasStock ? "opacity-30 bg-foreground/5 line-through text-muted-foreground cursor-not-allowed border border-transparent" : isSelected ? "bg-accent text-white border border-accent shadow-[0_0_12px_rgba(212,175,55,0.4)]" : "bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border-subtle"}`, children: size }, size);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2", children: "Quantity:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-border-subtle rounded-full bg-foreground/5 p-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((prev) => Math.max(1, prev - 1)), className: "p-1.5 hover:text-accent transition-colors rounded-full hover:bg-foreground/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-xs font-mono font-bold", children: qty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                const maxStock = selectedSize ? stockPerSize[selectedSize] ?? 10 : 10;
                setQty((prev) => Math.min(maxStock, prev + 1));
              }, className: "p-1.5 hover:text-accent transition-colors rounded-full hover:bg-foreground/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }) })
            ] }),
            selectedSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              stockPerSize[selectedSize] ?? 0,
              " items available"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 pt-4 border-t border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAdd, disabled: !selectedSize, className: `w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-full transition-all duration-300 shadow-md ${selectedSize ? "bg-foreground text-background hover:bg-accent hover:text-white cursor-pointer" : "bg-foreground/10 text-muted-foreground/50 cursor-not-allowed opacity-50"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
      " Add to Cart"
    ] }) })
  ] }) });
}
export {
  LiveCountdown,
  ShopLayout as component,
  useQuickAdd,
  useShopNotification
};
