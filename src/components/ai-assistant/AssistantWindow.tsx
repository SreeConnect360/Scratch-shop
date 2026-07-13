import { useState, useEffect, useRef } from "react";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { Send, X, ShoppingBag, Heart, Check, Trash2, MapPin, Wallet, ArrowRight, ShieldAlert, Award, Sparkles, Star, Tag } from "lucide-react";
import { queryGeminiAssistant, type AssistantResponse } from "./AssistantService";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import "./assistant.css";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  intent?: string;
  cardData?: any;
}

export default function AssistantWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { 
    state, addToShopCart, removeFromShopCart, clearShopCart, 
    toggleShopWishlist, addAddress, removeAddress, setMajorAddress, 
    createOrder, addWalletCredit, updateUser, addReview 
  } = usePortal();
  const { shopTotal } = useCartTotal();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: "Good day. Welcome to Maison ReeVibes. I am your personal Styling & Shopping Concierge. How may I assist your style curation today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const user = state.user;
  const userAddresses = user ? (state.addresses[user.id] || []) : [];
  const primaryAddress = user ? (state.majorAddresses[user.id] || "") : "";
  const walletBalance = user ? (state.wallets[user.id] || 0) : 0;
  const userWishlist = user ? (state.shopWishlist[user.id] || []) : [];
  const userOrders = user ? (state.orders[user.id] || []) : [];
  const userNotifications = state.notifications || [];

  const suggestions = [
    "Build a summer wedding outfit",
    "Buy the cheapest item in my wishlist",
    "Remove all women's products",
    "Apply best coupon",
    "Change my name to Sree",
    "Show available coupons"
  ];

  // Helper: parse price string (e.g. "₹12,500" -> 12500)
  const parsePrice = (priceStr: string): number => {
    return Number(priceStr.replace(/[^0-9.]/g, ""));
  };

  const handleIntentExecution = (response: AssistantResponse): any => {
    const { intent, parameters } = response;
    
    // Safety check for user session
    if (!user && [
      "ADD_TO_CART", "ADD_TO_WISHLIST", "SHOW_CART", "SHOW_WISHLIST", 
      "SHOW_ADDRESSES", "SHOW_PRIMARY_ADDRESS", "ADD_ADDRESS", "DELETE_ADDRESS", "SET_PRIMARY_ADDRESS",
      "SHOW_WALLET", "SHOW_WALLET_BALANCE", "SHOW_WALLET_TRANSACTIONS", 
      "SHOW_PROFILE", "SHOW_ACCOUNT_OVERVIEW", "UPDATE_PROFILE", "UPDATE_NAME", "UPDATE_EMAIL", "UPDATE_PHONE",
      "SHOW_ORDERS", "TRACK_ORDER", "TRACK_LATEST_ORDER", "REORDER_LAST_ORDER", "CREATE_RETURN_REQUEST",
      "SHOW_RETURN_STATUS", "SHOW_REFUND_STATUS", "SHOW_MY_REVIEWS", "ADD_REVIEW", "SHOW_SETTINGS",
      "CHECKOUT_CART", "CHECKOUT_MENS_PRODUCTS", "CHECKOUT_WOMENS_PRODUCTS", "PROCEED_TO_PAYMENT"
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
        navigate({ to: "/account", search: { tab: "profile" } as any });
        return { cardType: "profile", user };

      case "SHOW_SETTINGS":
        navigate({ to: "/account", search: { tab: "settings" } as any });
        return { cardType: "info_success", text: "Opening your Maison Settings dashboard." };

      case "UPDATE_PROFILE":
      case "UPDATE_NAME":
      case "UPDATE_EMAIL":
      case "UPDATE_PHONE":
        if (user) {
          const patch: any = {};
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
        const prod = state.products.find(p => p.id === parameters.productId || p.name.toLowerCase().includes((parameters.productName || "").toLowerCase()));
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
            qty: qty
          });
          return { cardType: "added_to_cart", product: prod, size, qty };
        }
        return null;
      }

      case "REMOVE_FROM_CART":
        if (parameters.productId) {
          removeFromShopCart(parameters.productId, parameters.selectedSize);
          return { cardType: "cart_summary", cart: state.shopCart.filter(c => c.productId !== parameters.productId), total: shopTotal };
        }
        return null;

      case "REMOVE_PRODUCTS_BY_GENDER":
        if (parameters.gender) {
          const toRemove = state.shopCart.filter(item => {
            const prod = state.products.find(p => p.id === item.productId);
            return prod?.gender === parameters.gender;
          });
          toRemove.forEach(item => removeFromShopCart(item.productId, item.selectedSize));
          return { cardType: "info_success", text: `Removed all ${parameters.gender} products from your cart.` };
        }
        return null;

      case "CLEAR_CART":
        clearShopCart();
        return { cardType: "info_success", text: "Your shopping cart has been cleared." };

      case "SHOW_WISHLIST":
        navigate({ to: "/account", search: { tab: "wishlist" } as any });
        return { cardType: "wishlist_summary", items: state.products.filter(p => userWishlist.includes(p.id)) };

      case "MOVE_ALL_TO_CART":
        if (user) {
          userWishlist.forEach(pId => {
            const prod = state.products.find(p => p.id === pId);
            if (prod) {
              addToShopCart({
                productId: prod.id, name: prod.name, house: prod.house, price: prod.price, image: prod.image, selectedSize: "M", qty: 1
              });
            }
          });
          return { cardType: "info_success", text: "Moved all wishlist items to your shopping cart." };
        }
        return null;

      case "SHOW_ADDRESSES":
      case "SHOW_PRIMARY_ADDRESS":
        navigate({ to: "/account", search: { tab: "addresses" } as any });
        return { cardType: "addresses", list: userAddresses, primary: primaryAddress };

      case "ADD_ADDRESS":
        if (parameters.address && user) {
          let addressVal = parameters.address;
          if (typeof addressVal === "object" && addressVal !== null) {
            const { name, phone, pincode, streetAddress, addressLine, district, state } = addressVal;
            const line = streetAddress || addressLine || "";
            addressVal = `${name ? name + ", " : ""}${phone ? "Phone: " + phone + ", " : ""}${line ? line + ", " : ""}${district ? district + ", " : ""}${state ? state + " - " : ""}${pincode ? pincode : ""}`.trim();
            if (addressVal.endsWith(",")) {
              addressVal = addressVal.substring(0, addressVal.length - 1);
            }
          }
          addAddress(user.id, addressVal);
          return { cardType: "info_success", text: "Address added successfully." };
        }
        return null;

      case "DELETE_ADDRESS":
        if (parameters.index !== undefined && user) {
          removeAddress(user.id, Number(parameters.index));
          return { cardType: "info_success", text: "Address deleted successfully." };
        }
        return null;

      case "SET_PRIMARY_ADDRESS":
        if (parameters.address && user) {
          let addressVal = parameters.address;
          if (typeof addressVal === "object" && addressVal !== null) {
            const { name, phone, pincode, streetAddress, addressLine, district, state } = addressVal;
            const line = streetAddress || addressLine || "";
            addressVal = `${name ? name + ", " : ""}${phone ? "Phone: " + phone + ", " : ""}${line ? line + ", " : ""}${district ? district + ", " : ""}${state ? state + " - " : ""}${pincode ? pincode : ""}`.trim();
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
        navigate({ to: "/account", search: { tab: "wallet" } as any });
        return { cardType: "wallet", balance: walletBalance };

      case "SHOW_COUPONS":
        navigate({ to: "/account", search: { tab: "coupons" } as any });
        return { cardType: "coupons", coupons: state.coupons };

      case "APPLY_BEST_COUPON": {
        const best = state.coupons.reduce((max, c) => c.discount > max.discount ? c : max, state.coupons[0]);
        return { cardType: "info_success", text: `Best coupon found: ${best.code} (${best.discount}% discount). I will apply it at checkout.` };
      }

      case "APPLY_COUPON":
        if (parameters.couponCode) {
          const match = state.coupons.find(c => c.code.toUpperCase() === parameters.couponCode.toUpperCase());
          if (match) {
            return { cardType: "info_success", text: `Coupon ${match.code} applied successfully.` };
          }
          return { cardType: "info_error", text: "Coupon code invalid or expired." };
        }
        return null;

      case "SHOW_ORDERS":
        navigate({ to: "/account", search: { tab: "orders" } as any });
        return { cardType: "orders", orders: userOrders };

      case "SHOW_RETURN_STATUS":
      case "SHOW_REFUND_STATUS":
        navigate({ to: "/account", search: { tab: "returns" } as any });
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
        const mensItems = state.shopCart.filter(item => {
          const prod = state.products.find(p => p.id === item.productId);
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
        const womensItems = state.shopCart.filter(item => {
          const prod = state.products.find(p => p.id === item.productId);
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
        navigate({ to: "/categories", search: { q: parameters.searchQuery || "" } as any });
        return { cardType: "info_success", text: `Searching for "${parameters.searchQuery}" in our collections.` };

      case "FILTER_BY_GENDER":
        navigate({ to: "/categories", search: { gender: parameters.gender } as any });
        return { cardType: "info_success", text: `Filtering collections for ${parameters.gender}.` };

      case "SHOW_NEW_ARRIVALS":
        navigate({ to: "/categories", search: { tag: "New Arrivals" } as any });
        return { cardType: "info_success", text: "Showing our latest arrivals." };

      case "SHOW_TRENDING_PRODUCTS":
        navigate({ to: "/categories", search: { tag: "Trending" } as any });
        return { cardType: "info_success", text: "Showing our trending statements." };

      case "SHOW_COLLECTIONS":
        navigate({ to: "/categories", search: { view: "collections" } as any });
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
        const wishlistProducts = state.products.filter(p => userWishlist.includes(p.id));
        if (wishlistProducts.length === 0) return { cardType: "info_error", text: "Your wishlist is empty." };
        const cheapest = wishlistProducts.reduce((min, p) => parsePrice(p.price) < parsePrice(min.price) ? p : min, wishlistProducts[0]);
        // Add to cart
        addToShopCart({
          productId: cheapest.id, name: cheapest.name, house: cheapest.house, price: cheapest.price, image: cheapest.image, selectedSize: "M", qty: 1
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
        navigate({ to: "/categories", search: { q: searchQ } as any });
        return {
          cardType: "info_success",
          text: `I have curated look recommendations for "${parameters.occasion || "your occasion"}" on our Fashion page.`
        };
      }

      case "SUGGEST_MATCHING_PRODUCTS": {
        const prod = state.products.find(p => p.id === parameters.productId);
        const searchQ = prod ? `${prod.category} matching ${prod.name}` : "Matching products";
        navigate({ to: "/categories", search: { q: searchQ } as any });
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

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: Message = { id: `msg-${Date.now()}`, role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
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

    const historyContext = messages.slice(-4).map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await queryGeminiAssistant(textToSend, historyContext, ctxPayload);
      const cardData = handleIntentExecution(response);
      
      const assistantMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "model",
        content: response.reply,
        intent: response.intent,
        cardData
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      toast.error("Failed to connect with AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutConfirm = (address: string, total: number) => {
    if (!user) return;
    createOrder(user.id, {
      items: state.shopCart,
      total,
      address
    });
    toast.success("Order Placed Successfully!");
    
    setMessages(prev => [
      ...prev,
      {
        id: `ord-success-${Date.now()}`,
        role: "model",
        content: "Congratulations. Your order has been placed successfully. A style confirmation summary was dispatched to your email address."
      }
    ]);
  };

  return (
    <div className={`ai-assistant-window ${isOpen ? "open" : ""}`}>
      <div className="glass-reflection" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-accent/20 bg-black/10 dark:bg-white/5 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/25 flex items-center justify-center border border-accent">
            <Award className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-foreground tracking-wide">Maison Concierge</h3>
            <span className="text-[9px] uppercase tracking-widest text-accent font-bold">ReeVibes Premium AI</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Message Chat Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 relative z-20 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            
            <div
              className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white rounded-tr-none shadow-[0_4px_12px_rgba(212,175,55,0.25)] font-semibold"
                  : "bg-foreground/5 text-foreground rounded-tl-none border border-border-subtle"
              }`}
            >
              {msg.content}
            </div>

            {/* Structured Card Render */}
            {msg.cardData && ["cart_summary", "blocked_scope", "checkout_confirm", "outfit_curation", "wallet", "profile"].includes(msg.cardData.cardType) && (
              <div className="mt-3 w-full max-w-[90%] bg-background/80 dark:bg-black/40 border border-accent/30 rounded-2xl p-4 space-y-3 shadow-lg">
                
                {/* 1. Cart Summary Card */}
                {msg.cardData.cardType === "cart_summary" && (
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-accent font-bold flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" /> Shopping Bag
                    </div>
                    {msg.cardData.cart.length === 0 ? (
                      <div className="text-[11px] text-muted-foreground">Your bag is currently empty.</div>
                    ) : (
                      <>
                        <div className="max-h-24 overflow-y-auto space-y-1.5">
                          {msg.cardData.cart.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-[11px]">
                              <span>{item.name} ({item.selectedSize}) x {item.qty}</span>
                              <span className="font-semibold text-accent">{item.price}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border-subtle pt-2 flex justify-between text-xs font-bold">
                          <span>Total:</span>
                          <span className="text-accent">₹{msg.cardData.total.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* 2. Blocked Scope Alert */}
                {msg.cardData.cardType === "blocked_scope" && (
                  <div className="space-y-1.5 text-center py-2 text-rose-400">
                    <ShieldAlert className="w-7 h-7 mx-auto text-rose-400 mb-1" />
                    <div className="text-xs font-bold">Restricted Operation</div>
                    <div className="text-[10px] text-muted-foreground">Maison Concierge is restricted from altering admin, vendor, or contest data.</div>
                  </div>
                )}

                {/* 3. Checkout Confirmation Card */}
                {msg.cardData.cardType === "checkout_confirm" && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold border-b border-accent/20 pb-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-accent" /> Complete Couture Purchase</div>
                    <div className="text-[11px] space-y-1.5">
                      <div className="max-h-24 overflow-y-auto space-y-1 border-b border-border-subtle pb-2">
                        {msg.cardData.cart.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.name} (x{item.qty})</span>
                            <span className="text-accent">{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">₹{msg.cardData.total.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col bg-foreground/5 p-2 rounded-xl">
                        <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-accent" /> Delivery Address</span>
                        <span className="truncate mt-0.5">{msg.cardData.address || "No address saved"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-accent/10 p-2 rounded-xl text-accent border border-accent/20">
                        <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5" /> Wallet Balance:</span>
                        <span className="font-bold">₹{msg.cardData.balance.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCheckoutConfirm(msg.cardData.address, msg.cardData.total)}
                      className="w-full py-2.5 bg-accent hover:bg-accent/80 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Confirm and Pay <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 4. Outfit Curation Card */}
                {msg.cardData.cardType === "outfit_curation" && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold flex items-center gap-1.5 text-accent border-b border-accent/20 pb-2">
                      <Sparkles className="w-4 h-4" /> Custom Curation: {msg.cardData.occasion}
                    </div>
                    <div className="grid gap-2">
                      {msg.cardData.items.map((prod: any) => (
                        <div key={prod.id} className="flex gap-2 items-center bg-foreground/5 p-2 rounded-xl border border-border-subtle">
                          <img src={prod.image} className="w-9 h-11 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold truncate">{prod.name}</div>
                            <div className="text-[8px] text-muted-foreground">{prod.house}</div>
                          </div>
                          <div className="text-[10px] font-semibold text-accent">{prod.price}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs font-bold border-t border-border-subtle pt-2">
                      <span>Total Look Cost:</span>
                      <span className="text-accent">₹{msg.cardData.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* 5. Wallet Card */}
                {msg.cardData.cardType === "wallet" && (
                  <div className="space-y-2 text-center py-2">
                    <Wallet className="w-8 h-8 mx-auto text-accent mb-1" />
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Wallet Balance</div>
                    <div className="text-2xl font-serif font-bold text-foreground">₹{msg.cardData.balance.toLocaleString()}</div>
                    <button 
                      onClick={() => {
                        addWalletCredit(user!.id, 5000);
                        toast.success("Credited ₹5,000 to wallet");
                      }} 
                      className="text-[10px] text-accent underline cursor-pointer bg-transparent border-none outline-none font-bold"
                    >
                      + Topup ₹5,000 demo credit
                    </button>
                  </div>
                )}

                {/* 6. Profile Info Card */}
                {msg.cardData.cardType === "profile" && msg.cardData.user && (
                  <div className="space-y-2 text-xs">
                    <div className="text-[10px] uppercase tracking-wider text-accent font-bold border-b border-border-subtle pb-1">Boutique Profile</div>
                    <div>Name: <span className="font-semibold">{msg.cardData.user.firstName || ""} {msg.cardData.user.lastName || ""}</span></div>
                    <div>Email: <span className="font-semibold">{msg.cardData.user.email || ""}</span></div>
                    {msg.cardData.user.phone && <div>Phone: <span className="font-semibold">{msg.cardData.user.phone}</span></div>}
                  </div>
                )}
                
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-foreground/5 border border-border-subtle rounded-3xl rounded-tl-none p-4 text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-0" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-300" />
              </span>
              Concierge is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Command Chips */}
      <div className="px-5 py-2 flex gap-2 overflow-x-auto scrollbar-none border-t border-border-subtle bg-black/5 dark:bg-white/5 relative z-20">
        {suggestions.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="whitespace-nowrap text-[10px] uppercase tracking-wider bg-foreground/5 hover:bg-accent hover:text-white border border-border-subtle rounded-full py-1.5 px-3.5 transition-all text-foreground cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-5 border-t border-accent/20 bg-background/90 relative z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            disabled={isLoading}
            placeholder="Type your styling request…"
            className="flex-1 bg-foreground/5 border border-border-subtle pl-4 pr-3 py-3 rounded-full text-xs outline-none focus:border-accent transition-all text-foreground placeholder:text-muted-foreground/50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
