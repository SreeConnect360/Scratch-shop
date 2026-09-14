import { useState, useEffect, useMemo, useRef } from "react";
import { usePortal, useCartTotal, DEFAULT_HOMEPAGE_LAYOUT } from "@/lib/portal-state";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  ShoppingBag, Truck, RefreshCw, Users, Ticket, Star, Store, BarChart3,
  LayoutGrid, Plus, Edit2, Trash2, Check, X, ShieldAlert,
  ArrowUpRight, IndianRupee, Search, Shield, Eye, EyeOff, PlusCircle,
  Settings, History, ListFilter, Tag, BarChart2, Undo, CheckSquare,
  Square, ArrowUpDown, Layers3, Download, Upload, ArrowLeft, ArrowRight,
  FileSpreadsheet, FileText, ShieldCheck, Banknote, CreditCard, Wallet, User, XCircle,
  Activity, AlertTriangle, CheckCircle2, Copy, ExternalLink, Terminal, Package, Clock, Bell
} from "lucide-react";
import {
  type TimeframeFilter,
  type OverviewMetrics,
  computeOverviewMetrics,
  saveOverviewMetricsToSupabase,
  fetchOverviewMetricsFromSupabase
} from "@/lib/supabase-overview";
import * as XLSX from "xlsx";
import { AdminCard, AdminButton, StatusChip } from "./AdminCommon";
import { ImageFocalAdjuster } from "@/components/admin/ImageFocalAdjuster";
import { PRODUCTS } from "@/lib/data";
import { sortCustomerAccountsById } from "@/lib/supabase-customers";
import {
  fetchRazorpayWebhookEvents,
  insertRazorpayWebhookEvent,
  type RazorpayWebhookEvent,
  getEventCategory,
  type EventCategory,
} from "@/lib/supabase-razorpay-webhooks";
import { toast } from "sonner";
const formatOrderDateTime = (dateStr: string) => {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strTime = String(hours).padStart(2, "0") + ":" + minutes + " " + ampm;
  return `${day} ${month} ${year} • ${strTime}`;
};

export function ShopAdminPortal({ tab }: { tab: string }) {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { state, fetchBackendState, createProduct, updateProduct, deleteProduct, updateOrderStatus, acceptOrder, declineOrder, fetchCourierQuotes, assignAWB, schedulePickup, cancelOrder, fetchOrderLabel, fetchOrderInvoice, fetchOrderManifest, syncShiprocketTracking, assignReturnPickup, processSplitRefund, approveReturn, rejectReturn, updateReturnDetails, suspendCustomer, reactivateCustomer, addCoupon, updateCoupon, removeCoupon, toggleCouponActive, moderateReview, deleteReview, addWalletCredit, updateHomepageLayoutDraft, publishHomepageLayout, revertHomepageLayout, createBucket, updateBucket, deleteBucket, reorderBuckets, toggleShopWishlist, addWalletGiftCard, updateWalletGiftCard, toggleWalletGiftCardStatus, deleteWalletGiftCard } = usePortal();
  const navigate = useNavigate();

  // Payment Gateway & Webhooks Monitor State
  const [rzpEvents, setRzpEvents] = useState<RazorpayWebhookEvent[]>([]);
  const [loadingRzpEvents, setLoadingRzpEvents] = useState<boolean>(false);
  const [rzpCategoryFilter, setRzpCategoryFilter] = useState<EventCategory>("ALL");
  const [rzpSearchQuery, setRzpSearchQuery] = useState<string>("");
  const [selectedRzpEvent, setSelectedRzpEvent] = useState<RazorpayWebhookEvent | null>(null);
  const [simulatingEvent, setSimulatingEvent] = useState<boolean>(false);

  const loadGatewayEvents = async () => {
    setLoadingRzpEvents(true);
    try {
      const events = await fetchRazorpayWebhookEvents();
      setRzpEvents(events);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRzpEvents(false);
    }
  };

  useEffect(() => {
    if (tab === "gateways" || tab === "returns") {
      loadGatewayEvents();
    }
  }, [tab]);

  const filteredRzpEvents = useMemo(() => {
    return rzpEvents.filter(evt => {
      if (rzpCategoryFilter !== "ALL" && getEventCategory(evt.event_type) !== rzpCategoryFilter) {
        return false;
      }
      if (rzpSearchQuery.trim()) {
        const q = rzpSearchQuery.toLowerCase().trim();
        const matchesType = evt.event_type.toLowerCase().includes(q);
        const matchesEntity = (evt.entity_id || "").toLowerCase().includes(q);
        const matchesEmail = (evt.customer_email || "").toLowerCase().includes(q);
        const matchesStatus = (evt.status || "").toLowerCase().includes(q);
        const matchesDesc = (evt.error_description || "").toLowerCase().includes(q);
        return matchesType || matchesEntity || matchesEmail || matchesStatus || matchesDesc;
      }
      return true;
    });
  }, [rzpEvents, rzpCategoryFilter, rzpSearchQuery]);

  const capturedPaymentsTotal = useMemo(() => {
    return rzpEvents
      .filter(e => e.event_type === "payment.captured" || e.event_type === "order.paid")
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [rzpEvents]);

  const capturedPaymentsCount = useMemo(() => {
    return rzpEvents.filter(e => e.event_type === "payment.captured" || e.event_type === "order.paid").length;
  }, [rzpEvents]);

  const processedRefundsTotal = useMemo(() => {
    return rzpEvents
      .filter(e => e.event_type.startsWith("refund."))
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [rzpEvents]);

  const processedRefundsCount = useMemo(() => {
    return rzpEvents.filter(e => e.event_type.startsWith("refund.")).length;
  }, [rzpEvents]);

  const activeDisputesTotal = useMemo(() => {
    return rzpEvents
      .filter(e => e.event_type.includes("dispute"))
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [rzpEvents]);

  const activeDisputesCount = useMemo(() => {
    return rzpEvents.filter(e => e.event_type.includes("dispute")).length;
  }, [rzpEvents]);

  const settlementsTotal = useMemo(() => {
    return rzpEvents
      .filter(e => e.event_type.startsWith("settlement."))
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [rzpEvents]);

  const settlementsCount = useMemo(() => {
    return rzpEvents.filter(e => e.event_type.startsWith("settlement.")).length;
  }, [rzpEvents]);

  const activeDowntimes = useMemo(() => {
    return rzpEvents.filter(e => e.event_type === "payment.downtime.started");
  }, [rzpEvents]);

  // Dynamic products list from state
  const productsList = state.products || [];
  const ordersList = useMemo(() => {
    const orderMap = new Map<string, any>();
    Object.entries(state.orders || {}).forEach(([userId, list]) => {
      if (!Array.isArray(list)) return;
      list.forEach(o => {
        if (!o || !o.id) return;
        const oId = String(o.id).trim();
        const userObj = state.users?.find(u => u.id === userId);
        const customerName = userObj ? `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim() : (o.customerName || "Customer");
        
        let items: any[] = [];
        if (Array.isArray(o.items) && o.items.length > 0) {
          items = o.items;
        } else if (o.itemsJson) {
          try {
            const parsed = typeof o.itemsJson === "string" ? JSON.parse(o.itemsJson) : o.itemsJson;
            if (Array.isArray(parsed)) items = parsed;
          } catch {}
        }
        
        const itemMap = new Map<string, any>();
        items.forEach((item: any) => {
          if (!item) return;
          const key = `${item.productId || item.id || item.name}-${item.selectedSize || "M"}`;
          if (itemMap.has(key)) {
            const existing = itemMap.get(key);
            itemMap.set(key, { ...existing, qty: (existing.qty || 1) + (item.qty || 1) });
          } else {
            itemMap.set(key, { ...item, qty: item.qty || 1 });
          }
        });
        const dedupedItems = Array.from(itemMap.values());

        if (!orderMap.has(oId)) {
          orderMap.set(oId, { ...o, userId, customerName: customerName || "Customer", items: dedupedItems });
        } else {
          const existing = orderMap.get(oId);
          orderMap.set(oId, { ...existing, ...o, userId, customerName: customerName || existing.customerName, items: dedupedItems.length > 0 ? dedupedItems : existing.items });
        }
      });
    });
    return Array.from(orderMap.values()).filter(o => (o.status || "").toLowerCase() !== "cancelled");
  }, [state.orders, state.users]);
  const filteredOrders = useMemo(() => {
    let list = [...ordersList];

    // Default sorting: latest orders first (descending based on creation date and time)
    list.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      return timeB - timeA;
    });

    if (statusFilter !== "All") {
      list = list.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    return list;
  }, [ordersList, statusFilter]);
  const [returnsFilter, setReturnsFilter] = useState<string>("All");
  const returnsList = state.returns || [];
  const filteredReturns = useMemo(() => {
    let list = [...returnsList];
    if (returnsFilter === "All") return list;
    
    return list.filter(r => {
      const status = r.status?.toLowerCase();
      if (returnsFilter === "New Requests") return status === "return requested" || status === "pending" || status === "under review";
      if (returnsFilter === "Approved") return status === "return approved";
      if (returnsFilter === "Pickup Scheduled") return status === "pickup scheduled";
      if (returnsFilter === "In Transit") return status === "in transit" || status === "shipped";
      if (returnsFilter === "Received") return status === "item received";
      if (returnsFilter === "Refund Pending") return status === "refund processed";
      if (returnsFilter === "Refunded") return status === "refund completed" || status === "approved";
      if (returnsFilter === "Rejected") return status === "rejected";
      return true;
    });
  }, [returnsList, returnsFilter]);
  const customersList = useMemo(() => sortCustomerAccountsById(state.users || []), [state.users]);
  const couponsList = state.coupons || [];

  // Overview Dashboard Timeframe & Live Metrics State
  const [overviewTimeframe, setOverviewTimeframe] = useState<TimeframeFilter>("today");
  const [isRefreshingOverview, setIsRefreshingOverview] = useState<boolean>(false);
  const [lastOverviewSyncTime, setLastOverviewSyncTime] = useState<string>(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  const overviewMetrics = useMemo(() => {
    return computeOverviewMetrics(
      overviewTimeframe,
      ordersList,
      returnsList,
      customersList,
      productsList
    );
  }, [overviewTimeframe, ordersList, returnsList, customersList, productsList]);

  // Persist live overview metrics snapshot to Supabase
  useEffect(() => {
    if (tab === "overview" && overviewMetrics) {
      saveOverviewMetricsToSupabase(overviewMetrics).catch(() => {});
    }
  }, [tab, overviewMetrics]);

  const handleRefreshOverview = async () => {
    setIsRefreshingOverview(true);
    try {
      await fetchBackendState();
      const fresh = computeOverviewMetrics(overviewTimeframe, ordersList, returnsList, customersList, productsList);
      await saveOverviewMetricsToSupabase(fresh);
      setLastOverviewSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      toast.success("Overview dashboard & Supabase metrics synchronized!");
    } catch (e) {
      toast.error("Failed to sync overview metrics.");
    } finally {
      setIsRefreshingOverview(false);
    }
  };

  // Derive distinct Product Types and Brands from published product catalog for smart suggestions
  const availableProductTypes = useMemo(() => {
    const types = new Set<string>();
    (state.products || []).forEach(p => {
      if (p.type) types.add(p.type.trim());
      if (p.category) types.add(p.category.trim());
    });
    return Array.from(types).filter(Boolean).sort();
  }, [state.products]);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    (state.products || []).forEach(p => {
      if (p.house) brands.add(p.house.trim());
      if ((p as any).brand) brands.add((p as any).brand.trim());
    });
    return Array.from(brands).filter(Boolean).sort();
  }, [state.products]);
  // Local UI States
  const [catalogTab, setCatalogTab] = useState<"all" | "published" | "unpublished">("all");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<any | null>(null);
  const [dossierTab, setDossierTab] = useState<"details" | "wishlist" | "cart" | "orders">("details");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editTrackingNum, setEditTrackingNum] = useState("");
  const [editCourier, setEditCourier] = useState("");
  const [editEstDelivery, setEditEstDelivery] = useState("");
  const [courierQuotes, setCourierQuotes] = useState<any>(null);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split("T")[0]);
  const [orderSubTab, setOrderSubTab] = useState<"ordered" | "delivering" | "delivered">("ordered");
  const [reviewsFilter, setReviewsFilter] = useState<"all" | "approved" | "hidden">("all");
  const [reviewsSearch, setReviewsSearch] = useState<string>("");

  // Customers Directory Search, Filter, and Sorting State
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [customerSortBy, setCustomerSortBy] = useState<string>("created-desc");
  const [customerGenderFilter, setCustomerGenderFilter] = useState<string>("all");
  const [customerStatusFilter, setCustomerStatusFilter] = useState<string>("all");
  const [customerAgeFilter, setCustomerAgeFilter] = useState<string>("all");

  // Credit Wallet Modal State
  const [creditModalCustomer, setCreditModalCustomer] = useState<any | null>(null);
  const [creditAmountInput, setCreditAmountInput] = useState<string>("");
  const [creditMessageInput, setCreditMessageInput] = useState<string>("");
  const [isSubmittingCredit, setIsSubmittingCredit] = useState<boolean>(false);

  const filteredAndSortedCustomers = useMemo(() => {
    let list = [...(state.users || [])];

    // 1. Search Query Filter (Name, Email, Phone, ID, Gender, Country, Age, Addresses)
    if (customerSearchQuery.trim()) {
      const q = customerSearchQuery.trim().toLowerCase();
      list = list.filter((c: any) => {
        const name = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        const id = (c.id || "").toLowerCase();
        const gender = (c.gender || "").toLowerCase();
        const country = (c.country || "").toLowerCase();
        const ageStr = String(c.age || "");

        // Search addresses
        const rawAddrs = state.addresses[c.id] || c.addresses || [];
        const matchAddress = rawAddrs.some((a: any) => {
          if (typeof a === "string") {
            return a.toLowerCase().includes(q);
          }
          if (typeof a === "object" && a !== null) {
            const combined = [
              a.street_address,
              a.street,
              a.address,
              a.city,
              a.state,
              a.zip_code,
              a.zip,
              a.pincode,
              a.country,
              a.full_name,
              a.name,
              a.phone
            ].filter(Boolean).join(" ").toLowerCase();
            return combined.includes(q);
          }
          return false;
        });

        return (
          id.includes(q) ||
          name.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          gender.includes(q) ||
          country.includes(q) ||
          ageStr.includes(q) ||
          matchAddress
        );
      });
    }

    // 2. Gender Filter
    if (customerGenderFilter !== "all") {
      list = list.filter((c: any) => {
        const g = (c.gender || "").toLowerCase();
        if (customerGenderFilter === "Male") return g === "male";
        if (customerGenderFilter === "Female") return g === "female";
        if (customerGenderFilter === "Other") return g !== "male" && g !== "female" && g !== "";
        return true;
      });
    }

    // 3. Status Filter
    if (customerStatusFilter !== "all") {
      list = list.filter((c: any) => (c.status || "Active") === customerStatusFilter);
    }

    // 4. Age Filter
    if (customerAgeFilter !== "all") {
      list = list.filter((c: any) => {
        const age = Number(c.age) || 0;
        if (customerAgeFilter === "under25") return age > 0 && age < 25;
        if (customerAgeFilter === "25-35") return age >= 25 && age <= 35;
        if (customerAgeFilter === "36-50") return age >= 36 && age <= 50;
        if (customerAgeFilter === "above50") return age > 50;
        return true;
      });
    }

    // 5. Sorting
    list.sort((a: any, b: any) => {
      switch (customerSortBy) {
        case "created-desc": {
          const timeA = new Date(a.createdAt || a.registeredAt || 0).getTime() || 0;
          const timeB = new Date(b.createdAt || b.registeredAt || 0).getTime() || 0;
          if (timeB !== timeA) return timeB - timeA;
          return (b.id || "").localeCompare(a.id || "");
        }
        case "created-asc": {
          const timeA = new Date(a.createdAt || a.registeredAt || 0).getTime() || 0;
          const timeB = new Date(b.createdAt || b.registeredAt || 0).getTime() || 0;
          if (timeA !== timeB) return timeA - timeB;
          return (a.id || "").localeCompare(b.id || "");
        }
        case "name-asc": {
          const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
          const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
          return nameA.localeCompare(nameB);
        }
        case "name-desc": {
          const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
          const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
          return nameB.localeCompare(nameA);
        }
        case "wallet-desc": {
          const balA = state.wallets[a.id] ?? a.walletBalance ?? 0;
          const balB = state.wallets[b.id] ?? b.walletBalance ?? 0;
          return balB - balA;
        }
        case "wallet-asc": {
          const balA = state.wallets[a.id] ?? a.walletBalance ?? 0;
          const balB = state.wallets[b.id] ?? b.walletBalance ?? 0;
          return balA - balB;
        }
        case "orders-desc": {
          const ordA = state.orders[a.id]?.length ?? (a.orders || []).length ?? 0;
          const ordB = state.orders[b.id]?.length ?? (b.orders || []).length ?? 0;
          return ordB - ordA;
        }
        case "orders-asc": {
          const ordA = state.orders[a.id]?.length ?? (a.orders || []).length ?? 0;
          const ordB = state.orders[b.id]?.length ?? (b.orders || []).length ?? 0;
          return ordA - ordB;
        }
        case "age-asc": {
          const ageA = Number(a.age) || 0;
          const ageB = Number(b.age) || 0;
          return ageA - ageB;
        }
        case "age-desc": {
          const ageA = Number(a.age) || 0;
          const ageB = Number(b.age) || 0;
          return ageB - ageA;
        }
        default:
          return (a.id || "").localeCompare(b.id || "");
      }
    });

    return list;
  }, [
    state.users,
    state.addresses,
    state.wallets,
    state.orders,
    customerSearchQuery,
    customerGenderFilter,
    customerStatusFilter,
    customerAgeFilter,
    customerSortBy
  ]);

  useEffect(() => {
    if (selectedOrderDetails) {
      setEditStatus(selectedOrderDetails.status || "Processing");
      setEditPaymentStatus(selectedOrderDetails.paymentStatus || "Paid");
      setEditTrackingNum(selectedOrderDetails.trackingNumber || "");
      setEditCourier(selectedOrderDetails.courierPartner || "");
      setEditEstDelivery(selectedOrderDetails.estimatedDeliveryDate || "");
    }
  }, [selectedOrderDetails]);

  const handleDownloadBulkExcel = async () => {
    try {
      toast.info("Generating official Shiprocket Bulk Order Excel...");

      // Load original template from public folder retaining all 4 sheets
      const response = await fetch("/Bulk Order Advance Excel File.xlsx");
      if (!response.ok) {
        throw new Error("Could not load template file from server.");
      }
      const arrayBuffer = await response.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const orderSheet = workbook.Sheets["Order Sheet"];

      if (!orderSheet) {
        throw new Error("Invalid template: Order Sheet missing.");
      }

      const existingData: any[][] = XLSX.utils.sheet_to_json(orderSheet, { header: 1 });
      const headerRow1 = existingData[0] || [];
      const headerRow2 = existingData[1] || [];

      const orderedOrders = ordersList.filter(o =>
        ["pending approval", "processing", "pending", "accepted", "ready to ship", "confirmed", "packed"].includes(o.status?.toLowerCase() || "")
      );

      const newRows: any[][] = [];

      orderedOrders.forEach(ord => {
        const u = state.users.find(usr => usr.id === ord.userId);
        const buyerFirstName = u?.firstName || ord.customerName?.split(" ")[0] || "Customer";
        const buyerLastName = u?.lastName || (ord.customerName?.split(" ").slice(1).join(" ")) || "";
        const rawPhone = (u?.phone || "9876543210").replace(/[^0-9]/g, "");
        const buyerPhone = rawPhone.length >= 10 ? parseInt(rawPhone.slice(-10), 10) : 9876543210;
        const buyerEmail = u?.email || "";

        // Parse address fields
        let street = ord.address || (u as any)?.address || "100 Feet Road, Indiranagar, Bangalore, Karnataka - 560038";
        let pincode: any = 560038;
        let city = "Bangalore";
        let stateName = "Karnataka";
        let country = "India";

        if (typeof street === "string" && street.length > 0) {
          const pinMatch = street.match(/\b\d{6}\b/);
          if (pinMatch) {
            pincode = parseInt(pinMatch[0], 10);
          }
          const parts = street.split(",").map(s => s.trim()).filter(Boolean);
          if (parts.length >= 3) {
            const lastPart = parts[parts.length - 1];
            const secondLast = parts[parts.length - 2];
            if (lastPart.toLowerCase().includes("india")) {
              country = "India";
              if (parts.length >= 4) {
                stateName = parts[parts.length - 2].replace(/\d+/g, "").trim() || "Karnataka";
                city = parts[parts.length - 3] || "Bangalore";
              }
            } else {
              const stateClean = lastPart.replace(/\d+/g, "").trim();
              if (stateClean) stateName = stateClean;
              if (parts.length >= 3) city = secondLast;
            }
          }
        }

        if (street.length < 10) {
          street = street + ", Indiranagar, Bangalore, Karnataka";
        }

        const formattedDate = (() => {
          try {
            const d = new Date(ord.date);
            if (isNaN(d.getTime())) return "09-08-2026";
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();
            return `${dd}-${mm}-${yyyy}`;
          } catch (e) { return "09-08-2026"; }
        })();

        const payMethod = ord.paymentMethod?.toLowerCase().includes("cod") ? "COD" : "Prepaid";

        (ord.items || []).forEach((item: any) => {
          const liveProd = state.products.find((pr: any) => pr.id === item.productId || pr.sku === item.sku) || item;
          const prodName = liveProd.name || item.name || "ReeVibes Luxury Fashion Piece";
          const masterSku = liveProd.sku || item.sku || liveProd.id || item.productId || `RV-SKU-${ord.id}`;
          const prodQty = Number(item.qty) || 1;
          const itemPrice = Number(String(liveProd.price || item.price).replace(/[^0-9.]/g, "")) || 999;

          const row = [
            ord.id, // A: *Order Id
            formattedDate, // B: Order Date (DD-MM-YYYY)
            "Yes", // C: Verified Order
            buyerPhone, // D: *Buyer's Mobile No.
            buyerFirstName, // E: *Buyer's First Name
            buyerLastName, // F: Buyer's Last Name
            street, // G: *Shipping Complete Address
            "", // H: Shipping Address Landmark
            pincode, // I: *Shipping Address Pincode
            city, // J: *Shipping Address City
            stateName, // K: *Shipping Address State
            country, // L: *Shipping Address Country
            buyerEmail, // M: Email
            "", "", "", // N, O, P: Alt Phone, Company, GSTIN
            street, // Q: Billing Complete Address
            "", // R: Billing Landmark
            pincode, // S: Billing Pincode
            city, // T: Billing City
            stateName, // U: Billing State
            country, // V: Billing Country
            "Yes", // W: Send Notification
            "", // X: Pickup Address Id
            "Custom", // Y: *Order Channel (Standard for Shiprocket bulk upload)
            payMethod, // Z: *Payment Method (COD/Prepaid)
            prodName, // AA: *Product Name
            masterSku, // AB: *Master SKU
            prodQty, // AC: *Product Quantity
            itemPrice, // AD: *Per Unit Price in INR
            "No", // AE: *Partial COD
            ord.total || (itemPrice * prodQty), // AF: Paid Amount (Rs.)
            0, // AG: Product Discount
            (ord as any).appliedCoupon || "", // AH: Coupon
            "610910", // AI: HSN Code
            "", "", "", "", "", "", "", // AJ to AP
            "No", // AQ: *Contain Documents
            "", // AR: Reseller Name
            0.5, // AS: *Weight Of Shipment (kg)
            15, // AT: *Length (cm)
            15, // AU: *Breadth (cm)
            10, // AV: *Height (cm)
            1, // AW: Package Count
            "" // AX: Courier ID
          ];
          newRows.push(row);
        });
      });

      const sheetData = [headerRow1, headerRow2, ...newRows];
      const updatedOrderSheet = XLSX.utils.aoa_to_sheet(sheetData);
      workbook.Sheets["Order Sheet"] = updatedOrderSheet;

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ReeVibes_Bulk_Orders_Shiprocket.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Downloaded Shiprocket Bulk Order Excel!");
    } catch (err: any) {
      console.error("Failed to generate Excel:", err);
      toast.error(err.message || "Failed to export Excel file.");
    }
  };

  const handleDownloadBulkCSV = () => {
    try {
      toast.info("Generating Shiprocket Bulk Order CSV...");

      const orderedOrders = ordersList.filter(o =>
        ["pending approval", "processing", "pending", "accepted", "ready to ship", "ready to dispatch", "confirmed", "packed"].includes(o.status?.toLowerCase() || "")
      );

      const targetOrders = orderedOrders.length > 0 ? orderedOrders : ordersList;

      // CSV header row matching Shiprocket sample.csv exactly
      const csvHeaders = [
        "*Order ID", "Channel", "Payment Method", "Customer Name", "Customer Email",
        "Customer Mobile", "Address Line 1", "Address Line 2", "Address State",
        "Address City", "Address Pincode", "Pickup Address Name", "dimensions (CM)",
        "Package Name", "Invoice id", "Weight (KG)", "Archive", "Self Fulfilled",
        "Delivery Executive Name", "Delivery Executive Phone Number", "Tracking Url",
        "Order Type", "Order Tag", "Hsn Code", "Sku"
      ];

      const csvRows: string[][] = [];

      targetOrders.forEach(ord => {
        const u = state.users.find(usr => usr.id === ord.userId);
        let customerName = [u?.firstName, u?.lastName].filter(Boolean).join(" ") || ord.customerName || "Customer";
        let customerEmail = u?.email || "customer@reevibes.com";
        const rawPhone = (u?.phone || "9876543210").replace(/[^0-9]/g, "");
        let customerMobile = rawPhone.length >= 10 ? rawPhone.slice(-10) : "9876543210";

        let rawAddr = ord.address || (u as any)?.address || "";
        let street = "Indiranagar";
        let addressLine2 = "";
        let stateName = "Karnataka";
        let city = "Bangalore";
        let pincode = "560038";

        if (typeof rawAddr === "string" && rawAddr.trim().startsWith("{")) {
          try {
            const parsed = JSON.parse(rawAddr);
            if (parsed.street) street = parsed.street;
            else if (parsed.address) street = parsed.address;
            if (parsed.landmark) addressLine2 = parsed.landmark;
            if (parsed.city) city = parsed.city;
            if (parsed.state) stateName = parsed.state;
            if (parsed.pincode) pincode = String(parsed.pincode).replace(/[^0-9]/g, "");
            if (parsed.name) customerName = parsed.name;
            if (parsed.phone) {
              const p = String(parsed.phone).replace(/[^0-9]/g, "");
              if (p.length >= 10) customerMobile = p.slice(-10);
            }
          } catch (e) {
            street = rawAddr;
          }
        } else if (typeof rawAddr === "string" && rawAddr.length > 0) {
          const pinMatch = rawAddr.match(/\b\d{6}\b/);
          if (pinMatch) pincode = pinMatch[0];
          const parts = rawAddr.split(",").map(s => s.trim()).filter(Boolean);
          if (parts.length >= 3) {
            street = parts[0];
            city = parts[parts.length - 2];
            stateName = parts[parts.length - 1].replace(/\d+/g, "").trim() || "Karnataka";
            if (parts.length >= 4) {
              addressLine2 = parts[1];
            }
          } else {
            street = rawAddr;
          }
        }

        const payMethod = ord.paymentMethod?.toLowerCase().includes("cod") ? "cod" : "prepaid";

        const itemsList = ord.items && ord.items.length > 0 ? ord.items : [{ name: "ReeVibes Fashion Piece", productId: "RV-ITEM-1", qty: 1, price: ord.total }];

        itemsList.forEach((item: any) => {
          const liveProd = state.products.find((pr: any) => pr.id === item.productId || pr.sku === item.sku) || item;
          const prodName = liveProd.name || item.name || "ReeVibes Fashion Piece";
          const masterSku = liveProd.sku || item.sku || liveProd.id || item.productId || `RV-SKU-${ord.id}`;

          const row = [
            ord.id, // *Order ID
            "reevibes", // Channel
            payMethod, // Payment Method
            customerName, // Customer Name
            customerEmail, // Customer Email
            customerMobile, // Customer Mobile
            street, // Address Line 1
            addressLine2, // Address Line 2
            stateName, // Address State
            city, // Address City
            pincode, // Address Pincode
            "17-6-20, Sanjay Nagar, Dairy Farm Center Kakinada", // Pickup Address Name
            "10 x 10 x 10", // dimensions (CM)
            prodName, // Package Name
            ord.id, // Invoice id
            "0.5", // Weight (KG)
            "no", // Archive
            "no", // Self Fulfilled
            "", // Delivery Executive Name
            "", // Delivery Executive Phone Number
            ord.trackingNumber ? `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${ord.trackingNumber}` : "", // Tracking Url
            "Essentials", // Order Type
            "", // Order Tag
            "610910", // Hsn Code
            masterSku // Sku
          ];
          csvRows.push(row);
        });
      });

      const escapeCsvField = (field: string) => {
        const str = String(field ?? "");
        if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
      };

      const csvContent = [
        csvHeaders.map(h => escapeCsvField(h)).join(","),
        ...csvRows.map(row => row.map(cell => escapeCsvField(cell)).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ReeVibes_Bulk_Orders_Shiprocket.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Downloaded Shiprocket Bulk Order CSV!");
    } catch (err: any) {
      console.error("Failed to generate CSV:", err);
      toast.error(err.message || "Failed to export CSV file.");
    }
  };

  const [selectedReturnDetails, setSelectedReturnDetails] = useState<any | null>(null);
  const [selectedProductPreview, setSelectedProductPreview] = useState<any | null>(null);
  const [rejectionModalReturnId, setRejectionModalReturnId] = useState<string | null>(null);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState<string>("Return window expired");
  const [customRejectionText, setCustomRejectionText] = useState<string>("");
  const [pickupModalReturnId, setPickupModalReturnId] = useState<string | null>(null);
  const [pickupDateInput, setPickupDateInput] = useState<string>("");
  const [productForm, setProductForm] = useState<any>({
    name: "", house: "", price: "", image: "", images: [], tag: "", tags: [], gender: "Women", category: "Tops", categoriesList: [],
    sizes: ["S", "M", "L"], stockPerSize: { S: 10, M: 10, L: 10 }, sku: "", originalPrice: "",
    description: "", material: "", color: "", discountLimitBuyers: undefined, discountExpiryDate: "", discountBuyersCount: 0,
    type: "", fabric: "", collections: "", visibility: "VISIBLE", seoTitle: "", seoDescription: "", seoKeywords: "",
    isFeatured: false, isNewArrival: false, isTrending: false, isRecommended: false, productInfo: "", productSections: []
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: 10,
    type: "percentage",
    expiryType: "limited", // "unlimited" | "limited"
    expiryDate: "2026-12-31",
    userLimitType: "limited", // "unlimited" | "limited"
    usageLimit: 100,
    userEligibility: "All",
    productType: "",
    brand: ""
  });
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  // Coupons & Wallet Gift Cards Sub-tab
  const [couponsSubTab, setCouponsSubTab] = useState<"store-coupons" | "wallet-gift-cards">("store-coupons");
  const [isAddingGiftCard, setIsAddingGiftCard] = useState(false);
  const [editingGiftCard, setEditingGiftCard] = useState<any | null>(null);
  const [giftCardForm, setGiftCardForm] = useState<{
    code: string;
    amount: number;
    usageType: "unlimited" | "custom";
    usageLimit?: number;
    validityType: "unlimited" | "custom";
    expiryDate?: string;
    status: "Active" | "Inactive";
  }>({
    code: "",
    amount: 500,
    usageType: "unlimited",
    usageLimit: 100,
    validityType: "unlimited",
    expiryDate: "2026-12-31",
    status: "Active"
  });



  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Excel Import states
  const [importedProducts, setImportedProducts] = useState<any[]>([]);
  const [currentImportIndex, setCurrentImportIndex] = useState<number>(0);
  const [isReviewingImports, setIsReviewingImports] = useState<boolean>(false);
  const [isManualCreate, setIsManualCreate] = useState<boolean>(false);
  const [productToDeleteIndex, setProductToDeleteIndex] = useState<number | null>(null);
  const [sortField, setSortField] = useState<"date" | "price" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizeQty, setNewSizeQty] = useState(10);
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleExportCustomersExcel = () => {
    const targetList = filteredAndSortedCustomers && filteredAndSortedCustomers.length > 0 ? filteredAndSortedCustomers : customersList;
    if (!targetList || targetList.length === 0) {
      toast.error("No customers available to export.");
      return;
    }

    const data = targetList.map((c) => {
      const rawAddrs = state.addresses[c.id] || (c as any).addresses || [];
      const formattedAddrs = rawAddrs.map((addrItem: any) => {
        if (typeof addrItem === "string") {
          const trimmed = addrItem.trim();
          if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            try {
              const parsed = JSON.parse(trimmed);
              return parsed.address || parsed.street || parsed.fullAddress || trimmed;
            } catch {
              return trimmed;
            }
          }
          return trimmed;
        } else if (typeof addrItem === "object" && addrItem !== null) {
          return addrItem.address || addrItem.street || addrItem.fullAddress || "";
        }
        return String(addrItem || "");
      }).filter(Boolean);

      const addressStr = formattedAddrs.length > 0 ? formattedAddrs.join(" ; ") : "—";

      return {
        "ID": c.id,
        "Name": `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Member",
        "Email": c.email || "",
        "Phone": c.phone || "—",
        "Registered Date": c.registeredAt || "2026-07-13",
        "Last Login": (c as any).lastLogin || "—",
        "Gender": c.gender || "—",
        "Age": c.age || "—",
        "Date of Birth (DOB)": c.dob || "—",
        "Country": c.country || "—",
        "Wallet Balance (₹)": state.wallets[c.id] ?? 0,
        "Cart Items Count": (c.cart || []).length,
        "Wishlist Count": (state.shopWishlist[c.id] || c.wishlist || []).length,
        "Orders Count": (state.orders[c.id] || []).length,
        "Status": c.status || "Active",
        "Address": addressStr
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 12 },
      { wch: 8 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 12 },
      { wch: 60 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers Directory");
    XLSX.writeFile(wb, `customers_directory_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Customers Directory exported to Excel successfully!");
  };

  const handlePrintInvoice = (order: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const orderItems: any[] = Array.isArray(order.items) && order.items.length > 0
      ? order.items
      : (order.itemsJson ? (() => { try { const p = JSON.parse(order.itemsJson); return Array.isArray(p) ? p : []; } catch { return []; } })() : []);

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order #${order.id}</title>
          <style>
            body { font-family: monospace; padding: 40px; color: #000; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 10px; text-align: left; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">MAISON REEVIBES</div>
            <div>Invoice for Order #${order.id}</div>
          </div>
          <div class="details">
            <p><strong>Customer Name:</strong> ${order.customerName || "Customer"}</p>
            <p><strong>Address:</strong> ${order.address || "Warehouse Pickup"}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod || "Online"}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              \${(orderItems || []).map((item) => \`
                <tr>
                  <td>\${item.name || 'Fashion Piece'}</td>
                  <td>\${item.selectedSize || 'M'}</td>
                  <td>\${item.qty || 1}</td>
                  <td>\${item.price || 0}</td>
                </tr>
              \`).join("")}
            </tbody>
          </table>
          <div class="total">Total: ₹\${(order.total || 0).toLocaleString()}</div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintLabel = (order: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - Order #${order.id}</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .label-box { width: 400px; border: 3px solid #000; padding: 20px; box-sizing: border-box; }
            .header { font-size: 20px; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; text-align: center; }
            .section { margin-bottom: 12px; font-size: 14px; }
            .barcode { font-family: monospace; font-size: 24px; letter-spacing: 6px; text-align: center; margin: 20px 0; border: 1px dashed #000; padding: 10px; }
          </style>
        </head>
        <body>
          <div class="label-box">
            <div class="header">MAISON SHIPPING DEPT</div>
            <div class="section"><strong>TO:</strong> \${order.customerName}</div>
            <div class="section"><strong>ADDRESS:</strong> \${order.address}</div>
            <div class="section"><strong>COURIER:</strong> \${order.courierPartner || 'Shiprocket'}</div>
            <div class="section"><strong>AWB / TRACKING:</strong> \${order.trackingNumber || 'PENDING'}</div>
            <div class="barcode">*\${order.id}*</div>
            <div class="section" style="font-size: 11px; text-align: center; color: #555;">Scan to verify shipment</div>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };



  // Homepage Builder States
  const [draftLayout, setDraftLayout] = useState<any>(null);
  const [homepageSyncStatus, setHomepageSyncStatus] = useState<"saved" | "saving">("saved");
  const draftInitializedRef = useRef<boolean>(false);
  const [isPublishingLive, setIsPublishingLive] = useState<boolean>(false);
  const draftSaveTimeoutRef = useRef<any>(null);

  const updateDraft = (nextLayout: any, immediateSync?: boolean) => {
    setDraftLayout(nextLayout);
    setHomepageSyncStatus("saving");

    if (draftSaveTimeoutRef.current) {
      clearTimeout(draftSaveTimeoutRef.current);
    }

    if (immediateSync) {
      updateHomepageLayoutDraft(nextLayout);
      setHomepageSyncStatus("saved");
    } else {
      draftSaveTimeoutRef.current = setTimeout(() => {
        updateHomepageLayoutDraft(nextLayout);
        setHomepageSyncStatus("saved");
      }, 600);
    }
  };

  // Re-fetch latest layout directly from Supabase when entering homepage tab
  useEffect(() => {
    if (tab === "homepage") {
      fetchBackendState(true);
    }
  }, [tab, fetchBackendState]);
  const [activeSectionId, setActiveSectionId] = useState<string>("announcement");
  const [expandedSlideIndexMap, setExpandedSlideIndexMap] = useState<Record<string, number>>({});
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Bucket Dashboard States
  const [editingBucket, setEditingBucket] = useState<any | null>(null);
  const [isAddingBucket, setIsAddingBucket] = useState(false);
  const [bucketForm, setBucketForm] = useState<{ name: string; productIds: string[]; starProductId?: string; thumbnail?: string }>({
    name: "",
    productIds: [],
    starProductId: "",
    thumbnail: ""
  });
  const [bucketProductSearch, setBucketProductSearch] = useState("");
  const [rearrangeMode, setRearrangeMode] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;
    const reordered = [...(state.buckets || [])];
    const [removed] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIndex, 0, removed);
    reorderBuckets(reordered);
    setDraggedIdx(null);
  };

  const handleMoveBucket = (fromIdx: number, toIdx: number) => {
    const list = [...(state.buckets || [])];
    if (toIdx < 0 || toIdx >= list.length) return;
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    reorderBuckets(list);
  };

  useEffect(() => {
    if (!draftInitializedRef.current && (state?.homepageLayoutDraft || state?.homepageLayout)) {
      draftInitializedRef.current = true;
      const base = state.homepageLayoutDraft || state.homepageLayout || {};
      const layoutCopy: any = {
        ...DEFAULT_HOMEPAGE_LAYOUT,
        ...base,
        announcement: { ...DEFAULT_HOMEPAGE_LAYOUT.announcement, ...(base.announcement || {}) },
        hero: { ...DEFAULT_HOMEPAGE_LAYOUT.hero, ...(base.hero || {}) },
        categories: { ...DEFAULT_HOMEPAGE_LAYOUT.categories, ...(base.categories || {}) },
        trending: { ...DEFAULT_HOMEPAGE_LAYOUT.trending, ...(base.trending || {}) },
        newArrivals: { ...DEFAULT_HOMEPAGE_LAYOUT.newArrivals, ...(base.newArrivals || base.newArrival || {}) },
        campaign: { ...DEFAULT_HOMEPAGE_LAYOUT.campaign, ...(base.campaign || {}) },
        collections: { ...DEFAULT_HOMEPAGE_LAYOUT.collections, ...(base.collections || {}) },
        liveFeed: { ...DEFAULT_HOMEPAGE_LAYOUT.liveFeed, ...(base.liveFeed || {}) },
        bestSellers: { ...DEFAULT_HOMEPAGE_LAYOUT.bestSellers, ...(base.bestSellers || {}) },
        limitedStock: { ...DEFAULT_HOMEPAGE_LAYOUT.limitedStock, ...(base.limitedStock || {}) },
        influencerPicks: { ...DEFAULT_HOMEPAGE_LAYOUT.influencerPicks, ...(base.influencerPicks || {}) },
        reviews: { ...DEFAULT_HOMEPAGE_LAYOUT.reviews, ...(base.reviews || {}) },
        recentlyViewed: { ...DEFAULT_HOMEPAGE_LAYOUT.recentlyViewed, ...(base.recentlyViewed || {}) },
        brandStory: { ...DEFAULT_HOMEPAGE_LAYOUT.brandStory, ...(base.brandStory || {}) },
        chatbot: { enabled: true, ...(base.chatbot || {}) }
      };

      const standardKeys = [
        "announcement", "hero", "categories", "trending", "newArrivals",
        "campaign", "collections", "liveFeed", "bestSellers", "limitedStock",
        "influencerPicks", "reviews", "recentlyViewed", "brandStory", "chatbot"
      ];
      
      let existingOrder = Array.isArray(base.sectionOrder) ? [...base.sectionOrder] : [...DEFAULT_HOMEPAGE_LAYOUT.sectionOrder];
      existingOrder = existingOrder.filter(k => !["recommended", "flashSale", "lookbook", "newsletter", "navigation", "footer"].includes(k));

      standardKeys.forEach(k => {
        if (!existingOrder.includes(k)) {
          existingOrder.push(k);
        }
      });

      layoutCopy.sectionOrder = existingOrder;
      setDraftLayout(layoutCopy);
    }
  }, [state?.homepageLayoutDraft, state?.homepageLayout]);

  // Auto-hide announcement when countdown timer expires
  useEffect(() => {
    if (!draftLayout?.announcement?.countdownActive || !draftLayout?.announcement?.enabled) return;
    const endsAt = new Date(draftLayout.announcement.countdownEndsAt);
    if (isNaN(endsAt.getTime())) return;

    const checkExpiry = () => {
      if (endsAt.getTime() <= Date.now()) {
        setDraftLayout((prev: any) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            announcement: {
              ...prev.announcement,
              enabled: false,
            }
          };
          // Also persist the change to the actual layout state
          updateHomepageLayoutDraft(updated);
          return updated;
        });
      }
    };

    // Check immediately in case it's already expired
    checkExpiry();

    // Then check every second
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [draftLayout?.announcement?.countdownActive, draftLayout?.announcement?.countdownEndsAt, draftLayout?.announcement?.enabled]);

  // Liquid UI Modal state
  const [modal, setModal] = useState<{ type: string; title: string; desc: string; action: () => void } | null>(null);

  const triggerModal = (type: "success" | "warning" | "danger", title: string, desc: string, action: () => void) => {
    setModal({ type, title, desc, action });
  };

  // --- Handlers ---
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actual = parseFloat(String(productForm.originalPrice || "").replace(/[^0-9.]/g, ""));
    const disc = parseFloat(String(productForm.price || "").replace(/[^0-9.]/g, ""));
    const discountPct = (actual && disc && actual > disc) ? Math.round(((actual - disc) / actual) * 100) : 0;
    
    // Clean stock values
    const cleanStock = { ...(productForm.stockPerSize || {}) };
    Object.keys(cleanStock).forEach(k => {
      if ((cleanStock[k] as any) === "" || cleanStock[k] === undefined) {
        cleanStock[k] = 0;
      }
    });

    const finalForm = {
      ...productForm,
      stockPerSize: cleanStock,
      discount: discountPct
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, finalForm as any);
      setEditingProduct(null);
      setIsAddingProduct(false);
      triggerModal("success", "Product Updated", "The product has been successfully updated in the catalog.", () => {});
    } else {
      createProduct(finalForm as any);
      setIsAddingProduct(false);
      triggerModal("success", "Product Created", "The product has been added and published in the store.", () => {});
    }
    setProductForm({
      name: "", house: "", price: "", image: "", images: [], tag: "", tags: [], gender: "Women", category: "Tops", categoriesList: [],
      sizes: ["S", "M", "L"], stockPerSize: { S: 10, M: 10, L: 10 }, sku: `SKU-${Math.floor(10000 + Math.random()*90000)}`, originalPrice: "",
      description: "", material: "", color: "", discountLimitBuyers: undefined, discountExpiryDate: "", discountBuyersCount: 0,
      type: "", fabric: "", collections: "", visibility: "VISIBLE", seoTitle: "", seoDescription: "", seoKeywords: "",
      isFeatured: false, isNewArrival: false, isTrending: false, isRecommended: false, productInfo: ""
    });
  };

  const handleEditProduct = (p: any) => {
    setEditingProduct(p);
    const tagList = p.tag ? p.tag.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
    const sampleMarkup = p.productInfo || `*#Product Details#*\n**Specifications & Details**\n*Material Composition : ${p.material || "100% Organic Cotton"}*\n*Fabric Type : ${p.fabric || p.category || "Apparel"}*\n*Care Instructions : Dry clean only.*\n*Country of Origin : India*\n*Manufacturer : Atelier ReeVibes Crafts Ltd.*\n*SKU / Reference : ${p.sku || `SKU-${p.id}`}*`;

    const productDraft = {
      ...p,
      id: p.id,
      name: p.name || "",
      house: p.house || p.brand || "",
      price: p.price || "",
      image: p.image || "",
      tag: p.tag || "",
      tags: Array.isArray(p.tags) ? [...p.tags] : (tagList || []),
      gender: p.gender || "Women",
      category: p.category || "Tops",
      categoriesList: Array.isArray(p.categoriesList) ? [...p.categoriesList] : (p.category ? [p.category] : []),
      sizes: Array.isArray(p.sizes) ? [...p.sizes] : ["S", "M", "L"],
      stockPerSize: p.stockPerSize ? { ...p.stockPerSize } : { S: 10, M: 10, L: 10 },
      sku: p.sku || `SKU-${Math.floor(10000 + Math.random()*90000)}`,
      originalPrice: p.originalPrice || p.price || "",
      description: p.description || "",
      overviewTitle: p.overviewTitle !== undefined ? p.overviewTitle : "ATELIER OVERVIEW",
      details: p.details || p.overviewDescription || "",
      customRating: (p.customRating !== undefined && p.customRating !== null && String(p.customRating).toLowerCase() !== "none") ? p.customRating : null,
      customReviewCount: (p.customReviewCount !== undefined && p.customReviewCount !== null && String(p.customReviewCount).toLowerCase() !== "none") ? p.customReviewCount : null,
      material: p.material || p.fabric || p.fabricMaterial || "",
      fabric: p.fabric || p.material || p.fabricMaterial || "",
      fabricMaterial: p.material || p.fabric || p.fabricMaterial || "",
      color: p.color || "",
      images: Array.isArray(p.images) ? [...p.images] : (p.image ? [p.image] : []),
      discountLimitBuyers: p.discountLimitBuyers,
      discountExpiryDate: p.discountExpiryDate || "",
      discountBuyersCount: p.discountBuyersCount || 0,
      type: p.type || p.category || "",
      collections: p.collections || "",
      visibility: p.visibility || "VISIBLE",
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      seoKeywords: p.seoKeywords || "",
      isFeatured: p.isFeatured || false,
      isNewArrival: p.isNewArrival || false,
      isTrending: p.isTrending || false,
      isRecommended: p.isRecommended || false,
      productInfo: sampleMarkup
    };
    setImportedProducts([productDraft]);
    setCurrentImportIndex(0);
    setIsReviewingImports(true);
  };

  const handleDeleteProduct = (id: string) => {
    triggerModal("danger", "Delete Product", "Are you sure you want to permanently delete this product? This action cannot be undone.", () => {
      deleteProduct(id);
    });
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalExpiryDate = couponForm.expiryType === "unlimited" ? "unlimited" : couponForm.expiryDate;
    const finalUsageLimit = couponForm.userLimitType === "unlimited" ? -1 : couponForm.usageLimit;
    const codeFormatted = couponForm.code.trim().toUpperCase();

    if (!codeFormatted) {
      toast.error("Please enter a valid coupon code.");
      return;
    }

    if (editingCoupon) {
      updateCoupon(editingCoupon.code, {
        code: codeFormatted,
        discount: couponForm.discount,
        type: couponForm.type as "fixed" | "percentage" | "wallet",
        expiryDate: finalExpiryDate,
        usageLimit: finalUsageLimit,
        userEligibility: couponForm.userEligibility,
        productType: couponForm.productType.trim(),
        brand: couponForm.brand.trim(),
        active: editingCoupon.active !== undefined ? editingCoupon.active : true
      });
      setIsAddingCoupon(false);
      setEditingCoupon(null);
      toast.success(`Coupon ${codeFormatted} updated in Supabase and across portal!`);
      triggerModal("success", "Coupon Updated", `Coupon ${codeFormatted} has been successfully updated in Supabase, backend, and all portals.`, () => {});
    } else {
      addCoupon({
        code: codeFormatted,
        discount: couponForm.discount,
        type: couponForm.type as "fixed" | "percentage" | "wallet",
        expiryDate: finalExpiryDate,
        usageLimit: finalUsageLimit,
        userEligibility: couponForm.userEligibility,
        productType: couponForm.productType.trim(),
        brand: couponForm.brand.trim()
      });
      setIsAddingCoupon(false);
      triggerModal("success", "Coupon Created", "New coupon successfully saved to Supabase and live across all devices.", () => {});
    }

    setCouponForm({
      code: "",
      discount: 10,
      type: "percentage",
      expiryType: "limited",
      expiryDate: "2026-12-31",
      userLimitType: "limited",
      usageLimit: 100,
      userEligibility: "All",
      productType: "",
      brand: ""
    });
  };

  const handleGiftCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codeFormatted = giftCardForm.code.trim().toUpperCase();

    if (!codeFormatted) {
      toast.error("Please enter a valid gift card code.");
      return;
    }

    const existingCards = state.walletGiftCards || [];
    const isDuplicate = existingCards.some(g => g.code.toUpperCase() === codeFormatted && g.id !== editingGiftCard?.id);
    if (isDuplicate) {
      toast.error(`Gift card code "${codeFormatted}" already exists. Please enter a unique code.`);
      return;
    }

    if (editingGiftCard) {
      updateWalletGiftCard(editingGiftCard.id, {
        code: codeFormatted,
        amount: Number(giftCardForm.amount),
        usageType: giftCardForm.usageType,
        usageLimit: giftCardForm.usageType === "custom" ? Number(giftCardForm.usageLimit) : undefined,
        validityType: giftCardForm.validityType,
        expiryDate: giftCardForm.validityType === "custom" ? giftCardForm.expiryDate : undefined,
        status: giftCardForm.status
      });
      toast.success(`Wallet gift card ${codeFormatted} updated successfully.`);
    } else {
      addWalletGiftCard({
        code: codeFormatted,
        amount: Number(giftCardForm.amount),
        usageType: giftCardForm.usageType,
        usageLimit: giftCardForm.usageType === "custom" ? Number(giftCardForm.usageLimit) : undefined,
        validityType: giftCardForm.validityType,
        expiryDate: giftCardForm.validityType === "custom" ? giftCardForm.expiryDate : undefined,
        status: giftCardForm.status
      });
      toast.success(`🎉 Wallet gift card ${codeFormatted} created successfully!`);
    }

    setIsAddingGiftCard(false);
    setEditingGiftCard(null);
    setGiftCardForm({
      code: "",
      amount: 500,
      usageType: "unlimited",
      usageLimit: 100,
      validityType: "unlimited",
      expiryDate: "2026-12-31",
      status: "Active"
    });
  };



  // --- Excel Import & Review Wizard Handlers ---

  const handleDownloadTemplate = () => {
    const headers = [
      "Product Name",
      "Description",
      "Category",
      "Gender",
      "Colour",
      "Fabric Material",
      "Product Information",
      "Brand",
      "Product Type",
      "Sizes",
      "Quantities",
      "Price",
      "Discounted Price",
      "Images URLs"
    ];
    const data = [
      [
        "Classic Cotton Tee",
        "A premium quality daily-wear classic cotton t-shirt with breathable fabric.",
        "T-Shirts",
        "Unisex",
        "Sage Green",
        "100% Organic Cotton",
        "Product details\nTop highlights\nMaterial composition\t60% Cotton, 40% Polyester\nPattern\tSolid\nFit type\tRegular Fit\nSleeve type\tHalf Sleeve\nCollar style\tPolo Collar\nLength\tStandard Length\nCountry of Origin\tIndia\n\nAbout this item\nNeck : Polo Neck\nFit : Regular Fit\nMaterial : 60% Cotton and 40% Polyester\nOccasion : Casual\nPattern : Solid",
        "Blank Apparel",
        "Casual T-Shirt",
        "S,M,L",
        "12,5,10",
        "1299",
        "999",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"
      ],
      [
        "Luxe Linen Shirt",
        "Relaxed fit linen shirt perfect for summer outings and casual styling.",
        "Shirts",
        "Men",
        "Off-White",
        "Pure Linen",
        "Product details\nTop highlights\nMaterial composition\t100% Linen\nPattern\tSolid\nFit type\tRelaxed Fit\nSleeve type\tLong Sleeve\nCollar style\tSpread Collar\n\nAbout this item\nStyle Name\tModern\nNeck Style\tCollared Neck\nSleeve Type\tLong Sleeve",
        "Atelier Royale",
        "Casual Shirt",
        "M,L",
        "10,12",
        "2499",
        "1999",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"
      ]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products Template");
    XLSX.writeFile(wb, "products_import_template.xlsx");
    toast.success("Excel template downloaded successfully!");
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length <= 1) {
          toast.error("The Excel sheet is empty or contains no product rows.");
          return;
        }

        const headers = jsonData[0].map(h => String(h || "").trim().toLowerCase());
        const rows = jsonData.slice(1);

        const colIndex = (name: string) => headers.findIndex(h => h === name.toLowerCase());

        const idxName = colIndex("Product Name");
        const idxDesc = colIndex("Description");
        const idxCat = colIndex("Category");
        const idxGender = colIndex("Gender");
        const idxColor = colIndex("Colour");
        const idxMaterial = colIndex("Fabric Material");
        const idxBrand = colIndex("Brand");
        const idxType = colIndex("Product Type");
        const idxSizes = colIndex("Sizes");
        const idxQuantities = colIndex("Quantities");
        const idxPrice = colIndex("Price");
        const idxDiscountedPrice = colIndex("Discounted Price");
        const idxImages = colIndex("Images URLs");
        const idxProductInfo = headers.findIndex(h => h.includes("product information") || h.includes("product info") || h === "information");

        if (idxName === -1) {
          toast.error("Could not find 'Product Name' column in Excel file.");
          return;
        }

        const parsed: any[] = [];

        rows.forEach((row) => {
          if (!row || row.length === 0 || !row[idxName]) return; // Skip empty rows

          // Parse sizes and quantities
          const sizesStr = idxSizes !== -1 ? String(row[idxSizes] || "").trim() : "S,M,L";
          const quantitiesStr = idxQuantities !== -1 ? String(row[idxQuantities] || "").trim() : "10,10,10";

          const sizesList = sizesStr.split(",").map(s => s.trim()).filter(Boolean);
          const quantitiesList = quantitiesStr.split(",").map(q => parseInt(q.trim()) || 0);

          const stockPerSize: Record<string, number> = {};
          sizesList.forEach((sz, idx) => {
            stockPerSize[sz] = quantitiesList[idx] !== undefined ? quantitiesList[idx] : 10;
          });

          // Price parsing
          const rawPrice = idxPrice !== -1 ? String(row[idxPrice] || "").replace(/[^0-9.]/g, "") : "";
          const rawDiscountedPrice = idxDiscountedPrice !== -1 ? String(row[idxDiscountedPrice] || "").replace(/[^0-9.]/g, "") : "";
          
          let price = rawPrice;
          let originalPrice = rawPrice;

          if (rawDiscountedPrice) {
            price = rawDiscountedPrice;
            originalPrice = rawPrice;
          } else {
            price = rawPrice;
            originalPrice = "";
          }

          // Image URLs
          const imagesStr = idxImages !== -1 ? String(row[idxImages] || "").trim() : "";
          const imagesList = imagesStr.split(",").map(img => img.trim()).filter(Boolean);
          const mainImage = imagesList[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"; // default sample image

          // Category mapping & fallback
          const rawCat = idxCat !== -1 ? String(row[idxCat] || "").trim() : "Tops";
          let category = "Tops";
          const lowerCat = rawCat.toLowerCase();
          if (lowerCat.includes("shirt")) {
            category = lowerCat.includes("t-shirt") || lowerCat.includes("tee") ? "T-Shirts" : "Shirts";
          } else if (lowerCat.includes("bottom") || lowerCat.includes("pant") || lowerCat.includes("jean")) {
            category = "Bottoms";
          } else if (lowerCat.includes("access")) {
            category = "Accessories";
          } else if (lowerCat.includes("couture") || lowerCat.includes("dress")) {
            category = "Couture";
          } else if (lowerCat.includes("top") || lowerCat.includes("corset")) {
            category = "Tops";
          } else {
            category = rawCat; // Allow custom categories
          }

          const rawGender = idxGender !== -1 ? String(row[idxGender] || "").trim() : "Unisex";
          let gender = "Unisex";
          if (rawGender.toLowerCase().startsWith("wom")) gender = "Women";
          else if (rawGender.toLowerCase().startsWith("men")) gender = "Men";

          const product = {
            name: String(row[idxName] || ""),
            description: idxDesc !== -1 ? String(row[idxDesc] || "") : "",
            category: category,
            gender: gender,
            color: idxColor !== -1 ? String(row[idxColor] || "") : "",
            material: idxMaterial !== -1 ? String(row[idxMaterial] || "") : "",
            fabric: idxMaterial !== -1 ? String(row[idxMaterial] || "") : "",
            house: idxBrand !== -1 ? String(row[idxBrand] || "") : "Blank Apparel",
            type: idxType !== -1 ? String(row[idxType] || "") : "",
            productInfo: idxProductInfo !== -1 ? String(row[idxProductInfo] || "") : "",
            sizes: sizesList.length > 0 ? sizesList : ["S", "M", "L"],
            stockPerSize: stockPerSize,
            price: price ? `₹${parseInt(price).toLocaleString()}` : "₹999",
            originalPrice: originalPrice ? `₹${parseInt(originalPrice).toLocaleString()}` : "",
            image: mainImage,
            images: imagesList.length > 0 ? imagesList : [mainImage],
            sku: `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
            tag: "New",
            tags: ["Imported"],
            visibility: "VISIBLE",
            isFeatured: false,
            isNewArrival: true,
            isTrending: false,
            isRecommended: false
          };

          parsed.push(product);
        });

        if (parsed.length === 0) {
          toast.error("No valid product rows parsed from Excel sheet.");
          return;
        }

        setImportedProducts(parsed);
        setCurrentImportIndex(0);
        setIsReviewingImports(true);
        toast.success(`Successfully parsed ${parsed.length} products! Please review them.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse Excel file. Make sure it is a valid format.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleSaveImportedProducts = (publishLive = true) => {
    if (editingProduct) {
      const p = importedProducts[0];
      if (p) {
        const actual = parseFloat(String(p.originalPrice || "").replace(/[^0-9.]/g, ""));
        const disc = parseFloat(String(p.price || "").replace(/[^0-9.]/g, ""));
        const discountPct = (actual && disc && actual > disc) ? Math.round(((actual - disc) / actual) * 100) : 0;
        
        const finalForm = {
          ...p,
          discount: discountPct,
          status: publishLive ? "PUBLISHED" : "UNPUBLISHED",
          visibility: publishLive ? "VISIBLE" : "HIDDEN"
        };
        updateProduct(editingProduct.id, finalForm);
      }
      setIsReviewingImports(false);
      setImportedProducts([]);
      setEditingProduct(null);
      triggerModal("success", "Product Updated", "The product has been successfully updated in the catalog.", () => {});
    } else {
      importedProducts.forEach((p) => {
        const actual = parseFloat(String(p.originalPrice || "").replace(/[^0-9.]/g, ""));
        const disc = parseFloat(String(p.price || "").replace(/[^0-9.]/g, ""));
        const discountPct = (actual && disc && actual > disc) ? Math.round(((actual - disc) / actual) * 100) : 0;
        
        const finalForm = {
          ...p,
          discount: discountPct,
          status: publishLive ? "PUBLISHED" : "UNPUBLISHED",
          visibility: publishLive ? "VISIBLE" : "HIDDEN"
        };
        createProduct(finalForm);
      });
      setIsReviewingImports(false);
      setImportedProducts([]);
      const msg = publishLive
        ? `Successfully created and published ${importedProducts.length} new products to the catalog.`
        : `Successfully created ${importedProducts.length} new draft products (unpublished) in the catalog.`;
      triggerModal("success", "Products Created", msg, () => {});
      setIsManualCreate(false);
    }
  };

  const updateImportedProductField = (field: string, value: any) => {
    const updated = [...importedProducts];
    updated[currentImportIndex] = {
      ...updated[currentImportIndex],
      [field]: value
    };
    setImportedProducts(updated);
  };

  const updateImportedProductStock = (size: string, qty: number) => {
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const newStock = { ...prod.stockPerSize, [size]: qty };
    const newSizes = Object.keys(newStock).filter(sz => newStock[sz] >= 0);

    updated[currentImportIndex] = {
      ...prod,
      stockPerSize: newStock,
      sizes: newSizes
    };
    setImportedProducts(updated);
  };

  const handlePrevImport = () => {
    if (currentImportIndex > 0) {
      setCurrentImportIndex(currentImportIndex - 1);
    }
  };

  const handleNextImport = () => {
    if (currentImportIndex < importedProducts.length - 1) {
      setCurrentImportIndex(currentImportIndex + 1);
    }
  };

  const handleAddSizeToImport = () => {
    const size = newSizeName.trim().toUpperCase();
    if (!size) return;
    const qty = Math.max(0, newSizeQty);
    
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const newStock = { ...(prod.stockPerSize || {}), [size]: qty };
    const newSizes = Object.keys(newStock);

    updated[currentImportIndex] = {
      ...prod,
      stockPerSize: newStock,
      sizes: newSizes
    };
    setImportedProducts(updated);
    setNewSizeName("");
    setNewSizeQty(10);
    toast.success(`Size ${size} added successfully.`);
  };

  const handleRemoveSizeFromImport = (size: string) => {
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const newStock = { ...(prod.stockPerSize || {}) };
    delete newStock[size];
    const newSizes = Object.keys(newStock);

    updated[currentImportIndex] = {
      ...prod,
      stockPerSize: newStock,
      sizes: newSizes
    };
    setImportedProducts(updated);
    toast.success(`Size ${size} removed.`);
  };

  const handleAddImageToImport = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const imagesList = [...(prod.images || [])];
    
    if (imagesList.includes(url)) {
      toast.error("Image URL already exists.");
      return;
    }
    
    imagesList.push(url);
    const mainImage = prod.image || url;

    updated[currentImportIndex] = {
      ...prod,
      images: imagesList,
      image: mainImage
    };
    setImportedProducts(updated);
    setNewImageUrl("");
    toast.success("Image URL added.");
  };

  const handleRemoveImageFromImport = (urlToRemove: string) => {
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const imagesList = (prod.images || []).filter((url: string) => url !== urlToRemove);
    const mainImage = prod.image === urlToRemove ? (imagesList[0] || "") : prod.image;

    updated[currentImportIndex] = {
      ...prod,
      images: imagesList,
      image: mainImage
    };
    setImportedProducts(updated);
    toast.success("Image removed.");
  };

  const handleMoveImageLeft = (idx: number) => {
    if (idx === 0) return;
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const imagesList = [...(prod.images || [])];
    
    const temp = imagesList[idx];
    imagesList[idx] = imagesList[idx - 1];
    imagesList[idx - 1] = temp;

    updated[currentImportIndex] = {
      ...prod,
      images: imagesList,
      image: imagesList[0] || ""
    };
    setImportedProducts(updated);
    toast.success("Image moved left.");
  };

  const handleMoveImageRight = (idx: number) => {
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const imagesList = [...(prod.images || [])];
    if (idx === imagesList.length - 1) return;

    const temp = imagesList[idx];
    imagesList[idx] = imagesList[idx + 1];
    imagesList[idx + 1] = temp;

    updated[currentImportIndex] = {
      ...prod,
      images: imagesList,
      image: imagesList[0] || ""
    };
    setImportedProducts(updated);
    toast.success("Image moved right.");
  };

  // --- Render Sections ---
  return (
    <div className="space-y-6">
      {/* Liquid Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="liquid-glass max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <span className={`w-3.5 h-3.5 rounded-full ${modal.type === "success" ? "bg-emerald-400" : modal.type === "danger" ? "bg-rose-400" : "bg-amber-400"}`} />
              <h3 className="font-serif text-xl">{modal.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{modal.desc}</p>
            <div className="flex justify-end gap-3">
              <AdminButton variant="outline" onClick={() => setModal(null)}>Cancel</AdminButton>
              <button
                onClick={() => {
                  modal.action();
                  setModal(null);
                }}
                className={`editorial-label px-5 py-2.5 text-white ${
                  modal.type === "danger" ? "bg-rose-600 hover:bg-rose-700" : "bg-accent hover:bg-accent/90"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Preview Modal */}
      {selectedProductPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass bg-background/95 border border-accent/20 max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-foreground">
            <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-2xl">Product Preview Curation</h3>
              </div>
              <button onClick={() => setSelectedProductPreview(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 text-xs leading-relaxed">
              {/* Product Thumbnail */}
              <div className="w-full sm:w-40 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden border border-black/10 dark:border-white/5 bg-black">
                <img src={selectedProductPreview.image} className="w-full h-full object-cover" alt="" />
              </div>

              {/* Product Specifications */}
              <div className="flex-1 space-y-3">
                <div className="border-b border-black/5 dark:border-white/5 pb-2">
                  <h4 className="text-sm font-bold text-foreground">{selectedProductPreview.name}</h4>
                  <p className="text-[10px] text-accent font-semibold mt-0.5">{selectedProductPreview.house}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase font-bold">Category</span>
                    <span className="text-foreground font-semibold">{selectedProductPreview.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase font-bold">Gender</span>
                    <span className="text-foreground font-semibold">{selectedProductPreview.gender}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase font-bold">Price</span>
                    <span className="text-foreground font-serif font-bold text-accent">{selectedProductPreview.price}</span>
                  </div>
                  {selectedProductPreview.originalPrice && (
                    <div>
                      <span className="text-muted-foreground block text-[9px] uppercase font-bold">Original Price</span>
                      <span className="text-muted-foreground line-through font-serif">{selectedProductPreview.originalPrice}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase font-bold">Colour</span>
                    <span className="text-foreground">{selectedProductPreview.color || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase font-bold">Fabric</span>
                    <span className="text-foreground">{selectedProductPreview.fabricMaterial || selectedProductPreview.material || selectedProductPreview.fabric || "—"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase font-bold">Sizes & Stock</span>
                  <div className="flex flex-wrap gap-1.5 mt-1 font-mono">
                    {Object.entries(selectedProductPreview.stockPerSize || {}).map(([sz, qty]: [string, any]) => (
                      <span key={sz} className="px-2 py-0.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md text-[10px]">
                        {sz}: <strong className="text-accent">{qty}</strong>
                      </span>
                    ))}
                    {Object.keys(selectedProductPreview.stockPerSize || {}).length === 0 && (
                      <span className="text-muted-foreground italic">No stock defined</span>
                    )}
                  </div>
                </div>

                {selectedProductPreview.description && (
                  <div className="pt-1">
                    <span className="text-muted-foreground block text-[9px] uppercase font-bold">Description</span>
                    <p className="text-[10px] text-muted-foreground leading-normal line-clamp-3 italic">
                      "{selectedProductPreview.description}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/10 dark:border-white/10">
              <AdminButton variant="outline" onClick={() => setSelectedProductPreview(null)}>Close Preview</AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Selected Customer Details Modal */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="liquid-glass max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-2xl">Customer Curation Dossier</h3>
              </div>
              <button onClick={() => setSelectedCustomerDetails(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Premium Tab Bar */}
            <div className="flex border-b border-white/10 gap-4 text-xs font-semibold">
              {(["details", "wishlist", "cart", "orders"] as const).map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setDossierTab(tabKey)}
                  className={`pb-3 border-b-2 capitalize transition-colors cursor-pointer ${
                    dossierTab === tabKey ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tabKey === "orders" ? "Ordered Items" : tabKey}
                </button>
              ))}
            </div>

            {/* Dossier Tabs Content */}
            {dossierTab === "details" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid md:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div className="space-y-3">
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Account Identity</h4>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">ID:</span><span className="col-span-2 font-mono">{selectedCustomerDetails.id}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Name:</span><span className="col-span-2 font-semibold">{selectedCustomerDetails.firstName} {selectedCustomerDetails.lastName}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Email:</span><span className="col-span-2">{selectedCustomerDetails.email}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Phone:</span><span className="col-span-2">{selectedCustomerDetails.phone || "—"}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Registered:</span><span className="col-span-2">{selectedCustomerDetails.registeredAt || "—"}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Last Login:</span><span className="col-span-2">{selectedCustomerDetails.lastLogin || "—"}</span></div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Styling Parameters</h4>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Gender:</span><span className="col-span-2">{selectedCustomerDetails.gender || "—"}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">DOB:</span><span className="col-span-2">{selectedCustomerDetails.dob || "—"}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Country:</span><span className="col-span-2">{selectedCustomerDetails.country || "—"}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Status:</span><span className="col-span-2"><StatusChip status={selectedCustomerDetails.status} tone={selectedCustomerDetails.status === "Active" ? "success" : "danger"} /></span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Wallet:</span><span className="col-span-2 font-semibold text-accent">₹{(state.wallets[selectedCustomerDetails.id] ?? selectedCustomerDetails.walletBalance ?? 0).toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Saved Shipping Destinations */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Saved Shipping Destinations</h4>
                  {(() => {
                    const rawAddrs = state.addresses[selectedCustomerDetails.id] || selectedCustomerDetails.addresses || [];
                    if (!rawAddrs || rawAddrs.length === 0) {
                      return <p className="text-muted-foreground italic text-xs">No saved shipping destinations available.</p>;
                    }
                    return (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {rawAddrs.map((addrItem: any, i: number) => {
                          let name = "";
                          let phone = "";
                          let fullAddress = "";

                          if (typeof addrItem === "string") {
                            const trimmed = addrItem.trim();
                            if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
                              try {
                                const parsed = JSON.parse(trimmed);
                                name = parsed.full_name || parsed.name || parsed.fullName || `${selectedCustomerDetails.firstName} ${selectedCustomerDetails.lastName}`.trim();
                                phone = parsed.phone || parsed.phoneNumber || selectedCustomerDetails.phone || "No phone provided";
                                const street = parsed.street_address || parsed.street || parsed.address || "";
                                const city = parsed.city || "";
                                const stateVal = parsed.state || "";
                                const zip = parsed.zip_code || parsed.zip || parsed.pincode || "";
                                const country = parsed.country || "";
                                fullAddress = [street, city, stateVal, zip, country].filter(Boolean).join(", ") || trimmed;
                              } catch {
                                fullAddress = trimmed;
                              }
                            } else {
                              fullAddress = trimmed;
                            }
                          } else if (typeof addrItem === "object" && addrItem !== null) {
                            name = addrItem.full_name || addrItem.name || addrItem.fullName || `${selectedCustomerDetails.firstName} ${selectedCustomerDetails.lastName}`.trim();
                            phone = addrItem.phone || addrItem.phoneNumber || selectedCustomerDetails.phone || "No phone provided";
                            const street = addrItem.street_address || addrItem.street || addrItem.address || "";
                            const city = addrItem.city || "";
                            const stateVal = addrItem.state || "";
                            const zip = addrItem.zip_code || addrItem.zip || addrItem.pincode || "";
                            const country = addrItem.country || "";
                            fullAddress = [street, city, stateVal, zip, country].filter(Boolean).join(", ");
                          }

                          if (!name) name = `${selectedCustomerDetails.firstName} ${selectedCustomerDetails.lastName}`.trim() || "Customer";
                          if (!phone) phone = selectedCustomerDetails.phone || "No phone provided";
                          if (!fullAddress) fullAddress = "No address specified";

                          return (
                            <div key={i} className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1 text-xs">
                              <div className="font-bold text-white text-sm">{name}</div>
                              <div className="text-accent font-mono text-xs">{phone}</div>
                              <div className="text-muted-foreground leading-relaxed font-sans pt-1">{fullAddress}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {dossierTab === "wishlist" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] pb-2 border-b border-white/10">Active Wishlist Items</h4>
                {(() => {
                  const rawWish = state.shopWishlist[selectedCustomerDetails.id] || state.wishlist[selectedCustomerDetails.id] || selectedCustomerDetails.wishlist || [];
                  const wishListIds: string[] = typeof rawWish === "string" ? (() => { try { return JSON.parse(rawWish); } catch(e) { return []; } })() : (Array.isArray(rawWish) ? rawWish : []);
                  if (wishListIds.length === 0) {
                    return <p className="text-xs text-muted-foreground italic">No items saved in wishlist.</p>;
                  }
                  return (
                    <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">
                      {wishListIds.map(productId => {
                        const p = state.products.find(x => x.id === productId);
                        const inStock = p ? true : false;
                        return (
                          <div key={productId} className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                            <div className="flex items-center gap-3">
                              <img src={p?.image || (p?.images && p.images[0]) || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop"} alt={p?.name} className="w-10 h-10 object-cover bg-white/5 rounded" />
                              <div>
                                <div className="font-semibold text-white">{p?.name || `Product #${productId}`}</div>
                                <div className="text-[10px] text-muted-foreground">{p?.house || "Maison Curation"}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-muted-foreground">Added: {selectedCustomerDetails.registeredAt || "Today"}</span>
                              <span className={`font-semibold ${inStock ? "text-emerald-400" : "text-rose-400"}`}>
                                {inStock ? "In Stock" : "Unavailable"}
                              </span>
                              <span className="font-serif font-bold text-accent">{p?.price || "—"}</span>
                              <Link to="/product/$productId" params={{ productId }} className="text-[10px] uppercase font-bold text-accent border border-accent/30 hover:border-accent px-3 py-1 rounded-full">
                                View Product
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {dossierTab === "cart" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] pb-2 border-b border-white/10">Current Shopping Cart</h4>
                {(() => {
                  const rawCart = (selectedCustomerDetails.id === state.user?.id ? state.shopCart : null) || selectedCustomerDetails.cart;
                  const cartList: any[] = typeof rawCart === "string" ? (() => { try { return JSON.parse(rawCart); } catch(e) { return []; } })() : (Array.isArray(rawCart) ? rawCart : []);
                  if (cartList.length === 0) {
                    return <p className="text-xs text-muted-foreground italic">Shopping cart is empty.</p>;
                  }
                  return (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {cartList.map((item: any, i: number) => {
                        const itemPrice = Number(String(item.price).replace(/[^0-9.]/g, "")) || 0;
                        const totalAmount = itemPrice * (item.qty || 1);
                        return (
                          <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"} alt={item.name} className="w-10 h-10 object-cover bg-white/5 rounded" />
                              <div>
                                <div className="font-semibold text-white">{item.name}</div>
                                <div className="text-[10px] text-muted-foreground">
                                  Size: {item.selectedSize || "M"} · House: {item.house || "Maison"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-muted-foreground">Qty: {item.qty || 1}</span>
                              <span className="font-serif text-muted-foreground">{item.price}</span>
                              <span className="font-serif font-bold text-accent">₹{totalAmount.toLocaleString()}</span>
                              {item.productId ? (
                                <Link to="/product/$productId" params={{ productId: item.productId }} className="text-[10px] uppercase font-bold text-accent border border-accent/30 hover:border-accent px-3 py-1 rounded-full">
                                  View Product
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {dossierTab === "orders" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] pb-2 border-b border-white/10">Ordered Items Curation</h4>
                {(() => {
                  const customerOrders = state.orders[selectedCustomerDetails.id] || (Object.values(state.orders).flat().filter((o: any) => o.userId === selectedCustomerDetails.id || o.userId === selectedCustomerDetails.email)) || [];
                  if (customerOrders.length === 0) {
                    return <p className="text-xs text-muted-foreground italic">No orders placed yet.</p>;
                  }
                  return (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 divide-y divide-white/5">
                      {customerOrders.map((ord: any) => (
                        <div key={ord.id} className="pt-3 first:pt-0 space-y-2 text-xs">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <div>
                              <span className="font-bold font-mono text-white">{ord.id}</span>
                              <span className="text-[10px] text-muted-foreground ml-3">{formatOrderDateTime(ord.date)}</span>
                            </div>
                            <div className="flex gap-2">
                              <StatusChip status={ord.status} tone={ord.status === "Delivered" ? "success" : ord.status === "Processing" ? "warn" : ord.status === "Cancelled" ? "danger" : "accent"} />
                              <StatusChip status={ord.paymentStatus} tone={ord.paymentStatus === "Paid" ? "success" : "warn"} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            {(ord.items || []).map((item: any, idx: number) => {
                              const priceVal = Number(String(item.price).replace(/[^0-9.]/g, "")) || 0;
                              return (
                                <div key={idx} className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <img src={item.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"} alt={item.name} className="w-8 h-8 object-cover rounded bg-white/5" />
                                    <div>
                                      <div className="font-medium text-white">{item.name}</div>
                                      <div className="text-[10px] text-muted-foreground">Size: {item.selectedSize || "—"} · Qty: {item.qty}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="font-serif font-bold text-accent">₹{(priceVal * item.qty).toLocaleString()}</span>
                                    {item.productId ? (
                                      <Link to="/product/$productId" params={{ productId: item.productId }} className="text-[9px] uppercase font-bold text-accent/80 hover:text-accent">
                                        View
                                      </Link>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-[10px] text-muted-foreground bg-white/5 p-2 rounded">
                            <div><span className="font-semibold text-white">Shipping Address:</span> {ord.address}</div>
                            <div className="mt-1">
                              <span className="font-semibold text-white">Tracking Details:</span>{" "}
                              {ord.trackingNumber || ord.awbCode ? (
                                <span className="text-accent font-mono font-bold">
                                  {ord.trackingNumber || ord.awbCode} ({ord.courierPartner || "Shiprocket Partner"})
                                </span>
                              ) : (
                                <span className="text-muted-foreground italic">Pending courier allocation</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreditModalCustomer(selectedCustomerDetails);
                    setCreditAmountInput("");
                    setCreditMessageInput("");
                  }}
                  className="editorial-label bg-accent/20 hover:bg-accent/30 text-accent border border-accent/40 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <IndianRupee className="w-3.5 h-3.5" /> Credit Wallet
                </button>

                {selectedCustomerDetails.status === "Active" ? (
                  <button
                    type="button"
                    onClick={() => {
                      suspendCustomer(selectedCustomerDetails.id);
                      setSelectedCustomerDetails((prev: any) => ({ ...prev, status: "Suspended" }));
                      toast.warning(`Account of ${selectedCustomerDetails.firstName} suspended. Active sessions logged out.`);
                    }}
                    className="editorial-label bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Suspend Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      reactivateCustomer(selectedCustomerDetails.id);
                      setSelectedCustomerDetails((prev: any) => ({ ...prev, status: "Active" }));
                      toast.success(`Account of ${selectedCustomerDetails.firstName} reactivated.`);
                    }}
                    className="editorial-label bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Reactivate Account
                  </button>
                )}
              </div>
              <AdminButton variant="outline" onClick={() => setSelectedCustomerDetails(null)}>Close dossier</AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Credit Wallet Popup Modal */}
      {creditModalCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="liquid-glass bg-background/95 border border-accent/30 max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl rounded-3xl animate-in zoom-in-95 duration-200 text-foreground">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold">Credit ReeVibes Wallet</h3>
                  <p className="text-xs text-muted-foreground">Add funds & trigger an instant in-app account notification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isSubmittingCredit) {
                    setCreditModalCustomer(null);
                  }
                }}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Info Card */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={creditModalCustomer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent((creditModalCustomer.firstName || "") + (creditModalCustomer.lastName || ""))}`}
                  alt=""
                  className="w-10 h-10 rounded-full border border-white/20 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {creditModalCustomer.firstName} {creditModalCustomer.lastName}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-2 truncate">
                    <span className="text-accent">{creditModalCustomer.id}</span>
                    <span>•</span>
                    <span className="truncate">{creditModalCustomer.email}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Current Balance</span>
                <span className="font-serif font-bold text-accent text-sm">
                  ₹{(state.wallets[creditModalCustomer.id] ?? creditModalCustomer.walletBalance ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Credit Amount Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Amount to Credit (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground font-bold font-serif text-lg">
                  ₹
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 500"
                  value={creditAmountInput}
                  onChange={(e) => setCreditAmountInput(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-surface text-foreground font-serif text-lg font-bold focus:outline-none focus:border-accent"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[100, 250, 500, 1000, 2000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCreditAmountInput(String(preset))}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-mono font-semibold transition-colors cursor-pointer ${
                      creditAmountInput === String(preset)
                        ? "bg-accent text-black border-accent font-bold shadow-sm"
                        : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-accent/40 text-foreground/80"
                    }`}
                  >
                    +₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notification Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Notification Message to User
                </label>
                <span className="text-[10px] text-muted-foreground italic">Optional</span>
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Complimentary festive shopping credits from ReeVibes Atelier!"
                value={creditMessageInput}
                onChange={(e) => setCreditMessageInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-surface text-foreground text-xs leading-relaxed focus:outline-none focus:border-accent placeholder:text-muted-foreground/60 resize-none"
              />
              <p className="text-[11px] text-muted-foreground leading-normal">
                {creditMessageInput.trim() ? (
                  <span className="text-accent flex items-center gap-1 font-medium">
                    ✓ Custom message will be delivered to the user's notification inbox.
                  </span>
                ) : (
                  <span>
                    If left blank, default notification will be sent:{" "}
                    <em className="text-foreground/90 font-medium">
                      "ReeVibes Wallet: ₹{Number(creditAmountInput) > 0 ? Number(creditAmountInput).toLocaleString() : "X"} has been credited to your wallet."
                    </em>
                  </span>
                )}
              </p>
            </div>

            {/* Live In-App Notification Preview */}
            <div className="rounded-2xl p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Bell className="w-3 h-3 text-accent" /> Customer Notification Preview
              </span>
              <div className="p-3 rounded-xl bg-surface border border-accent/20 flex items-start gap-3 text-xs shadow-inner">
                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-xs">Wallet Credited</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug break-words">
                    {creditMessageInput.trim() || `ReeVibes Wallet: ₹${Number(creditAmountInput) > 0 ? Number(creditAmountInput).toLocaleString() : "0"} has been credited to your wallet.`}
                  </div>
                  <div className="text-[9px] text-accent mt-1">Just now • Unread</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-black/10 dark:border-white/10">
              <AdminButton
                variant="outline"
                onClick={() => {
                  if (!isSubmittingCredit) {
                    setCreditModalCustomer(null);
                  }
                }}
                disabled={isSubmittingCredit}
              >
                Cancel
              </AdminButton>
              <button
                type="button"
                disabled={isSubmittingCredit || !creditAmountInput || isNaN(Number(creditAmountInput)) || Number(creditAmountInput) <= 0}
                onClick={async () => {
                  const num = Number(creditAmountInput);
                  if (isNaN(num) || num <= 0) {
                    toast.error("Please enter a valid credit amount greater than 0.");
                    return;
                  }
                  setIsSubmittingCredit(true);
                  try {
                    const targetUserId = creditModalCustomer.id;
                    const msg = creditMessageInput.trim();
                    await addWalletCredit(targetUserId, num, msg);

                    // Update local state if customer dossier is open
                    if (selectedCustomerDetails && selectedCustomerDetails.id === targetUserId) {
                      const prev = state.wallets[targetUserId] ?? selectedCustomerDetails.walletBalance ?? 0;
                      setSelectedCustomerDetails((prevObj: any) => ({
                        ...prevObj,
                        walletBalance: prev + num
                      }));
                    }

                    toast.success(`₹${num.toLocaleString()} credited to ${creditModalCustomer.firstName || "Customer"}'s wallet with notification!`);
                    setCreditModalCustomer(null);
                    setCreditAmountInput("");
                    setCreditMessageInput("");
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to credit wallet. Please try again.");
                  } finally {
                    setIsSubmittingCredit(false);
                  }
                }}
                className="editorial-label bg-accent hover:bg-accent/90 text-black px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingCredit ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Crediting Wallet...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" /> Confirm & Credit Wallet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Order Details Modal */}
      {selectedOrderDetails && (() => {
        const orderUser = state.users.find(u => u.id === selectedOrderDetails.userId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="liquid-glass max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-accent" />
                  <h3 className="font-serif text-2xl">Order Delivery Dossier</h3>
                </div>
                <button onClick={() => setSelectedOrderDetails(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cancellation Notice Banner in Admin Modal */}
              {(selectedOrderDetails.status === "Cancelled" || selectedOrderDetails.cancelReason) && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-400">
                    <XCircle className="w-4 h-4" />
                    <span>Order Cancelled / Declined — Inventory Restored in Supabase</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Cancellation Reason: </span>
                    <span className="font-semibold text-white">{selectedOrderDetails.cancelReason || "User Cancellation"}</span>
                  </div>
                  {selectedOrderDetails.cancelNote && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Customer Note: </span>
                      <span className="italic text-zinc-300">"{selectedOrderDetails.cancelNote}"</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 text-xs leading-relaxed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] mb-2">Order Core Specs</h4>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Order ID:</span><span className="col-span-2 font-mono font-bold text-accent">{selectedOrderDetails.id}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Date/Time:</span><span className="col-span-2">{formatOrderDateTime(selectedOrderDetails.date)}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2">
                      <span className="text-muted-foreground font-semibold">Customer:</span>
                      <span className="col-span-2 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">{selectedOrderDetails.customerName || "Member"}</span>
                        <button
                          onClick={() => {
                            if (orderUser) {
                              setSelectedOrderDetails(null);
                              setSelectedCustomerDetails(orderUser);
                              setDossierTab("details");
                            } else {
                              toast.info(`Customer profile for ${selectedOrderDetails.userId} is loading or guest.`);
                            }
                          }}
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:text-white bg-accent/10 hover:bg-accent px-2 py-0.5 rounded border border-accent/20 transition-colors cursor-pointer"
                          title={`Click to open Customer Curation Dossier for ${selectedOrderDetails.userId}`}
                        >
                          <User className="w-2.5 h-2.5" />
                          {selectedOrderDetails.userId}
                        </button>
                      </span>
                    </div>
                    {orderUser && (
                      <>
                        <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Email:</span><span className="col-span-2 font-mono text-foreground">{orderUser.email}</span></div>
                        <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Contact Phone:</span><span className="col-span-2 text-foreground">{orderUser.phone || "No phone added"}</span></div>
                      </>
                    )}
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Shipping Address:</span><span className="col-span-2 leading-normal text-white">{selectedOrderDetails.address}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Order Total:</span><span className="col-span-2 font-serif font-bold text-accent text-sm">₹{selectedOrderDetails.total.toLocaleString()}</span></div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] mb-2">Shipping & Payment Specs</h4>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Order Status:</span><span className="col-span-2 text-white font-bold">{selectedOrderDetails.status}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2">
                      <span className="text-muted-foreground">Payment Mode:</span>
                      <span className="col-span-2">
                        {selectedOrderDetails.paymentMethod?.toLowerCase().includes("cash") || selectedOrderDetails.paymentMethod?.toLowerCase().includes("cod") ? (
                          <span className="text-amber-300 font-bold inline-flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[10px]"><Banknote className="w-3 h-3" /> Cash on Delivery (COD)</span>
                        ) : selectedOrderDetails.paymentMethod?.toLowerCase().includes("wallet") ? (
                          <span className="text-purple-300 font-bold inline-flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-[10px]"><Wallet className="w-3 h-3" /> ReeVibes Wallet</span>
                        ) : (
                          <span className="text-sky-300 font-bold inline-flex items-center gap-1 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 text-[10px]"><CreditCard className="w-3 h-3" /> Online Gateway (Razorpay)</span>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Payment Status:</span><span className="col-span-2 text-emerald-400 font-bold">{selectedOrderDetails.paymentStatus || 'Paid'}</span></div>
                    {selectedOrderDetails.razorpayPaymentId && (
                      <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Razorpay Payment ID:</span><span className="col-span-2 font-mono text-[10px] text-accent">{selectedOrderDetails.razorpayPaymentId}</span></div>
                    )}
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Courier Partner:</span><span className="col-span-2 text-foreground font-semibold">{selectedOrderDetails.courierPartner || 'Shiprocket Express'}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">AWB Number:</span><span className="col-span-2 font-mono text-accent">{selectedOrderDetails.trackingNumber || 'Pending AWB Assignment'}</span></div>
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Estimated ETD:</span><span className="col-span-2">{selectedOrderDetails.estimatedDeliveryDate || '3-4 Business Days'}</span></div>
                  </div>
                </div>

                {/* Direct Action Bar for Labels, Invoices, Manifests, and Live Sync */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={async () => {
                      toast.info("Generating Shiprocket Label PDF...");
                      const url = await fetchOrderLabel(selectedOrderDetails.id);
                      if (url) window.open(url, "_blank");
                      else toast.error("Could not load label PDF.");
                    }}
                    className="bg-sky-600/30 hover:bg-sky-600 text-sky-200 hover:text-white border border-sky-500/40 text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Get Label PDF
                  </button>
                  <button
                    onClick={async () => {
                      toast.info("Generating Shiprocket Tax Invoice PDF...");
                      const url = await fetchOrderInvoice(selectedOrderDetails.id);
                      if (url) window.open(url, "_blank");
                      else toast.error("Could not load invoice PDF.");
                    }}
                    className="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Get Invoice PDF
                  </button>
                  <button
                    onClick={async () => {
                      toast.info("Generating Shiprocket Manifest PDF...");
                      const url = await fetchOrderManifest(selectedOrderDetails.id);
                      if (url) window.open(url, "_blank");
                      else toast.error("Could not load manifest PDF.");
                    }}
                    className="bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Get Manifest PDF
                  </button>
                  <button
                    onClick={async () => {
                      toast.info("Syncing live status from Shiprocket API...");
                      const updated = await syncShiprocketTracking(selectedOrderDetails.userId, selectedOrderDetails.id);
                      if (updated) {
                        toast.success("Shiprocket live tracking updated!");
                        setSelectedOrderDetails((prev: any) => ({
                          ...prev,
                          ...updated,
                          items: (Array.isArray(updated?.items) && updated.items.length > 0) ? updated.items : prev?.items
                        }));
                      } else {
                        toast.info("Tracking status up to date.");
                      }
                    }}
                    className="bg-accent/20 hover:bg-accent text-accent hover:text-white border border-accent/40 text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Sync Live Tracking
                  </button>
                </div>

                {/* Live Shiprocket Timeline Scans */}
                <div className="space-y-2 mt-4 border border-white/10 rounded-2xl p-4 bg-white/5">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Live Tracking Timeline (Shiprocket)</h4>
                    <span className="text-[9px] font-mono text-emerald-400">Webhook Active & Live</span>
                  </div>
                  {selectedOrderDetails.scansJson ? (() => {
                    try {
                      const scans = JSON.parse(selectedOrderDetails.scansJson);
                      if (Array.isArray(scans) && scans.length > 0) {
                        return (
                          <div className="space-y-3 max-h-48 overflow-y-auto pl-2 border-l border-white/10">
                            {scans.map((scan: any, sIdx: number) => (
                              <div key={sIdx} className="relative pl-4">
                                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-accent" />
                                <div className="font-semibold text-white text-xs">{scan.activity}</div>
                                <div className="text-[10px] text-muted-foreground">{scan.date} · {scan.location}</div>
                              </div>
                            ))}
                          </div>
                        );
                      }
                    } catch (e) {}
                    return null;
                  })() : null}

                  {/* Built-in Logistics Pipeline Steps */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <div className="flex-1">
                        <span className="font-semibold text-white">Order Registered:</span> Received & Verified in System
                      </div>
                      <span className="text-[10px] text-muted-foreground">{formatOrderDateTime(selectedOrderDetails.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className={`w-2.5 h-2.5 rounded-full ${selectedOrderDetails.shiprocketOrderId ? "bg-emerald-400" : "bg-amber-400"}`} />
                      <div className="flex-1">
                        <span className="font-semibold text-white">Shiprocket Order:</span> {selectedOrderDetails.shiprocketOrderId ? `Registered (SR ID: ${selectedOrderDetails.shiprocketOrderId})` : "Pending Acceptance & Adhoc Creation"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className={`w-2.5 h-2.5 rounded-full ${selectedOrderDetails.trackingNumber ? "bg-emerald-400" : "bg-white/20"}`} />
                      <div className="flex-1">
                        <span className="font-semibold text-white">AWB Code & Courier:</span> {selectedOrderDetails.trackingNumber ? `${selectedOrderDetails.courierPartner || 'Assigned'} (${selectedOrderDetails.trackingNumber})` : "Awaiting AWB Assignment"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className={`w-2.5 h-2.5 rounded-full ${["Pickup Scheduled", "Shipped", "In Transit", "Out for Delivery", "Delivered"].includes(selectedOrderDetails.status) ? "bg-emerald-400" : "bg-white/20"}`} />
                      <div className="flex-1">
                        <span className="font-semibold text-white">Pickup Schedule:</span> {["Pickup Scheduled", "Shipped", "In Transit", "Out for Delivery", "Delivered"].includes(selectedOrderDetails.status) ? "Pickup Scheduled with Courier" : "Pending Courier Schedule"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className={`w-2.5 h-2.5 rounded-full ${selectedOrderDetails.status === "Delivered" ? "bg-emerald-400" : "bg-white/20"}`} />
                      <div className="flex-1">
                        <span className="font-semibold text-white">Fulfillment Status:</span> {selectedOrderDetails.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shiprocket Logistics Automated Workflow Stepper */}
                <div className="border border-accent/20 rounded-2xl p-4 bg-accent/[0.02] space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Shiprocket Logistics Pipeline</h4>
                    <span className="text-[10px] text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded">
                      Status: {selectedOrderDetails.status}
                    </span>
                  </div>

                  {/* Step 1: Pending Approval / Processing */}
                  {(selectedOrderDetails.status === "Pending Approval" || selectedOrderDetails.status === "Processing" || selectedOrderDetails.status === "Pending" || !selectedOrderDetails.shiprocketOrderId) && selectedOrderDetails.status !== "Cancelled" && (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">Order received. Click Accept Order to register adhoc shipment with Shiprocket and query serviceable delivery partners, or Decline to reject and immediately restore size stock in Supabase.</p>
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={async () => {
                            setQuotesLoading(true);
                            toast.info("Accepting order & registering with Shiprocket...");
                            const res = await acceptOrder(selectedOrderDetails.userId, selectedOrderDetails.id);
                            setQuotesLoading(false);
                            if (res && (res.order || res.id)) {
                              const updated = res.order || res;
                              setSelectedOrderDetails((prev: any) => ({
                                ...prev,
                                ...updated,
                                items: (Array.isArray(updated?.items) && updated.items.length > 0) ? updated.items : prev?.items
                              }));
                              if (res.quotes && res.quotes.data && res.quotes.data.available_courier_companies) {
                                setCourierQuotes(res.quotes.data.available_courier_companies);
                                toast.success("Order accepted & live Shiprocket delivery partners retrieved!");
                              } else {
                                toast.success("Order accepted & registered with Shiprocket!");
                              }
                            } else {
                              toast.success("Order accepted & status updated to Accepted!");
                              setSelectedOrderDetails((prev: any) => prev ? { ...prev, status: "Accepted" } : null);
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept Order & Fetch Delivery Partners
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Decline and cancel Order ${selectedOrderDetails.id}? All ordered product size quantities and total stock will be automatically restored in Supabase.`)) {
                              toast.info("Declining order & restoring stock in Supabase...");
                              const res = await declineOrder(selectedOrderDetails.userId, selectedOrderDetails.id, "Declined by store administrator");
                              if (res && res.success) {
                                toast.success(`Order ${selectedOrderDetails.id} declined. Stock restored in Supabase!`);
                                setSelectedOrderDetails(null);
                              } else {
                                toast.error("Failed to decline order.");
                              }
                            }
                          }}
                          className="bg-rose-900/70 hover:bg-rose-800 text-white text-[10px] uppercase font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Decline Order & Restore Stock
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Accepted */}
                  {(selectedOrderDetails.status === "Accepted" || (selectedOrderDetails.status === "Pending Approval" && courierQuotes)) && (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">Order accepted. Select a Shiprocket courier delivery partner to generate real AWB tracking number.</p>
                      {!courierQuotes && !quotesLoading && (
                        <button
                          onClick={async () => {
                            setQuotesLoading(true);
                            const res = await fetchCourierQuotes(selectedOrderDetails.id);
                            setQuotesLoading(false);
                            if (res && res.data && res.data.available_courier_companies) {
                              setCourierQuotes(res.data.available_courier_companies);
                              toast.success("Shiprocket courier serviceability retrieved.");
                            } else if (res && res.error) {
                              toast.error(res.message || "Failed to retrieve courier rates.");
                            } else {
                              toast.error("No serviceability quotes returned for pincode.");
                            }
                          }}
                          className="bg-accent hover:bg-accent/80 text-white text-[10px] uppercase font-bold px-4 py-2 rounded-lg cursor-pointer"
                        >
                          Get Serviceability Quotes
                        </button>
                      )}

                      {quotesLoading && <div className="text-xs text-muted-foreground animate-pulse">Querying live Shiprocket serviceability API...</div>}

                      {courierQuotes && (
                        <div className="space-y-2.5">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground block">Available Delivery Partners (Shiprocket):</span>
                          <div className="border border-white/5 rounded-xl overflow-hidden text-xs max-h-56 overflow-y-auto">
                            <table className="w-full text-left border-collapse border border-white/5">
                              <thead>
                                <tr className="bg-white/5 text-[9px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
                                  <th className="p-2">Courier</th>
                                  <th className="p-2">Freight Charge</th>
                                  <th className="p-2">ETA</th>
                                  <th className="p-2">Rating</th>
                                  <th className="p-2 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {courierQuotes.map((q: any, qIdx: number) => (
                                  <tr key={qIdx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                    <td className="p-2 font-semibold text-white">{q.courier_name}</td>
                                    <td className="p-2 font-serif text-accent">₹{q.rate || q.freight_charge || "—"}</td>
                                    <td className="p-2">{q.etd || q.estimated_delivery_days || "—"}</td>
                                    <td className="p-2 text-amber-300">★ {q.rating || "4.5"}</td>
                                    <td className="p-2 text-right">
                                      <button
                                        onClick={async () => {
                                          const courierId = q.courier_company_id || q.id;
                                          const res = await assignAWB(selectedOrderDetails.userId, selectedOrderDetails.id, courierId, q.courier_name);
                                          if (res && !res.error) {
                                            toast.success(`AWB Assigned! Shipment routed via ${q.courier_name}. AWB: ${res.trackingNumber}`);
                                            setSelectedOrderDetails((prev: any) => ({
                                              ...prev,
                                              ...res,
                                              items: (Array.isArray(res?.items) && res.items.length > 0) ? res.items : prev?.items
                                            }));
                                            setCourierQuotes(null);
                                          } else {
                                            toast.error(res?.message || "Failed to assign AWB.");
                                          }
                                        }}
                                        className="bg-accent hover:bg-accent/80 text-white text-[9px] uppercase font-bold px-3 py-1.5 rounded cursor-pointer"
                                      >
                                        Select & Generate AWB
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Ready to Ship */}
                  {selectedOrderDetails.status === "Ready to Ship" && (
                    <div className="space-y-3">
                      <div className="text-xs bg-white/5 p-2.5 rounded-lg border border-white/10">
                        <div><span className="font-semibold text-white">Courier Partner:</span> {selectedOrderDetails.courierPartner || "Shiprocket Express"}</div>
                        <div><span className="font-semibold text-white">AWB Code:</span> <span className="font-mono text-accent font-bold">{selectedOrderDetails.trackingNumber}</span></div>
                        <div><span className="font-semibold text-white">Estimated Delivery:</span> {selectedOrderDetails.estimatedDeliveryDate || "Calculating..."}</div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="space-y-1 w-full max-w-xs">
                          <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground block">Pickup Date</label>
                          <input
                            type="date"
                            value={pickupDate}
                            onChange={e => setPickupDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none w-full"
                          />
                        </div>
                        <button
                          onClick={async () => {
                            const updated = await schedulePickup(selectedOrderDetails.userId, selectedOrderDetails.id, pickupDate);
                            if (updated) {
                              toast.success("Courier pickup scheduled successfully!");
                              setSelectedOrderDetails((prev: any) => ({
                                ...prev,
                                ...updated,
                                items: (Array.isArray(updated?.items) && updated.items.length > 0) ? updated.items : prev?.items
                              }));
                            } else {
                              toast.error("Failed to schedule pickup.");
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-bold px-4 py-2 rounded-lg cursor-pointer"
                        >
                          Schedule Courier Pickup
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Scheduled / Shipped */}
                  {["Pickup Scheduled", "Shipped", "In Transit", "Out for Delivery", "Delivered"].includes(selectedOrderDetails.status) && (
                    <div className="space-y-3">
                      <div className="text-xs">
                        <div><span className="font-semibold text-white">Courier Partner:</span> {selectedOrderDetails.courierPartner}</div>
                        <div><span className="font-semibold text-white">AWB Code:</span> {selectedOrderDetails.trackingNumber}</div>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={async () => {
                            toast.info("Fetching shipping label PDF...");
                            const url = await fetchOrderLabel(selectedOrderDetails.id);
                            if (url) window.open(url, "_blank");
                            else toast.error("Label PDF not ready yet.");
                          }}
                          className="bg-sky-600/30 hover:bg-sky-600 text-sky-200 hover:text-white border border-sky-500/30 text-[9px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> Get Label PDF
                        </button>
                        <button
                          onClick={async () => {
                            toast.info("Fetching invoice PDF...");
                            const url = await fetchOrderInvoice(selectedOrderDetails.id);
                            if (url) window.open(url, "_blank");
                            else toast.error("Invoice PDF not ready yet.");
                          }}
                          className="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/30 text-[9px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> Get Invoice PDF
                        </button>
                        <button
                          onClick={async () => {
                            toast.info("Fetching manifest PDF...");
                            const url = await fetchOrderManifest(selectedOrderDetails.id);
                            if (url) window.open(url, "_blank");
                            else toast.error("Manifest PDF not ready yet.");
                          }}
                          className="bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 text-[9px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> Get Manifest PDF
                        </button>
                        <button
                          onClick={() => {
                            window.open("https://app.shiprocket.in/shipments", "_blank");
                          }}
                          className="bg-accent/20 hover:bg-accent text-accent hover:text-white border border-accent/30 text-[9px] uppercase font-bold px-3 py-1.5 rounded-lg"
                        >
                          Manage Shipment (Shiprocket Panel)
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Are you sure you want to cancel this order on Shiprocket?")) {
                              const updated = await cancelOrder(selectedOrderDetails.userId, selectedOrderDetails.id);
                              if (updated) {
                                toast.success("Order cancelled successfully!");
                                setSelectedOrderDetails(updated);
                              } else {
                                toast.error("Failed to cancel order.");
                              }
                            }
                          }}
                          className="bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[9px] uppercase font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel Shipment
                        </button>
                        <button
                          onClick={() => {
                            // trigger printing overlays
                            window.print();
                          }}
                          className="bg-white/5 hover:bg-white/10 text-white text-[9px] uppercase font-bold px-3 py-1.5 rounded-lg"
                        >
                          Print Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Status & Delivery Management form */}
                <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-4">
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Shipment Status Operations</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Modify Status</label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                        className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                      >
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Ready to Ship">Ready to Ship</option>
                        <option value="Ready to Dispatch">Ready to Dispatch</option>
                        <option value="Delivered by Tomorrow">Delivered by Tomorrow</option>
                        <option value="Delivered by Today">Delivered by Today</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Returned">Returned</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Modify Payment Status</label>
                      <select
                        value={editPaymentStatus}
                        onChange={e => setEditPaymentStatus(e.target.value)}
                        className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tracking / AWB ID</label>
                      <input
                        type="text"
                        value={editTrackingNum}
                        onChange={e => setEditTrackingNum(e.target.value)}
                        placeholder="e.g. AWB-98319"
                        className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Courier Name</label>
                      <input
                        type="text"
                        value={editCourier}
                        onChange={e => setEditCourier(e.target.value)}
                        placeholder="e.g. Delhivery"
                        className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Estimated Delivery</label>
                      <input
                        type="text"
                        value={editEstDelivery}
                        onChange={e => setEditEstDelivery(e.target.value)}
                        placeholder="e.g. July 20, 2026"
                        className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          toast.info("Syncing live tracking from Shiprocket API...");
                          const updated = await syncShiprocketTracking(selectedOrderDetails.userId, selectedOrderDetails.id);
                          if (updated) {
                            toast.success("Shipment tracking synced with Shiprocket!");
                            setSelectedOrderDetails((prev: any) => ({
                              ...prev,
                              ...updated,
                              items: (Array.isArray(updated?.items) && updated.items.length > 0) ? updated.items : prev?.items
                            }));
                          } else {
                            toast.info("Shipment tracking is up to date.");
                          }
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all text-white cursor-pointer"
                      >
                        Refresh Shipment
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const trk = selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode;
                          if (trk) {
                            window.open(`https://shiprocket.co/tracking/${encodeURIComponent(trk)}`, "_blank");
                          } else {
                            toast.error("AWB Number not assigned yet.");
                          }
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all text-white cursor-pointer"
                      >
                        Open Tracking
                      </button>
                    </div>

                    <AdminButton
                      variant="accent"
                      onClick={() => {
                        updateOrderStatus(selectedOrderDetails.userId, selectedOrderDetails.id, editStatus, {
                          paymentStatus: editPaymentStatus,
                          trackingNumber: editTrackingNum || null,
                          awbCode: editTrackingNum || null,
                          courierPartner: editCourier || null,
                          estimatedDeliveryDate: editEstDelivery || null
                        });
                        toast.success("Shipment operations updated successfully.");
                        setSelectedOrderDetails(null);
                      }}
                    >
                      Save operations
                    </AdminButton>
                  </div>
                </div>

                {selectedOrderDetails.statusHistoryJson && (
                  <div className="space-y-2 border border-white/10 rounded-2xl p-3 bg-white/5">
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Shipment Status Audit Log</h4>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {(() => {
                        try {
                          const history = JSON.parse(selectedOrderDetails.statusHistoryJson);
                          if (!Array.isArray(history) || history.length === 0) return <div className="text-[10px] text-muted-foreground italic">No historical status logs recorded.</div>;
                          return history.map((h: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-1 last:border-0">
                              <div>
                                <span className="text-muted-foreground">{h.previousStatus}</span> → <span className="font-bold text-white">{h.newStatus}</span>
                                <div className="text-[10px] text-muted-foreground">{h.source || "System"} {h.comments ? `· ${h.comments}` : ''} {h.awb ? `(AWB: ${h.awb})` : ''}</div>
                              </div>
                              <div className="text-[9px] text-muted-foreground font-mono">{h.timestamp ? new Date(h.timestamp).toLocaleString() : ''}</div>
                            </div>
                          ));
                        } catch (e) {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Items of the Delivery</h4>
                  <div className="space-y-2 border border-white/10 rounded-2xl p-3 bg-white/5 max-h-40 overflow-y-auto">
                    {(() => {
                      let items: any[] = [];
                      if (Array.isArray(selectedOrderDetails.items) && selectedOrderDetails.items.length > 0) {
                        items = selectedOrderDetails.items;
                      } else if (selectedOrderDetails.itemsJson) {
                        try {
                          const parsed = typeof selectedOrderDetails.itemsJson === 'string' ? JSON.parse(selectedOrderDetails.itemsJson) : selectedOrderDetails.itemsJson;
                          if (Array.isArray(parsed)) items = parsed;
                        } catch {}
                      }
                      if (!items || items.length === 0) {
                        return <div className="text-[10px] text-muted-foreground italic">No item details available for this order.</div>;
                      }
                      return items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center gap-3 py-1 first:pt-0 border-t border-white/5 first:border-0">
                          <div className="flex items-center gap-2">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded-md border border-white/5" />
                            ) : (
                              <div className="w-8 h-10 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-[9px] text-muted-foreground">Ree</div>
                            )}
                            <div>
                              <div className="font-semibold text-white">{item.name || "Product Item"}</div>
                              <div className="text-[10px] text-muted-foreground">{item.house || "ReeVibes"} · Size: {item.selectedSize || "M"}</div>
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <div>{item.price ? (typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price) : "—"}</div>
                            <div className="text-[10px] text-muted-foreground">Qty: {item.qty || 1}</div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrintInvoice(selectedOrderDetails)}
                    className="bg-accent/10 border border-accent/20 hover:bg-accent text-accent hover:text-white px-4 py-2 rounded-xl text-[10px] uppercase font-bold transition-all"
                  >
                    Print Invoice
                  </button>
                  <button
                    onClick={() => handlePrintLabel(selectedOrderDetails)}
                    className="bg-accent/10 border border-accent/20 hover:bg-accent text-accent hover:text-white px-4 py-2 rounded-xl text-[10px] uppercase font-bold transition-all"
                  >
                    Print Label
                  </button>
                  <button
                    onClick={async () => {
                      toast.info("Fetching Shiprocket Manifest PDF...");
                      const url = await fetchOrderManifest(selectedOrderDetails.id);
                      if (url) window.open(url, "_blank");
                      else toast.error("Could not load manifest PDF.");
                    }}
                    className="bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600 text-purple-200 hover:text-white px-4 py-2 rounded-xl text-[10px] uppercase font-bold transition-all"
                  >
                    Print Manifest
                  </button>
                  {(selectedOrderDetails.status === "Processing" || selectedOrderDetails.status === "Pending" || selectedOrderDetails.status === "Pending Approval" || selectedOrderDetails.status === "Accepted") && (
                    <button
                      onClick={async () => {
                        if (confirm(`Decline and cancel Order ${selectedOrderDetails.id}? All ordered product size quantities and total stock will be automatically restored in Supabase.`)) {
                          toast.info("Declining order & restoring stock in Supabase...");
                          const res = await declineOrder(selectedOrderDetails.userId, selectedOrderDetails.id, "Declined by store administrator");
                          if (res && res.success) {
                            toast.success(`Order ${selectedOrderDetails.id} declined. Stock restored in Supabase!`);
                            setSelectedOrderDetails(null);
                          } else {
                            toast.error("Failed to decline order.");
                          }
                        }
                      }}
                      className="bg-rose-600/20 border border-rose-500/30 hover:bg-rose-600 text-rose-300 hover:text-white px-4 py-2 rounded-xl text-[10px] uppercase font-bold transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline & Restore Stock
                    </button>
                  )}
                </div>

                <AdminButton variant="outline" onClick={() => setSelectedOrderDetails(null)}>Close dossier</AdminButton>
              </div>
            </div>
          </div>
        );
      })()}

      {rejectionModalReturnId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="font-serif text-xl">Reject Return Request</h3>
              </div>
              <button onClick={() => setRejectionModalReturnId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Select Rejection Reason</label>
                <select
                  value={selectedRejectionReason}
                  onChange={(e) => setSelectedRejectionReason(e.target.value)}
                  className="w-full bg-surface border border-white/10 p-2 text-sm outline-none text-foreground rounded-lg"
                >
                  <option value="Return window expired">Return window expired</option>
                  <option value="Product used or damaged by customer">Product used or damaged by customer</option>
                  <option value="Missing original tags">Missing original tags</option>
                  <option value="Missing original packaging">Missing original packaging</option>
                  <option value="Insufficient evidence">Insufficient evidence</option>
                  <option value="Non-returnable product">Non-returnable product</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {selectedRejectionReason === "Other" && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Custom Description</label>
                  <textarea
                    required
                    placeholder="Provide specific details for rejection..."
                    value={customRejectionText}
                    onChange={(e) => setCustomRejectionText(e.target.value)}
                    className="w-full h-24 bg-surface border border-white/10 p-2 text-sm outline-none text-foreground rounded-lg resize-none"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <AdminButton variant="outline" onClick={() => setRejectionModalReturnId(null)}>Cancel</AdminButton>
              <button
                onClick={() => {
                  const finalReason = selectedRejectionReason === "Other" ? customRejectionText : selectedRejectionReason;
                  rejectReturn(rejectionModalReturnId, finalReason);
                  setRejectionModalReturnId(null);
                  setCustomRejectionText("");
                }}
                className="editorial-label bg-rose-600 hover:bg-rose-700 text-white px-5 py-2"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {pickupModalReturnId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass max-w-sm w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-xl">Schedule Pickup</h3>
              </div>
              <button onClick={() => setPickupModalReturnId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider font-mono">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDateInput}
                  onChange={(e) => setPickupDateInput(e.target.value)}
                  className="w-full bg-surface border border-white/10 p-2 text-sm outline-none text-foreground rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <AdminButton variant="outline" onClick={() => setPickupModalReturnId(null)}>Cancel</AdminButton>
              <button
                onClick={() => {
                  if (!pickupDateInput) return;
                  updateReturnDetails(pickupModalReturnId, {
                    status: "Pickup Scheduled",
                    pickupDate: pickupDateInput
                  });
                  setPickupModalReturnId(null);
                  setPickupDateInput("");
                }}
                className="editorial-label bg-accent text-white px-5 py-2"
              >
                Confirm Pickup
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReturnDetails && (() => {
        const activeReturn = state.returns.find(r => r.id === selectedReturnDetails.id);
        if (!activeReturn) return null;

        const customer = state.users.find(u => u.id === activeReturn.customerId);
        const order = Object.values(state.orders).flat().find(o => o.id === activeReturn.orderId);

        const statuses = [
          "Return Requested",
          "Under Review",
          "Return Approved",
          "Pickup Scheduled",
          "Item Received",
          "Refund Processed",
          "Refund Completed"
        ];
        
        let currentStepIndex = -1;
        if (activeReturn.status === "Pending") currentStepIndex = 0;
        else if (activeReturn.status === "Under Review") currentStepIndex = 1;
        else if (activeReturn.status === "Return Approved") currentStepIndex = 2;
        else if (activeReturn.status === "Pickup Scheduled") currentStepIndex = 3;
        else if (activeReturn.status === "Item Received") currentStepIndex = 4;
        else if (activeReturn.status === "Refund Processed") currentStepIndex = 5;
        else if (activeReturn.status === "Refund Completed" || activeReturn.status === "Approved") currentStepIndex = 6;
        else if (activeReturn.status === "Rejected") currentStepIndex = -2;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="liquid-glass max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-accent animate-spin-slow" />
                  <div>
                    <h3 className="font-serif text-2xl">Return Request Dossier</h3>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">ID: {activeReturn.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedReturnDetails(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3">
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] border-b border-white/5 pb-1">Customer Details</h4>
                  <div className="space-y-1 leading-normal">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-semibold">{activeReturn.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span>
                        <button
                          onClick={() => {
                            if (customer) {
                              setSelectedCustomerDetails(customer);
                              setSelectedReturnDetails(null);
                            }
                          }}
                          className="font-mono text-accent hover:underline"
                        >
                          {activeReturn.customerId}
                        </button>
                      </span>
                    </div>
                    {customer && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-mono">{customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{customer.phone || "—"}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
                      <span className="text-muted-foreground">Pickup Address:</span>
                      <span className="text-right text-white max-w-[200px] leading-snug">{order?.address || "Address on file"}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3">
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] border-b border-white/5 pb-1">Order & Item Details</h4>
                  <div className="space-y-1 leading-normal">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span>
                        <button
                          onClick={() => {
                            if (order) {
                              setSelectedOrderDetails(order);
                              setSelectedReturnDetails(null);
                            }
                          }}
                          className="font-mono text-accent hover:underline"
                        >
                          {activeReturn.orderId}
                        </button>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product:</span>
                      <span className="font-semibold text-right">{activeReturn.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-mono">{activeReturn.selectedSize || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-mono">{activeReturn.qty || 1}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
                      <span className="text-muted-foreground">Original Order Total:</span>
                      <span className="font-mono text-white">₹{(order?.total || activeReturn.refundAmount).toLocaleString()}</span>
                    </div>
                    {/* Original Payment Mode Badge */}
                    <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
                      <span className="text-muted-foreground font-semibold">Payment Mode:</span>
                      <span>
                        {((order?.paymentMethod || "").toLowerCase().includes("cash") || (order?.paymentMethod || "").toLowerCase().includes("cod")) ? (
                          <span className="text-amber-300 font-bold inline-flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[10px]">
                            <Banknote className="w-3 h-3" /> Cash on Delivery (COD)
                          </span>
                        ) : ((order?.paymentMethod || "").toLowerCase().includes("wallet") && ((order?.razorpayAmountPaid ?? 0) === 0)) ? (
                          <span className="text-purple-300 font-bold inline-flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-[10px]">
                            <Wallet className="w-3 h-3" /> ReeVibes Wallet
                          </span>
                        ) : (((order?.walletAmountUsed ?? 0) > 0) && ((order?.razorpayAmountPaid ?? 0) > 0)) ? (
                          <span className="text-sky-300 font-bold inline-flex items-center gap-1 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 text-[10px]">
                            <Layers3 className="w-3 h-3" /> Split (Wallet + Razorpay)
                          </span>
                        ) : (
                          <span className="text-sky-300 font-bold inline-flex items-center gap-1 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 text-[10px]">
                            <CreditCard className="w-3 h-3" /> Razorpay Online Gateway
                          </span>
                        )}
                      </span>
                    </div>
                    {order && ((order.razorpayAmountPaid ?? 0) > 0 || (order.walletAmountUsed ?? 0) > 0) && (
                      <>
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>• Razorpay Paid:</span>
                          <span className="font-mono text-emerald-400">₹{(order.razorpayAmountPaid || 0).toLocaleString()} {order.razorpayPaymentId ? `(${order.razorpayPaymentId})` : ""}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>• Wallet Used:</span>
                          <span className="font-mono text-amber-300">₹{(order.walletAmountUsed || 0).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
                      <span className="text-muted-foreground font-semibold">Pending Refund Amount:</span>
                      <span className="font-serif font-bold text-accent text-sm">₹{activeReturn.refundAmount.toLocaleString()}</span>
                    </div>
                    {(activeReturn.razorpayRefundAmount ?? 0) > 0 && (
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>• Razorpay Refund:</span>
                        <span className="font-mono text-emerald-300">₹{(activeReturn.razorpayRefundAmount ?? 0).toLocaleString()} {activeReturn.razorpayRefundId ? `(${activeReturn.razorpayRefundId})` : ""}</span>
                      </div>
                    )}
                    {(activeReturn.walletRefundAmount ?? 0) > 0 && (
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>• Wallet Refund:</span>
                        <span className="font-mono text-amber-300">₹{(activeReturn.walletRefundAmount ?? 0).toLocaleString()} {activeReturn.walletTransactionId ? `(${activeReturn.walletTransactionId})` : ""}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-muted-foreground">Refund Method:</span>
                      <span className="font-semibold text-amber-200">{activeReturn.refundMethod || "Pending Settlement"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Return Request Details</h4>
                <div className="border border-white/10 rounded-2xl p-4 bg-white/5 text-xs space-y-3">
                  <div className="grid grid-cols-4">
                    <span className="text-muted-foreground font-semibold">Reason:</span>
                    <span className="col-span-3 font-semibold text-white">{activeReturn.reason}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="text-muted-foreground font-semibold">Description:</span>
                    <span className="col-span-3 leading-relaxed text-muted-foreground italic">
                      "{activeReturn.comment || "No comment provided."}"
                    </span>
                  </div>
                  {activeReturn.rejectionReason && (
                    <div className="grid grid-cols-4 border-t border-rose-500/20 pt-2 text-rose-300">
                      <span className="font-semibold">Rejection:</span>
                      <span className="col-span-3 font-semibold">{activeReturn.rejectionReason}</span>
                    </div>
                  )}
                  {activeReturn.pickupDate && (
                    <div className="grid grid-cols-4 border-t border-white/5 pt-2">
                      <span className="text-muted-foreground font-semibold">Pickup:</span>
                      <span className="col-span-3 text-emerald-300 font-mono">Scheduled for {activeReturn.pickupDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shiprocket Reverse Logistics Management */}
              <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-400" />
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Shiprocket Reverse Logistics (Customer → Warehouse)</h4>
                  </div>
                  {activeReturn.returnAwb && (
                    <span className="font-mono text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded">
                      AWB: {activeReturn.returnAwb}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase font-semibold block">Assigned Courier</span>
                    <span className="font-semibold text-white">{activeReturn.returnCourier || "Shiprocket Reverse Express"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase font-semibold block">Shiprocket Order / Shipment</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {activeReturn.shiprocketReturnOrderId || activeReturn.shiprocketReturnShipmentId 
                        ? `${activeReturn.shiprocketReturnOrderId || '—'} / ${activeReturn.shiprocketReturnShipmentId || '—'}`
                        : "Generated upon assignment"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase font-semibold block">Pickup Date</span>
                    <span className="font-semibold text-emerald-400">{activeReturn.pickupDate || (activeReturn.status === "Return Approved" ? "Ready to schedule" : "Pending approval")}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {activeReturn.status === "Return Approved" && !activeReturn.returnAwb && (
                    <button
                      onClick={async () => {
                        toast.info("Assigning reverse pickup delivery agent via Shiprocket...");
                        const res = await assignReturnPickup(activeReturn.id);
                        if (res) toast.success("Shiprocket Reverse Pickup assigned successfully! AWB created.");
                        else toast.error("Failed to assign reverse pickup.");
                      }}
                      className="bg-sky-600 hover:bg-sky-500 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Truck className="w-3.5 h-3.5" /> Assign Reverse Pickup Agent
                    </button>
                  )}
                  {(activeReturn.status === "Pickup Scheduled" || activeReturn.status === "In Transit") && (
                    <button
                      onClick={() => {
                        updateReturnDetails(activeReturn.id, { status: "Item Received" });
                        toast.success("Item marked received & inspected at warehouse!");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Item Received at Warehouse
                    </button>
                  )}
                </div>
              </div>

              {/* Warehouse Receipt & Pending Refund Settlement Card */}
              <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Warehouse Receipt & Refund Settlement</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    activeReturn.status === "Refund Completed" 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : activeReturn.status === "Item Received"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                      : "bg-white/10 text-muted-foreground border-white/10"
                  }`}>
                    {activeReturn.status === "Refund Completed" ? "Refund Settled" : activeReturn.status === "Item Received" ? "Ready for Refund" : "Awaiting Return Delivery"}
                  </span>
                </div>

                {activeReturn.status === "Refund Completed" ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-emerald-200">
                          Refund Settled Successfully • ₹{activeReturn.refundAmount.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-emerald-300/80">
                          Disbursed on <strong>{activeReturn.refundDate || "Today"}</strong> via <strong>{activeReturn.refundMethod || "Original Payment Instrument"}</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Official Settlement Ledger Card */}
                    <div className="bg-surface-2/90 border border-white/10 rounded-xl p-3.5 space-y-2.5 font-mono text-[11px]">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Settlement Audit Log</span>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                          ACQUIRER CONFIRMED
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {/* Razorpay Refund ID */}
                        {(activeReturn.razorpayRefundId || activeReturn.refundTransactionId) && (
                          <div className="p-2.5 bg-black/30 rounded-lg border border-white/5 space-y-1">
                            <div className="text-muted-foreground text-[10px] uppercase font-bold flex items-center justify-between">
                              <span>Razorpay Refund ID</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(activeReturn.razorpayRefundId || activeReturn.refundTransactionId || "");
                                  toast.success("Razorpay Refund ID copied!");
                                }}
                                className="text-accent hover:text-white flex items-center gap-1 cursor-pointer font-sans text-[10px]"
                              >
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                            <div className="text-sky-300 font-bold text-xs truncate">
                              {activeReturn.razorpayRefundId || activeReturn.refundTransactionId}
                            </div>
                            <div className="text-[9px] text-muted-foreground font-sans">
                              Reversed directly to user's original payment source (UPI/Card/Bank)
                            </div>
                          </div>
                        )}

                        {/* Wallet Transaction ID */}
                        {activeReturn.walletTransactionId && (
                          <div className="p-2.5 bg-black/30 rounded-lg border border-white/5 space-y-1">
                            <div className="text-muted-foreground text-[10px] uppercase font-bold flex items-center justify-between">
                              <span>ReeVibes Wallet Tx</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(activeReturn.walletTransactionId || "");
                                  toast.success("Wallet Transaction ID copied!");
                                }}
                                className="text-accent hover:text-white flex items-center gap-1 cursor-pointer font-sans text-[10px]"
                              >
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                            <div className="text-amber-300 font-bold text-xs truncate">
                              {activeReturn.walletTransactionId}
                            </div>
                            <div className="text-[9px] text-muted-foreground font-sans">
                              Credited directly to customer's store credit balance
                            </div>
                          </div>
                        )}
                      </div>

                      {order?.razorpayPaymentId && (
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-white/5">
                          <span>Original Razorpay Payment ID:</span>
                          <span className="font-bold text-foreground">{order.razorpayPaymentId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeReturn.status === "Item Received" ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200">
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        Returned Item Inspected & Verified at Warehouse
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Customer return received in warehouse. Pending refund amount: <strong className="text-white font-serif text-sm">₹{activeReturn.refundAmount.toLocaleString()}</strong>.
                      </p>
                    </div>

                    {/* Original Payment Information */}
                    <div className="p-3 bg-surface-2 border border-white/5 rounded-xl space-y-1.5 text-[11px]">
                      <div className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Original Order Payment Breakdown:</div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="font-semibold text-white">{order?.paymentMethod || (order?.razorpayPaymentId ? "Razorpay Gateway" : "Cash on Delivery")}</span>
                      </div>
                      {order?.razorpayPaymentId && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Razorpay Payment ID:</span>
                          <span className="font-mono text-sky-400">{order.razorpayPaymentId}</span>
                        </div>
                      )}
                      {(order?.razorpayAmountPaid ?? 0) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Razorpay Amount Paid:</span>
                          <span className="font-mono font-bold text-sky-400">₹{(order?.razorpayAmountPaid ?? 0).toLocaleString()}</span>
                        </div>
                      )}
                      {(order?.walletAmountUsed ?? 0) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wallet Amount Used:</span>
                          <span className="font-mono font-bold text-purple-400">₹{(order?.walletAmountUsed ?? 0).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Select Disbursement Route:</div>

                      {/* Mode-specific actions */}
                      {((order?.paymentMethod || "").toLowerCase().includes("cash") || (order?.paymentMethod || "").toLowerCase().includes("cod")) ? (
                        <div className="space-y-2">
                          <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                            ℹ️ Order was placed with <strong>Cash on Delivery</strong>. Offline cash payments cannot be reversed via card/gateway. The refund will be credited directly to the customer's <strong>ReeVibes Wallet</strong>.
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm(`Deposit ₹${activeReturn.refundAmount.toLocaleString()} into Customer's ReeVibes Wallet?`)) {
                                toast.info("Crediting customer's ReeVibes Wallet...");
                                const res = await processSplitRefund(activeReturn.id, "WALLET");
                                if (res) toast.success("Wallet credited successfully!");
                                else toast.error("Failed to credit wallet.");
                              }
                            }}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                          >
                            <Wallet className="w-4 h-4" /> Credit ₹{activeReturn.refundAmount.toLocaleString()} to ReeVibes Wallet (COD Refund)
                          </button>
                        </div>
                      ) : ((order?.paymentMethod || "").toLowerCase().includes("wallet") && ((order?.razorpayAmountPaid ?? 0) === 0)) ? (
                        <div className="space-y-2">
                          <div className="text-[11px] text-purple-300 bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20">
                            ℹ️ Order was paid 100% using <strong>ReeVibes Wallet Credits</strong>. The full refund will be restored to their wallet balance.
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm(`Refund ₹${activeReturn.refundAmount.toLocaleString()} back to Customer's ReeVibes Wallet?`)) {
                                toast.info("Refunding to ReeVibes Wallet...");
                                const res = await processSplitRefund(activeReturn.id, "WALLET");
                                if (res) toast.success("Wallet refund processed!");
                                else toast.error("Failed to refund to wallet.");
                              }
                            }}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs uppercase font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                          >
                            <Wallet className="w-4 h-4" /> Refund ₹{activeReturn.refundAmount.toLocaleString()} to ReeVibes Wallet
                          </button>
                        </div>
                      ) : (((order?.walletAmountUsed ?? 0) > 0) && ((order?.razorpayAmountPaid ?? 0) > 0)) ? (
                        <div className="space-y-2">
                          <div className="text-[11px] text-sky-300 bg-sky-500/10 p-2.5 rounded-lg border border-sky-500/20">
                            ℹ️ Order was a <strong>Split Payment</strong> (₹{order?.walletAmountUsed} Wallet + ₹{order?.razorpayAmountPaid} Razorpay). This will refund only the Razorpay portion to the payment instrument and the remainder to Wallet.
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm(`Execute Split Refund of ₹${activeReturn.refundAmount.toLocaleString()} (Wallet + Razorpay Gateway)?`)) {
                                toast.info("Processing split refund...");
                                const res = await processSplitRefund(activeReturn.id, "AUTO");
                                if (res) toast.success("Split refund executed successfully!");
                                else toast.error("Failed to process split refund.");
                              }
                            }}
                            className="w-full bg-accent hover:bg-accent/90 text-white text-xs uppercase font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                          >
                            <Layers3 className="w-4 h-4" /> Execute Split Refund (Wallet + Razorpay)
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-[11px] text-sky-300 bg-sky-500/10 p-2.5 rounded-lg border border-sky-500/20">
                            ℹ️ Order was paid via <strong>Razorpay Online Gateway</strong>. Refunding via Razorpay calls the Razorpay Refund API to return the amount back to the customer's source payment instrument (Card/UPI/Netbanking).
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={async () => {
                                if (confirm(`Trigger Razorpay API Refund of ₹${activeReturn.refundAmount.toLocaleString()} to original payment instrument?`)) {
                                  toast.info("Triggering Razorpay API refund...");
                                  const res = await processSplitRefund(activeReturn.id, "RAZORPAY");
                                  if (res) toast.success("Razorpay API refund initiated successfully!");
                                  else toast.error("Failed to trigger Razorpay refund.");
                                }
                              }}
                              className="flex-1 bg-sky-600 hover:bg-sky-500 text-white text-xs uppercase font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                            >
                              <CreditCard className="w-4 h-4" /> Refund via Razorpay API (₹{activeReturn.refundAmount.toLocaleString()})
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Deposit ₹${activeReturn.refundAmount.toLocaleString()} into Customer's ReeVibes Wallet instead?`)) {
                                  toast.info("Crediting customer's ReeVibes Wallet...");
                                  const res = await processSplitRefund(activeReturn.id, "WALLET");
                                  if (res) toast.success("Wallet credited successfully!");
                                  else toast.error("Failed to credit wallet.");
                                }
                              }}
                              className="bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs uppercase font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Wallet className="w-4 h-4" /> Or Store Credit (Wallet)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Refund options will unlock once the return parcel is marked as received and inspected at the warehouse.
                  </p>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Return Status Timeline</h4>
                {activeReturn.status === "Rejected" ? (
                  <div className="p-3 border border-rose-500/20 rounded-xl bg-rose-500/5 text-rose-300 text-center flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Return Request Rejected: {activeReturn.rejectionReason}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1 relative pt-4 pb-2">
                    <div className="absolute top-7 left-[7%] right-[7%] h-0.5 bg-white/10 -z-10">
                      <div
                        className="h-full bg-accent shadow-[0_0_8px_rgba(217,119,6,0.5)] transition-all duration-500"
                        style={{ width: `${(currentStepIndex / 6) * 100}%` }}
                      />
                    </div>

                    {statuses.map((stepName, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      return (
                        <div key={stepName} className="flex flex-col items-center text-center space-y-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                              isActive
                                ? "bg-accent border-accent text-white shadow-[0_0_12px_#d97706]"
                                : isCompleted
                                ? "bg-accent/20 border-accent text-accent"
                                : "bg-zinc-950 border-white/20 text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                          </div>
                          <span
                            className={`text-[8px] leading-tight font-semibold tracking-wider transition-colors max-w-[80px] ${
                              isActive ? "text-accent font-bold" : isCompleted ? "text-white" : "text-muted-foreground"
                            }`}
                          >
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 justify-end">
                {activeReturn.status !== "Rejected" && activeReturn.status !== "Refund Completed" && (
                  <>
                    <button
                      onClick={() => updateReturnDetails(activeReturn.id, { status: "Under Review" })}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-white/10"
                    >
                      Request More Info
                    </button>
                    
                    {(activeReturn.status === "Return Requested" || activeReturn.status === "Pending" || activeReturn.status === "Under Review") && (
                      <button
                        onClick={async () => {
                          await approveReturn(activeReturn.id);
                          toast.success("Return request approved!");
                        }}
                        className="bg-emerald-600/35 hover:bg-emerald-600 text-emerald-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-emerald-500/20"
                      >
                        Approve Return
                      </button>
                    )}

                    {activeReturn.status === "Return Approved" && (
                      <button
                        onClick={async () => {
                          toast.info("Assigning reverse pickup on Shiprocket...");
                          const res = await assignReturnPickup(activeReturn.id);
                          if (res) toast.success("Shiprocket Reverse Pickup assigned successfully!");
                          else toast.error("Failed to assign reverse pickup");
                        }}
                        className="bg-sky-600/35 hover:bg-sky-600 text-sky-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-sky-500/20 flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" /> Assign Reverse Pickup
                      </button>
                    )}

                    {(activeReturn.status === "Pickup Scheduled" || activeReturn.status === "In Transit") && (
                      <button
                        onClick={() => {
                          updateReturnDetails(activeReturn.id, { status: "Item Received" });
                          toast.success("Item marked received at warehouse!");
                        }}
                        className="bg-indigo-600/35 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-indigo-500/20"
                      >
                        Mark Item Received
                      </button>
                    )}

                    {activeReturn.status === "Item Received" && (
                      <button
                        onClick={async () => {
                          const isCod = ((order?.paymentMethod || "").toLowerCase().includes("cash") || (order?.paymentMethod || "").toLowerCase().includes("cod"));
                          const isWlt = ((order?.paymentMethod || "").toLowerCase().includes("wallet") && ((order?.razorpayAmountPaid ?? 0) === 0));
                          const isSplt = (((order?.walletAmountUsed ?? 0) > 0) && ((order?.razorpayAmountPaid ?? 0) > 0));
                          const mode = isCod ? "WALLET" : isWlt ? "WALLET" : isSplt ? "AUTO" : "RAZORPAY";
                          const label = isCod ? "Credit to ReeVibes Wallet (COD)" : isWlt ? "Refund to ReeVibes Wallet" : isSplt ? "Split Refund (Wallet + Razorpay)" : "Refund via Razorpay API";

                          if (confirm(`Execute ${label} of ₹${activeReturn.refundAmount.toLocaleString()} for Return ${activeReturn.id}?`)) {
                            toast.info(`Executing ${label}...`);
                            const res = await processSplitRefund(activeReturn.id, mode);
                            if (res) toast.success("Refund processed successfully!");
                            else toast.error("Failed to process refund");
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg shadow-lg flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> 
                        {((order?.paymentMethod || "").toLowerCase().includes("cash") || (order?.paymentMethod || "").toLowerCase().includes("cod")) 
                          ? "Refund to Wallet (COD)" 
                          : (((order?.walletAmountUsed ?? 0) > 0) && ((order?.razorpayAmountPaid ?? 0) > 0))
                          ? "Split Refund"
                          : ((order?.paymentMethod || "").toLowerCase().includes("wallet") && ((order?.razorpayAmountPaid ?? 0) === 0))
                          ? "Refund to Wallet"
                          : "Refund via Razorpay API"}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setRejectionModalReturnId(activeReturn.id);
                        setSelectedRejectionReason("Return window expired");
                        setCustomRejectionText("");
                      }}
                      className="bg-rose-600/35 hover:bg-rose-600 text-rose-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-rose-500/20"
                    >
                      Reject Return
                    </button>
                  </>
                )}
                <AdminButton variant="outline" onClick={() => setSelectedReturnDetails(null)}>Close Dossier</AdminButton>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RAZORPAY EVENT INSPECT MODAL */}
      {selectedRzpEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border-subtle rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-2">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-accent" />
                <div>
                  <h3 className="font-serif text-lg text-foreground font-bold">
                    Razorpay Webhook Event Dossier
                  </h3>
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="text-emerald-400 font-bold">{selectedRzpEvent.event_type}</span>
                    &bull;
                    <span>{selectedRzpEvent.entity_id || selectedRzpEvent.id}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRzpEvent(null)}
                className="text-muted-foreground hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/30 p-3.5 rounded-xl border border-white/5">
                <div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Amount</div>
                  <div className="font-mono text-sm font-bold text-accent mt-0.5">
                    {selectedRzpEvent.amount ? `₹${selectedRzpEvent.amount.toLocaleString()}` : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Status</div>
                  <div className="font-mono text-xs font-bold text-foreground mt-0.5 uppercase">
                    {selectedRzpEvent.status || "RECEIVED"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Signature</div>
                  <div className="font-mono text-xs font-bold text-emerald-400 mt-0.5">
                    {selectedRzpEvent.signature_valid ? "HMAC Valid" : "Unverified"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Timestamp</div>
                  <div className="font-mono text-xs text-muted-foreground mt-0.5">
                    {formatOrderDateTime(selectedRzpEvent.created_at)}
                  </div>
                </div>
              </div>

              {selectedRzpEvent.error_description && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300">
                  <span className="font-bold uppercase text-[10px] block mb-1">Error / Failure Notification</span>
                  {selectedRzpEvent.error_code && <span className="font-mono font-bold mr-2">[{selectedRzpEvent.error_code}]</span>}
                  {selectedRzpEvent.error_description}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-accent" /> Raw JSON Payload
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedRzpEvent.payload_json || selectedRzpEvent, null, 2));
                      toast.success("JSON copied to clipboard!");
                    }}
                    className="text-accent hover:text-white text-[11px] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy JSON
                  </button>
                </div>
                <pre className="bg-black/60 p-4 rounded-xl border border-white/10 font-mono text-[11px] text-foreground/90 overflow-x-auto max-h-64 leading-relaxed">
                  {JSON.stringify(selectedRzpEvent.payload_json || selectedRzpEvent, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-border-subtle bg-surface-2 flex justify-end gap-2">
              <AdminButton variant="outline" onClick={() => setSelectedRzpEvent(null)}>Close Dossier</AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* 1. OVERVIEW & ANALYTICS */}
      {tab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Control Bar: Timeframe Filters & Real-Time Sync Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-2/60 border border-border-subtle p-4 rounded-sm backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="editorial-label text-foreground/90 font-semibold tracking-wider">
                  Supabase Live Sync
                </span>
              </div>
              <span className="hidden sm:inline text-border-subtle">|</span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Last synced: {lastOverviewSyncTime}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Timeframe Selector Pills */}
              <div className="inline-flex rounded-sm p-1 bg-surface-1 border border-border-subtle">
                {(
                  [
                    { id: "today", label: "Today" },
                    { id: "7days", label: "7 Days" },
                    { id: "30days", label: "30 Days" },
                    { id: "all_time", label: "All Time" },
                  ] as const
                ).map((tf) => (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setOverviewTimeframe(tf.id)}
                    className={cn(
                      "px-3.5 py-1 text-xs tracking-wider uppercase font-semibold transition-all duration-200 rounded-sm cursor-pointer",
                      overviewTimeframe === tf.id
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Manual Refresh Button */}
              <AdminButton
                variant="outline"
                onClick={handleRefreshOverview}
                disabled={isRefreshingOverview}
                className="flex items-center gap-2 text-xs py-1 px-3 border-border-subtle hover:border-accent"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isRefreshingOverview && "animate-spin")} />
                <span>{isRefreshingOverview ? "Syncing..." : "Sync Live Data"}</span>
              </AdminButton>
            </div>
          </div>

          {/* Section 1: Hero Performance & Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminCard className="relative overflow-hidden group hover:border-accent/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="editorial-label text-muted-foreground">
                    Net Revenue ({overviewTimeframe === "today" ? "Today" : overviewTimeframe === "7days" ? "7 Days" : overviewTimeframe === "30days" ? "30 Days" : "All Time"})
                  </div>
                  <div className="font-serif text-3xl mt-2 text-foreground font-semibold">
                    ₹{overviewMetrics.netRevenueAmount.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground mt-3 flex items-center justify-between border-t border-border-subtle pt-2">
                <span>Turnover − Refunds</span>
                <span className="font-mono text-emerald-400">
                  ₹{(overviewMetrics.turnoverAmount - overviewMetrics.settledRefundAmount).toLocaleString()}
                </span>
              </div>
            </AdminCard>

            <AdminCard className="relative overflow-hidden group hover:border-accent/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="editorial-label text-muted-foreground">
                    Turnover (GMV)
                  </div>
                  <div className="font-serif text-3xl mt-2 text-foreground font-semibold">
                    ₹{overviewMetrics.turnoverAmount.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground mt-3 flex items-center justify-between border-t border-border-subtle pt-2">
                <span>Total Bookings</span>
                <span className="font-mono text-foreground">{overviewMetrics.totalOrdersCount} orders</span>
              </div>
            </AdminCard>

            <AdminCard className="relative overflow-hidden group hover:border-accent/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="editorial-label text-muted-foreground">
                    Total Orders
                  </div>
                  <div className="font-serif text-3xl mt-2 text-foreground font-semibold">
                    {overviewMetrics.totalOrdersCount}
                  </div>
                </div>
                <div className="p-2.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground mt-3 flex items-center justify-between border-t border-border-subtle pt-2">
                <span>Delivered / In Transit</span>
                <span className="font-mono text-sky-400">
                  {overviewMetrics.deliveredOrdersCount} / {overviewMetrics.inShippingCount}
                </span>
              </div>
            </AdminCard>

            <AdminCard className="relative overflow-hidden group hover:border-accent/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="editorial-label text-muted-foreground">
                    New Users
                  </div>
                  <div className="font-serif text-3xl mt-2 text-foreground font-semibold">
                    {overviewMetrics.newUsersCount}
                  </div>
                </div>
                <div className="p-2.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground mt-3 flex items-center justify-between border-t border-border-subtle pt-2">
                <span>Registered Profiles</span>
                <span className="font-mono text-purple-400">
                  {overviewTimeframe === "today" ? "Active today" : "In period"}
                </span>
              </div>
            </AdminCard>
          </div>

          {/* Section 2: Order Fulfillment & Reverse Operations Funnel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium">Order Operations & Action Pipeline</h3>
                <p className="text-xs text-muted-foreground">Real-time status breakdown across active orders and customer requests</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* 1. Orders to Accept */}
              <AdminCard className={cn(
                "p-4 flex flex-col justify-between border transition-all",
                overviewMetrics.pendingApprovalCount > 0 ? "border-amber-500/40 bg-amber-500/[0.03]" : "border-border-subtle"
              )}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="editorial-label text-muted-foreground">To Accept</span>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 font-semibold rounded tracking-wider uppercase",
                      overviewMetrics.pendingApprovalCount > 0 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-surface-2 text-muted-foreground"
                    )}>
                      {overviewMetrics.pendingApprovalCount > 0 ? "Action" : "Clear"}
                    </span>
                  </div>
                  <div className="font-serif text-2xl font-bold mt-2 text-amber-400">
                    {overviewMetrics.pendingApprovalCount}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Pending admin acceptance
                  </p>
                </div>
                <Link
                  to="/admin"
                  search={{ tab: "orders" } as any}
                  className="mt-3 text-[11px] text-accent hover:underline flex items-center gap-1 font-medium pt-2 border-t border-border-subtle"
                >
                  Review Orders <ArrowUpRight className="w-3 h-3" />
                </Link>
              </AdminCard>

              {/* 2. Pending Refunds */}
              <AdminCard className={cn(
                "p-4 flex flex-col justify-between border transition-all",
                overviewMetrics.pendingRefundCount > 0 ? "border-rose-500/40 bg-rose-500/[0.03]" : "border-border-subtle"
              )}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="editorial-label text-muted-foreground">Pending Refund</span>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 font-semibold rounded tracking-wider uppercase",
                      overviewMetrics.pendingRefundCount > 0 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-surface-2 text-muted-foreground"
                    )}>
                      {overviewMetrics.pendingRefundCount > 0 ? "Payout Due" : "Settled"}
                    </span>
                  </div>
                  <div className="font-serif text-2xl font-bold mt-2 text-rose-400">
                    {overviewMetrics.pendingRefundCount}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                    ₹{overviewMetrics.pendingRefundAmount.toLocaleString()} liability
                  </p>
                </div>
                <Link
                  to="/admin"
                  search={{ tab: "returns" } as any}
                  className="mt-3 text-[11px] text-rose-400 hover:underline flex items-center gap-1 font-medium pt-2 border-t border-border-subtle"
                >
                  Process Refunds <ArrowUpRight className="w-3 h-3" />
                </Link>
              </AdminCard>

              {/* 3. In Shipping */}
              <AdminCard className="p-4 flex flex-col justify-between border-border-subtle">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="editorial-label text-muted-foreground">In Shipping</span>
                    <span className="text-[9px] px-1.5 py-0.5 font-semibold rounded tracking-wider uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      Transit
                    </span>
                  </div>
                  <div className="font-serif text-2xl font-bold mt-2 text-sky-400">
                    {overviewMetrics.inShippingCount}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Dispatched / In courier route
                  </p>
                </div>
                <Link
                  to="/admin"
                  search={{ tab: "orders" } as any}
                  className="mt-3 text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-medium pt-2 border-t border-border-subtle"
                >
                  Track Logistics <ArrowUpRight className="w-3 h-3" />
                </Link>
              </AdminCard>

              {/* 4. Delivered */}
              <AdminCard className="p-4 flex flex-col justify-between border-border-subtle">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="editorial-label text-muted-foreground">Delivered</span>
                    <span className="text-[9px] px-1.5 py-0.5 font-semibold rounded tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Success
                    </span>
                  </div>
                  <div className="font-serif text-2xl font-bold mt-2 text-emerald-400">
                    {overviewMetrics.deliveredOrdersCount}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {overviewTimeframe === "today" ? "Delivered today" : "Delivered in period"}
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1 pt-2 border-t border-border-subtle">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Fulfilled successfully
                </div>
              </AdminCard>

              {/* 5. Declined / Cancelled */}
              <AdminCard className="p-4 flex flex-col justify-between border-border-subtle">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="editorial-label text-muted-foreground">Declined</span>
                    <span className="text-[9px] px-1.5 py-0.5 font-semibold rounded tracking-wider uppercase bg-surface-2 text-muted-foreground">
                      Closed
                    </span>
                  </div>
                  <div className="font-serif text-2xl font-bold mt-2 text-muted-foreground">
                    {overviewMetrics.declinedOrdersCount}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Cancelled or rejected orders
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1 pt-2 border-t border-border-subtle">
                  <XCircle className="w-3 h-3 text-muted-foreground" /> Closed orders
                </div>
              </AdminCard>
            </div>
          </div>

          {/* Section 3: Dual Analytics Panels (Payments Breakdown & Returns Health) */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Panel 1: Payment Channels Split */}
            <AdminCard className="space-y-5">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div>
                  <h3 className="font-serif text-lg font-medium">Payment Methods Breakdown</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Settlement channels for ₹{overviewMetrics.turnoverAmount.toLocaleString()} gross turnover
                  </p>
                </div>
                <div className="p-2 rounded-full bg-surface-2 text-muted-foreground border border-border-subtle">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-4">
                {/* Razorpay Online */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">Razorpay Online Gateway</span>
                      <span className="text-[9px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded">Cards • UPI • Netbanking</span>
                    </div>
                    <span className="font-serif font-bold text-sm">
                      ₹{overviewMetrics.razorpayPaymentsAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${overviewMetrics.turnoverAmount > 0 ? Math.min(100, Math.round((overviewMetrics.razorpayPaymentsAmount / overviewMetrics.turnoverAmount) * 100)) : 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Direct merchant settlement</span>
                    <span>
                      {overviewMetrics.turnoverAmount > 0 ? ((overviewMetrics.razorpayPaymentsAmount / overviewMetrics.turnoverAmount) * 100).toFixed(1) : "0"}% of volume
                    </span>
                  </div>
                </div>

                {/* ReeVibes Store Wallet */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">ReeVibes Store Wallet</span>
                      <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">Balance • Gift Cards</span>
                    </div>
                    <span className="font-serif font-bold text-sm">
                      ₹{overviewMetrics.walletPaymentsAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${overviewMetrics.turnoverAmount > 0 ? Math.min(100, Math.round((overviewMetrics.walletPaymentsAmount / overviewMetrics.turnoverAmount) * 100)) : 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Store balance debited</span>
                    <span>
                      {overviewMetrics.turnoverAmount > 0 ? ((overviewMetrics.walletPaymentsAmount / overviewMetrics.turnoverAmount) * 100).toFixed(1) : "0"}% of volume
                    </span>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">Cash on Delivery (COD)</span>
                      <span className="text-[9px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded">Doorstep Cash</span>
                    </div>
                    <span className="font-serif font-bold text-sm">
                      ₹{overviewMetrics.codPaymentsAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${overviewMetrics.turnoverAmount > 0 ? Math.min(100, Math.round((overviewMetrics.codPaymentsAmount / overviewMetrics.turnoverAmount) * 100)) : 0}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Courier remittance pending</span>
                    <span>
                      {overviewMetrics.turnoverAmount > 0 ? ((overviewMetrics.codPaymentsAmount / overviewMetrics.turnoverAmount) * 100).toFixed(1) : "0"}% of volume
                    </span>
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Panel 2: Returns & Reverse Logistics Health */}
            <AdminCard className="space-y-5">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div>
                  <h3 className="font-serif text-lg font-medium">Returns & Reverse Logistics</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customer return rate, liability pipeline, and Razorpay auto-refund status
                  </p>
                </div>
                <div className="p-2 rounded-full bg-surface-2 text-muted-foreground border border-border-subtle">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-2/60 border border-border-subtle rounded-sm">
                  <div className="editorial-label text-muted-foreground">Return Rate</div>
                  <div className="font-serif text-2xl font-bold mt-1 text-foreground">
                    {overviewMetrics.totalOrdersCount > 0
                      ? ((overviewMetrics.totalReturnsCount / overviewMetrics.totalOrdersCount) * 100).toFixed(1)
                      : "0.0"}%
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                    {overviewMetrics.totalReturnsCount} requests / {overviewMetrics.totalOrdersCount} orders
                  </div>
                </div>

                <div className="p-3 bg-surface-2/60 border border-border-subtle rounded-sm">
                  <div className="editorial-label text-muted-foreground">Settled Refunds</div>
                  <div className="font-serif text-2xl font-bold mt-1 text-emerald-400">
                    ₹{overviewMetrics.settledRefundAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                    Completed payouts in period
                  </div>
                </div>

                <div className="p-3 bg-surface-2/60 border border-border-subtle rounded-sm">
                  <div className="editorial-label text-muted-foreground">Pending Liability</div>
                  <div className="font-serif text-2xl font-bold mt-1 text-rose-400">
                    ₹{overviewMetrics.pendingRefundAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                    {overviewMetrics.pendingRefundCount} returns waiting payout
                  </div>
                </div>

                <div className="p-3 bg-surface-2/60 border border-border-subtle rounded-sm flex flex-col justify-between">
                  <div className="editorial-label text-muted-foreground">Gateway Status</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">ONLINE</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                    Instant Razorpay Payouts
                  </div>
                </div>
              </div>

              <div className="p-3 bg-surface-1 border border-border-subtle rounded-sm flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Need to inspect and settle returns?</span>
                <Link
                  to="/admin"
                  search={{ tab: "returns" } as any}
                  className="text-accent hover:underline font-medium flex items-center gap-1"
                >
                  Go to Returns & Refunds Dashboard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </AdminCard>
          </div>

          {/* Section 4: Top Selling Products Leaderboard */}
          <AdminCard className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
              <div>
                <h3 className="font-serif text-xl font-medium">Top Selling Products</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Top performing items ranked by units sold and gross revenue during the selected timeframe
                </p>
              </div>
              <Link
                to="/admin"
                search={{ tab: "products" } as any}
                className="text-xs text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                Browse Full Product Catalog <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {overviewMetrics.topProducts.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto opacity-30 text-accent" />
                <p>No product orders recorded in this timeframe.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle text-muted-foreground uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-medium w-12 text-center">Rank</th>
                      <th className="pb-3 font-medium">Product Item & Brand</th>
                      <th className="pb-3 font-medium text-center">Units Sold</th>
                      <th className="pb-3 font-medium text-right">Revenue Generated</th>
                      <th className="pb-3 font-medium text-right">Inventory Status</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/50">
                    {overviewMetrics.topProducts.map((p, idx) => (
                      <tr key={p.id || idx} className="hover:bg-surface-2/40 transition-colors">
                        {/* Rank */}
                        <td className="py-3 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-serif font-bold",
                              idx === 0
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : idx === 1
                                ? "bg-zinc-400/20 text-zinc-300 border border-zinc-400/30"
                                : idx === 2
                                ? "bg-amber-700/20 text-amber-500 border border-amber-700/30"
                                : "text-muted-foreground bg-surface-2"
                            )}
                          >
                            {idx + 1}
                          </span>
                        </td>

                        {/* Product Info */}
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-sm border border-border-subtle flex-shrink-0 bg-surface-2"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80";
                              }}
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-foreground truncate max-w-[220px] sm:max-w-[320px]">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {p.house}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Units Sold */}
                        <td className="py-3 text-center">
                          <span className="font-mono font-semibold text-sm px-2 py-0.5 rounded bg-surface-2 border border-border-subtle">
                            {p.unitsSold} pcs
                          </span>
                        </td>

                        {/* Revenue */}
                        <td className="py-3 text-right">
                          <span className="font-serif font-semibold text-sm text-foreground">
                            ₹{p.revenue.toLocaleString()}
                          </span>
                        </td>

                        {/* Stock status */}
                        <td className="py-3 text-right">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider",
                              p.inStock
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            )}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", p.inStock ? "bg-emerald-400" : "bg-rose-400")} />
                            {p.inStock ? `${p.stockLeft} in stock` : "Out of stock"}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 text-right">
                          <Link
                            to="/admin"
                            search={{ tab: "products" } as any}
                            className="text-[11px] text-accent hover:underline font-medium"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        </div>
      )}

      {/* Buckets Tab */}
      {tab === "buckets" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl">Buckets Curation</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Group catalog products into editorial sets with star-product thumbnails</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRearrangeMode(!rearrangeMode)}
                className={`editorial-label px-5 py-2.5 flex items-center gap-2 border rounded-sm cursor-pointer ${
                  rearrangeMode
                    ? "bg-amber-600 border-amber-600 text-white hover:bg-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                    : "border-white/10 hover:border-accent text-foreground hover:text-accent bg-transparent"
                }`}
              >
                {rearrangeMode ? "Exit Rearrange" : "Rearrange Order"}
              </button>
              <button
                onClick={() => {
                  setEditingBucket(null);
                  setBucketForm({ name: "", productIds: [], starProductId: "", thumbnail: "" });
                  setBucketProductSearch("");
                  setIsAddingBucket(!isAddingBucket);
                }}
                className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {isAddingBucket ? "Collapse Form" : "Create Bucket"}
              </button>
            </div>
          </div>

          {isAddingBucket && (
            <AdminCard className="space-y-6 animate-in slide-in-from-top-4 duration-200">
              <h4 className="font-serif text-lg">{editingBucket ? "Edit Curation Bucket" : "Create New Curation Bucket"}</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!bucketForm.name.trim()) return;
                  const starProd = productsList.find((p: any) => p.id === bucketForm.starProductId);
                  const effectiveThumb = bucketForm.thumbnail || starProd?.image || "";
                  if (editingBucket) {
                    updateBucket(editingBucket.id, {
                      name: bucketForm.name,
                      productIds: bucketForm.productIds,
                      starProductId: bucketForm.starProductId,
                      thumbnail: effectiveThumb,
                    });
                    setEditingBucket(null);
                    setIsAddingBucket(false);
                    triggerModal("success", "Bucket Updated", "The curation bucket has been updated and saved to Supabase.", () => {});
                  } else {
                    createBucket(bucketForm.name, bucketForm.productIds, bucketForm.starProductId, effectiveThumb);
                    setIsAddingBucket(false);
                    triggerModal("success", "Bucket Created", "New curation bucket successfully generated in Supabase.", () => {});
                  }
                  setBucketForm({ name: "", productIds: [], starProductId: "", thumbnail: "" });
                  setBucketProductSearch("");
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Bucket Name</label>
                  <input
                    required
                    className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground"
                    placeholder="e.g. Summer Essentials, Red Carpet Couture"
                    value={bucketForm.name}
                    onChange={(e) => setBucketForm({ ...bucketForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Select Products for Bucket</label>
                  
                  {/* Search Bar for Curation Products */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search products by name or brand/house..."
                      className="w-full bg-surface border border-border-subtle pl-10 pr-4 py-2 text-xs outline-none text-foreground rounded-xl mb-2"
                      value={bucketProductSearch}
                      onChange={(e) => setBucketProductSearch(e.target.value)}
                    />
                  </div>

                  <div className="h-56 overflow-y-auto border border-border-subtle bg-surface p-2 rounded-xl space-y-1.5 scrollbar-thin grid grid-cols-1 md:grid-cols-2 gap-2">
                    {productsList
                      .filter((p: any) => {
                        const isPublished = !p.status || p.status === "PUBLISHED" || p.status === "published";
                        if (!isPublished) return false;

                        if (!bucketProductSearch) return true;
                        const keywords = bucketProductSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);
                        if (keywords.length === 0) return true;

                        let score = 0;
                        keywords.forEach(kw => {
                          const name = String(p.name || "").toLowerCase();
                          const house = String(p.house || "").toLowerCase();
                          const category = String(p.category || "").toLowerCase();
                          const gender = String(p.gender || "").toLowerCase();
                          const fabric = String(p.fabricMaterial || p.material || p.fabric || "").toLowerCase();
                          const description = String(p.description || "").toLowerCase();
                          const color = String(p.color || "").toLowerCase();
                          const type = String(p.type || "").toLowerCase();
                          const sku = String(p.sku || "").toLowerCase();
                          
                          const sizes = (p.sizes || []).map((s: string) => String(s || "").toLowerCase());
                          const sizesStr = sizes.join(",");
                          const stocks = Object.entries(p.stockPerSize || {}).map(([sz, qty]) => `${String(sz).toLowerCase()}:${qty}`);
                          const stocksStr = stocks.join(" ");

                          const price = String(p.price || "").toLowerCase();
                          const originalPrice = String(p.originalPrice || "").toLowerCase();

                          if (["men", "man", "gentlemen", "boy", "male"].includes(kw)) {
                            if (gender === "men" || gender === "unisex") {
                              score++;
                              return;
                            }
                          }
                          if (["women", "woman", "lady", "ladies", "girl", "female"].includes(kw)) {
                            if (gender === "women" || gender === "unisex") {
                              score++;
                              return;
                            }
                          }

                          const catNorm = category.replace("s", "");
                          const kwNorm = kw.replace("s", "");
                          if (catNorm.includes(kwNorm) || kwNorm.includes(catNorm)) {
                            score++;
                            return;
                          }

                          if (
                            name.includes(kw) ||
                            house.includes(kw) ||
                            description.includes(kw) ||
                            color.includes(kw) ||
                            fabric.includes(kw) ||
                            type.includes(kw) ||
                            sku.includes(kw) ||
                            sizesStr.includes(kw) ||
                            stocksStr.includes(kw) ||
                            price.includes(kw) ||
                            originalPrice.includes(kw)
                          ) {
                            score++;
                            return;
                          }
                        });
                        return score === keywords.length;
                      })
                      .map((p: any) => {
                        const isChecked = bucketForm.productIds.includes(p.id);
                        const isStar = bucketForm.starProductId === p.id;
                        
                        return (
                          <div
                            key={p.id}
                            className={`flex items-center justify-between text-xs p-1.5 rounded transition-colors ${
                              isChecked ? "bg-white/5 border border-white/5" : "hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer select-none flex-1 truncate">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const nextProductIds = e.target.checked
                                    ? [...bucketForm.productIds, p.id]
                                    : bucketForm.productIds.filter((id) => id !== p.id);
                                  
                                  let nextStar = bucketForm.starProductId;
                                  if (!e.target.checked && bucketForm.starProductId === p.id) {
                                    nextStar = nextProductIds[0] || "";
                                  } else if (e.target.checked && !bucketForm.starProductId) {
                                    nextStar = p.id;
                                  }

                                  setBucketForm({
                                    ...bucketForm,
                                    productIds: nextProductIds,
                                    starProductId: nextStar
                                  });
                                }}
                                className="rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                              />
                              <img src={p.image} className="w-6 h-8 object-cover rounded" />
                              <span className="truncate">{p.name} ({p.house})</span>
                            </label>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedProductPreview(p);
                                }}
                                className="p-1 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                                title="View Product Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  // Star selection toggles the star status. 
                                  // To make a product star, it MUST also be checked/added to the bucket's product IDs.
                                  const nextProductIds = isChecked
                                    ? bucketForm.productIds
                                    : [...bucketForm.productIds, p.id];
                                  
                                  setBucketForm({
                                    ...bucketForm,
                                    productIds: nextProductIds,
                                    starProductId: isStar ? "" : p.id
                                  });
                                }}
                                className={`p-1 hover:text-amber-400 transition-colors cursor-pointer ${
                                  isStar ? "text-amber-400" : "text-muted-foreground/30"
                                }`}
                                title={isStar ? "Remove Star (Thumbnail)" : "Set as Star (Thumbnail)"}
                              >
                                <Star className={`w-4.5 h-4.5 ${isStar ? "fill-current" : ""}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {bucketForm.productIds.length > 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Select Star Product (Use as Thumbnail)</label>
                      <select
                        className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground"
                        value={bucketForm.starProductId || ""}
                        onChange={(e) => {
                          const starId = e.target.value;
                          const starProd = productsList.find((p: any) => p.id === starId);
                          setBucketForm({
                            ...bucketForm,
                            starProductId: starId,
                            thumbnail: bucketForm.thumbnail || (starProd?.image || "")
                          });
                        }}
                      >
                        <option value="">-- Choose Star Product --</option>
                        {productsList
                          .filter((p: any) => bucketForm.productIds.includes(p.id))
                          .map((p: any) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Thumbnail)
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Custom Thumbnail Image URL (Optional)</label>
                      <input
                        type="url"
                        className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground"
                        placeholder="https://... (Leave blank to use star product image)"
                        value={bucketForm.thumbnail || ""}
                        onChange={(e) => setBucketForm({ ...bucketForm, thumbnail: e.target.value })}
                      />
                      {bucketForm.thumbnail && (
                        <div className="flex items-center gap-3 pt-1">
                          <img src={bucketForm.thumbnail} alt="Preview" className="w-12 h-16 object-cover rounded border border-white/10" />
                          <span className="text-xs text-muted-foreground">Thumbnail preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                  <AdminButton type="button" variant="outline" onClick={() => setIsAddingBucket(false)}>Cancel</AdminButton>
                  <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 cursor-pointer">
                    {editingBucket ? "Save Changes" : "Create Bucket"}
                  </button>
                </div>
              </form>
            </AdminCard>
          )}

          <div className={`${rearrangeMode ? "flex flex-col gap-3" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
            {(state.buckets || []).map((b, idx) => {
              const starProd = productsList.find((p) => p.id === b.starProductId) || productsList.find((p) => b.productIds.includes(p.id));
              const thumbnail = b.thumbnail || starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";

              if (rearrangeMode) {
                return (
                  <div
                    key={b.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className="liquid-glass border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-4 flex items-center justify-between cursor-move hover:bg-amber-500/10 transition-all select-none animate-in fade-in duration-200 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-amber-500 font-bold font-mono text-sm px-2">☰</div>
                      <img src={thumbnail} className="w-10 h-14 object-cover rounded-lg border border-white/10" />
                      <div>
                        <h4 className="font-serif text-lg text-foreground font-bold">{b.name}</h4>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                          {b.productIds.length} Products Linked · Position #{idx + 1}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBucket(idx, idx - 1);
                          }}
                          className="px-2.5 py-1 bg-surface border border-border-subtle hover:border-amber-500 rounded text-xs text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === (state.buckets || []).length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBucket(idx, idx + 1);
                          }}
                          className="px-2.5 py-1 bg-surface border border-border-subtle hover:border-amber-500 rounded text-xs text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Down"
                        >
                          ↓
                        </button>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${b.hidden ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                        {b.hidden ? "Hidden" : "Visible"}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={b.id} className="liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden bg-transparent border border-white/10 rounded-3xl">
                  <div className="aspect-[3/4] overflow-hidden bg-zinc-950 relative">
                    <img src={thumbnail} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-3 left-3 bg-accent/95 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold rounded-full">
                      #{idx + 1} · {b.productIds.length} Products
                    </span>
                    {b.starProductId && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold flex items-center gap-1 rounded-full">
                        ★ Star Selection
                      </span>
                    )}
                    {b.hidden && (
                      <span className="absolute bottom-3 right-3 bg-rose-600 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="editorial-label text-muted-foreground text-[10px]">Position #{idx + 1} · Curation Bucket</div>
                      <h4 className="font-serif text-lg mt-1 text-foreground">{b.name}</h4>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        Contains: {b.productIds.map(pid => productsList.find(p => p.id === pid)?.name || pid).join(", ") || "No products linked"}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border-subtle">
                      <button
                        onClick={() => {
                          setEditingBucket(b);
                          setBucketForm({
                            name: b.name,
                            productIds: b.productIds,
                            starProductId: b.starProductId || "",
                            thumbnail: b.thumbnail || ""
                          });
                          setBucketProductSearch("");
                          setIsAddingBucket(true);
                        }}
                        className="flex-1 border border-foreground/30 hover:border-foreground py-2 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          updateBucket(b.id, { hidden: !b.hidden });
                          toast.success(b.hidden ? `Bucket "${b.name}" is now visible in collections.` : `Bucket "${b.name}" is now hidden from collections.`);
                        }}
                        className={`border py-2 px-3 text-[10px] flex items-center justify-center cursor-pointer ${
                          b.hidden ? "border-rose-500/30 hover:border-rose-500 text-rose-400" : "border-emerald-500/30 hover:border-emerald-500 text-emerald-400"
                        }`}
                        title={b.hidden ? "Unhide Bucket" : "Hide Bucket"}
                      >
                        {b.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          triggerModal("danger", "Delete Bucket", "Are you sure you want to permanently delete this curation bucket?", () => {
                            deleteBucket(b.id);
                          });
                        }}
                        className="border border-rose-500/30 hover:border-rose-500 text-rose-400 py-2 px-3 text-[10px] flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. HOMEPAGE LAYOUT DASHBOARD */}
      {tab === "homepage" && draftLayout && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header & Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-2 border border-border-subtle p-4 rounded-2xl liquid-glass">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-serif text-xl">Homepage Layout Dashboard</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Customize, reorder, and publish sections for shop.reevibes.com</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className={`w-2 h-2 rounded-full ${homepageSyncStatus === "saving" ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
                <span>{homepageSyncStatus === "saving" ? "Saving to Supabase..." : "Supabase Cloud Synced"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  updateHomepageLayoutDraft(draftLayout);
                  window.open("/?preview=true", "_blank");
                }}
                className="editorial-label text-xs bg-surface-3 hover:bg-surface-4 text-foreground border border-border-subtle px-4 py-2 rounded-full transition-all inline-flex items-center gap-1 cursor-pointer"
              >
                External Preview <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isPublishingLive}
                onClick={async () => {
                  if (!draftLayout) return;
                  setIsPublishingLive(true);
                  try {
                    if (draftSaveTimeoutRef.current) {
                      clearTimeout(draftSaveTimeoutRef.current);
                    }
                    updateHomepageLayoutDraft(draftLayout);
                    const ok = await publishHomepageLayout(draftLayout);
                    if (ok) {
                      setHomepageSyncStatus("saved");
                      toast.success("Published live! Changes are now active on reevibes.com and synced across all devices and networks.");
                    }
                  } catch (err: any) {
                    toast.error(err?.message || "Failed to publish live.");
                  } finally {
                    setIsPublishingLive(false);
                  }
                }}
                className="editorial-label text-xs bg-accent text-white px-5 py-2 rounded-full hover:bg-accent/90 transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isPublishingLive ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing Live...</span>
                  </>
                ) : (
                  <span>Publish Live</span>
                )}
              </button>
              <button
                onClick={() => {
                  triggerModal(
                    "danger",
                    "Revert Layout Changes",
                    "Are you sure you want to discard all your draft changes and restore the homepage layout to the last published live version in the database?",
                    async () => {
                      await revertHomepageLayout();
                      draftInitializedRef.current = false;
                      setDraftLayout(null); // Force re-render from state
                    }
                  );
                }}
                className="editorial-label text-xs border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 px-4 py-2 rounded-full transition-all cursor-pointer"
              >
                Revert Changes
              </button>
            </div>
          </div>

          {/* Split Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Expanded Center Column: Homepage Layout Controls */}
            <div className="lg:col-span-12 max-w-4xl mx-auto w-full space-y-6">
              
              {/* Sections Reordering Panel */}
              <AdminCard className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h4 className="font-serif text-md">Sections Panel</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const id = `section-${Date.now()}`;
                        const name = prompt("Enter Section Name:", "New Curation Section");
                        if (!name) return;
                        updateDraft({
                          ...draftLayout,
                          sectionOrder: [...draftLayout.sectionOrder, id],
                          [id]: {
                            id,
                            name,
                            subname: "",
                            enabled: true,
                            bucketIds: [],
                            productIds: []
                          }
                        }, true);
                        setActiveSectionId(id);
                      }}
                      className="bg-accent/20 text-accent hover:bg-accent hover:text-white px-2.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                    >
                      + Add Section
                    </button>
                    <button
                      onClick={() => {
                        const id = `subbanner-${Date.now()}`;
                        const name = prompt("Enter Sub Banner Title:", "New Sub Banner");
                        if (!name) return;
                        updateDraft({
                          ...draftLayout,
                          sectionOrder: [...draftLayout.sectionOrder, id],
                          [id]: {
                            id,
                            title: name,
                            subtitle: "",
                            buttonText: "Explore Collection",
                            redirectUrl: "/shop",
                            desktopImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80",
                            mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
                            videoUrl: "",
                            scale: 1.0,
                            xOffset: 0,
                            yOffset: 0,
                            enabled: true
                          }
                        }, true);
                        setActiveSectionId(id);
                      }}
                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-2.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                    >
                      + Sub Banner
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2 divide-y divide-white/5 scrollbar-thin">
                  {(() => {
                    const rawList = (draftLayout.sectionOrder || []).filter(
                      (id: string) => !["navigation", "footer"].includes(id)
                    );
                    const filteredList = rawList.includes("chatbot") ? rawList : [...rawList, "chatbot"];
                    return filteredList.map((secId: string, idx: number) => {
                      const sec = draftLayout[secId];
                      if (!sec) return null;
                      const isSelected = activeSectionId === secId;

                      let displayName = secId;
                      if (secId === "announcement") displayName = "Top Announcement Bar";
                      else if (secId === "hero") displayName = "Hero Banner Carousel";
                      else if (secId === "categories") displayName = "Categories Grid";
                      else if (secId === "flashSale") displayName = "Flash Sale Countdown";
                      else if (secId === "trending") displayName = "Trending Products";
                      else if (secId === "newArrivals" || secId === "newArrival") displayName = "New Arrivals";
                      else if (secId === "campaign") displayName = "Campaign Banner";
                      else if (secId === "collections") displayName = "Featured Collections";
                      else if (secId === "liveFeed") displayName = "liveFeed";
                      else if (secId === "bestSellers") displayName = "Best Sellers";
                      else if (secId === "limitedStock") displayName = "Limited Stock";
                      else if (secId === "influencerPicks") displayName = "Influencer Favorites";
                      else if (secId === "reviews") displayName = "reviews";
                      else if (secId === "recentlyViewed") displayName = "Recently Viewed Products";
                      else if (secId === "recommended") displayName = "Recommended Products";
                      else if (secId === "brandStory") displayName = "Brand Story";
                      else if (secId === "newsletter") displayName = "Newsletter Signup";
                      else if (secId === "chatbot") displayName = "AI Chatbot Overlay";
                      else if (secId.startsWith("section-")) displayName = `Section: ${sec.name || "Unnamed"}`;
                      else if (secId.startsWith("subbanner-")) displayName = `Sub Banner: ${sec.title || sec.name || "Unnamed"}`;

                      return (
                        <div
                          key={secId}
                          className={`flex items-center justify-between py-2.5 transition-all ${
                            isSelected ? "bg-accent/10 -mx-2 px-2 border-l-2 border-accent" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setActiveSectionId(secId)}
                              className="text-left hover:text-accent transition-colors"
                            >
                              <div className="text-xs font-semibold text-foreground">
                                {displayName}
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {sec.enabled ? "Active" : "Disabled"}
                              </div>
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Toggle Visibility */}
                            <button
                              type="button"
                              onClick={() => {
                                updateDraft({
                                  ...draftLayout,
                                  [secId]: { ...sec, enabled: !sec.enabled }
                                }, true);
                              }}
                              className={`p-1 rounded ${sec.enabled ? "text-accent" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
                              title={sec.enabled ? "Hide Section" : "Show Section"}
                            >
                              {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            {/* Reordering Actions */}
                            {secId !== "chatbot" && (
                              <>
                                <button
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const globalIdx = draftLayout.sectionOrder.indexOf(secId);
                                    const prevSecId = filteredList[idx - 1];
                                    const prevGlobalIdx = draftLayout.sectionOrder.indexOf(prevSecId);

                                    const nextOrder = [...draftLayout.sectionOrder];
                                    nextOrder[globalIdx] = prevSecId;
                                    nextOrder[prevGlobalIdx] = secId;
                                    updateDraft({ ...draftLayout, sectionOrder: nextOrder }, true);
                                  }}
                                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                                  title="Move Up"
                                >
                                  ▲
                                </button>
                                <button
                                  disabled={idx === filteredList.length - 2}
                                  onClick={() => {
                                    const globalIdx = draftLayout.sectionOrder.indexOf(secId);
                                    const nextSecId = filteredList[idx + 1];
                                    const nextGlobalIdx = draftLayout.sectionOrder.indexOf(nextSecId);

                                    const nextOrder = [...draftLayout.sectionOrder];
                                    nextOrder[globalIdx] = nextSecId;
                                    nextOrder[nextGlobalIdx] = secId;
                                    updateDraft({ ...draftLayout, sectionOrder: nextOrder }, true);
                                  }}
                                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                                  title="Move Down"
                                >
                                  ▼
                                </button>
                              </>
                            )}

                            {/* Delete Custom Section */}
                            {(secId.startsWith("section-") || secId.startsWith("subbanner-")) && (
                              <button
                                onClick={() => {
                                  if (confirm("Remove this custom section?")) {
                                    const nextOrder = draftLayout.sectionOrder.filter((id: string) => id !== secId);
                                    const nextDraft = { ...draftLayout, sectionOrder: nextOrder };
                                    delete nextDraft[secId];
                                    updateDraft(nextDraft, true);
                                    if (activeSectionId === secId) {
                                      setActiveSectionId(nextOrder[0] || "announcement");
                                    }
                                  }
                                }}
                                className="p-1 text-rose-400 hover:text-rose-500 cursor-pointer"
                                title="Delete Section"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </AdminCard>

              {/* Active Section Configurator */}
              {activeSectionId && draftLayout[activeSectionId] && (
                <AdminCard className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h4 className="font-serif text-md capitalize">{activeSectionId.replace(/([A-Z])/g, " $1")} Editor</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">Enabled:</span>
                      <input
                        type="checkbox"
                        checked={draftLayout[activeSectionId].enabled}
                        onChange={(e) => {
                          updateDraft({
                            ...draftLayout,
                            [activeSectionId]: { ...draftLayout[activeSectionId], enabled: e.target.checked }
                          });
                        }}
                        className="rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                      />
                    </div>
                  </div>

                  {/* Section Specific Input Forms */}
                  <div className="space-y-4 text-xs">
                    
                    {/* Announcement Editor */}
                    {activeSectionId === "announcement" && (
                      <>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Banner Message Text</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground"
                            value={draftLayout.announcement.text}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              announcement: { ...draftLayout.announcement, text: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Redirect Link URL</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground font-mono"
                            value={draftLayout.announcement.linkUrl}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              announcement: { ...draftLayout.announcement, linkUrl: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Open Link In</label>
                          <select
                            className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none text-foreground rounded cursor-pointer"
                            value={draftLayout.announcement.openIn || "sameTab"}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              announcement: { ...draftLayout.announcement, openIn: e.target.value }
                            })}
                          >
                            <option value="sameTab">Open in Current Tab</option>
                            <option value="newTab">Open in New Tab</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Background Theme Color</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                              value={draftLayout.announcement.backgroundColor}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                announcement: { ...draftLayout.announcement, backgroundColor: e.target.value }
                              })}
                            />
                            <input
                              type="text"
                              className="flex-1 bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground font-mono"
                              value={draftLayout.announcement.backgroundColor}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                announcement: { ...draftLayout.announcement, backgroundColor: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-2">
                          <span className="text-muted-foreground font-semibold">Enable Countdown Timer</span>
                          <input
                            type="checkbox"
                            checked={draftLayout.announcement.countdownActive}
                            onChange={(e) => {
                              const active = e.target.checked;
                              const endsAt = new Date(draftLayout.announcement.countdownEndsAt);
                              const isFuture = active && !isNaN(endsAt.getTime()) && endsAt.getTime() > Date.now();
                              updateDraft({
                                ...draftLayout,
                                announcement: {
                                  ...draftLayout.announcement,
                                  countdownActive: active,
                                  enabled: isFuture ? true : draftLayout.announcement.enabled
                                }
                              });
                            }}
                            className="rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                          />
                        </div>
                        {draftLayout.announcement.countdownActive && (
                          <div className="space-y-1 animate-in fade-in duration-200">
                            <label className="text-muted-foreground font-semibold">Countdown End Timestamp</label>
                            <input
                              type="datetime-local"
                              className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground font-mono rounded cursor-pointer"
                              value={draftLayout.announcement.countdownEndsAt ? draftLayout.announcement.countdownEndsAt.slice(0, 16) : ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                const isoVal = val ? val + ":00" : "";
                                const endsAt = new Date(isoVal);
                                const isFuture = !isNaN(endsAt.getTime()) && endsAt.getTime() > Date.now();
                                updateDraft({
                                  ...draftLayout,
                                  announcement: {
                                    ...draftLayout.announcement,
                                    countdownEndsAt: isoVal,
                                    enabled: isFuture ? true : draftLayout.announcement.enabled
                                  }
                                });
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Navigation Editor */}
                    {activeSectionId === "navigation" && (
                      <div className="space-y-3">
                        <label className="text-muted-foreground font-semibold">Configure Menu Links Visibility & Order</label>
                        <div className="space-y-1 bg-white/5 border border-white/10 rounded-xl p-3">
                          {draftLayout.navigation.itemsOrder.map((navItem: string, navIdx: number) => {
                            const isVisible = draftLayout.navigation.visibleItems.includes(navItem);
                            return (
                              <div key={navItem} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                                <span className="font-semibold">{navItem}</span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={(e) => {
                                      const nextVisible = e.target.checked
                                        ? [...draftLayout.navigation.visibleItems, navItem]
                                        : draftLayout.navigation.visibleItems.filter((x: string) => x !== navItem);
                                      updateDraft({
                                        ...draftLayout,
                                        navigation: { ...draftLayout.navigation, visibleItems: nextVisible }
                                      });
                                    }}
                                    className="rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                                  />
                                  <button
                                    disabled={navIdx === 0}
                                    onClick={() => {
                                      const order = [...draftLayout.navigation.itemsOrder];
                                      const t = order[navIdx];
                                      order[navIdx] = order[navIdx - 1];
                                      order[navIdx - 1] = t;
                                      updateDraft({
                                        ...draftLayout,
                                        navigation: { ...draftLayout.navigation, itemsOrder: order }
                                      });
                                    }}
                                    className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-20"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    disabled={navIdx === draftLayout.navigation.itemsOrder.length - 1}
                                    onClick={() => {
                                      const order = [...draftLayout.navigation.itemsOrder];
                                      const t = order[navIdx];
                                      order[navIdx] = order[navIdx + 1];
                                      order[navIdx + 1] = t;
                                      updateDraft({
                                        ...draftLayout,
                                        navigation: { ...draftLayout.navigation, itemsOrder: order }
                                      });
                                    }}
                                    className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-20"
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* AI Chatbot Editor */}
                    {activeSectionId === "chatbot" && (
                      <div className="space-y-3">
                        <label className="text-muted-foreground font-semibold block">AI Chatbot Visibility</label>
                        <p className="text-[11px] text-muted-foreground">The AI Chatbot appears as a floating chat bubble at the bottom of the e-commerce store, allowing users to ask questions, get product recommendations, and receive support.</p>
                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                          <span className="text-muted-foreground font-semibold">Enable AI Chatbot</span>
                          <input
                            type="checkbox"
                            checked={draftLayout.chatbot?.enabled !== false}
                            onChange={(e) => {
                              updateDraft({
                                ...draftLayout,
                                chatbot: { ...draftLayout.chatbot, enabled: e.target.checked }
                              });
                            }}
                            className="rounded border-white/10 text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}



                    {/* Hero Banner Carousel Editor */}
                    {activeSectionId === "hero" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-muted-foreground font-semibold">Carousel Slideshow Banners</label>
                          <button
                            onClick={() => {
                              const newId = `h-${Date.now()}`;
                              const newBanner = {
                                id: newId,
                                type: "Image Banner",
                                title: "Brand Statement Title",
                                subtitle: "Campaign details or seasonal promo",
                                buttonText: "Explore Collection",
                                redirectUrl: "/categories",
                                openIn: "sameTab",
                                clickTarget: "button",
                                desktopImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80",
                                mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
                                videoUrl: "",
                                scheduleStart: "",
                                scheduleEnd: ""
                              };
                              const updated = [...draftLayout.hero.banners, newBanner];
                              updateDraft({
                                ...draftLayout,
                                hero: { ...draftLayout.hero, banners: updated }
                              });
                              setExpandedSlideIndexMap(prev => ({ ...prev, hero: updated.length - 1 }));
                            }}
                            className="bg-accent/20 text-accent hover:bg-accent hover:text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider"
                          >
                            + Add Slide Frame
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 divide-y divide-white/5 scrollbar-thin">
                          {draftLayout.hero.banners.map((b: any, bIdx: number) => {
                            const isExpanded = (expandedSlideIndexMap["hero"] ?? 0) === bIdx;
                            return (
                              <div key={b.id} className="pt-3 first:pt-0 space-y-2">
                                <div 
                                  className="flex justify-between items-center bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                                  onClick={() => setExpandedSlideIndexMap(prev => ({ ...prev, hero: bIdx }))}
                                >
                                  <div className="flex items-center gap-3">
                                    {b.desktopImage && (
                                      <img 
                                        src={b.desktopImage} 
                                        className="w-10 h-7 object-cover rounded border border-white/10" 
                                        alt="" 
                                      />
                                    )}
                                    <span className="font-bold text-accent font-mono text-[10px]">
                                      Frame #{bIdx + 1} ({b.type}) {isExpanded ? "▼" : "▶"}
                                    </span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = draftLayout.hero.banners.filter((x: any) => x.id !== b.id);
                                      updateDraft({
                                        ...draftLayout,
                                        hero: { ...draftLayout.hero, banners: updated }
                                      });
                                      setExpandedSlideIndexMap(prev => ({ ...prev, hero: Math.max(0, bIdx - 1) }));
                                    }}
                                    className="text-rose-400 hover:text-rose-500 text-[10px] uppercase font-semibold"
                                  >
                                    Remove
                                  </button>
                                </div>

                                {isExpanded && (
                                  <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-black/20 rounded-lg">
                                    <select
                                      value={b.type}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, type: e.target.value } : x);
                                        updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                      className="col-span-2 bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                                    >
                                      <option value="Image Banner">Image Banner</option>
                                      <option value="Video Banner">Video Banner</option>
                                      <option value="Collection Banner">Collection Banner</option>
                                      <option value="Brand Campaign Banner">Brand Campaign Banner</option>
                                    </select>
                                    <input
                                      placeholder="Main Title (leave empty to hide)"
                                      className="bg-surface border border-border-subtle p-2 outline-none"
                                      value={b.title ?? ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, title: e.target.value } : x);
                                        updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Subtitle (leave empty to hide)"
                                      className="bg-surface border border-border-subtle p-2 outline-none"
                                      value={b.subtitle ?? ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, subtitle: e.target.value } : x);
                                        updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Button text (leave empty to hide)"
                                      className="bg-surface border border-border-subtle p-2 outline-none"
                                      value={b.buttonText ?? ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        const updated = draftLayout.hero.banners.map((x: any) => {
                                          if (x.id !== b.id) return x;
                                          const nextClickTarget = (!val.trim() && x.clickTarget === "button") ? "banner" : (x.clickTarget || "button");
                                          return { ...x, buttonText: val, clickTarget: nextClickTarget };
                                        });
                                        updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Redirect URL"
                                      className="bg-surface border border-border-subtle p-2 outline-none font-mono"
                                      value={b.redirectUrl ?? ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, redirectUrl: e.target.value } : x);
                                        updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />

                                    {/* Link Destination Options */}
                                    <div className="col-span-2 grid grid-cols-2 gap-2 p-2 bg-white/5 border border-white/10 rounded">
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-muted-foreground font-semibold">Open Link Target</label>
                                        <select
                                          value={b.openIn || "sameTab"}
                                          onChange={(e) => {
                                            const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, openIn: e.target.value } : x);
                                            updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                          }}
                                          className="w-full bg-surface border border-border-subtle p-1.5 outline-none text-foreground text-xs rounded"
                                        >
                                          <option value="sameTab">Open in Current Tab</option>
                                          <option value="newTab">Open in New Tab</option>
                                        </select>
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-muted-foreground font-semibold">Click Trigger Target</label>
                                        <select
                                          value={(!b.buttonText?.trim() && b.clickTarget === "button") ? "banner" : (b.clickTarget || "button")}
                                          onChange={(e) => {
                                            const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, clickTarget: e.target.value } : x);
                                            updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                          }}
                                          className="w-full bg-surface border border-border-subtle p-1.5 outline-none text-foreground text-xs rounded"
                                        >
                                          <option value="banner">Clicking Entire Banner</option>
                                          <option value="button" disabled={!b.buttonText?.trim()}>
                                            Clicking Button Only{!b.buttonText?.trim() ? " (Requires Button Text)" : ""}
                                          </option>
                                        </select>
                                      </div>
                                    </div>

                                    <input
                                      placeholder="Desktop Image URL"
                                      className="col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono"
                                      value={b.desktopImage ?? ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, desktopImage: e.target.value } : x);
                                        updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Mobile Image URL"
                                      className="col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono"
                                      value={b.mobileImage ?? ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, mobileImage: e.target.value } : x);
                                        updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Video URL Option"
                                      className="col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono"
                                      value={b.videoUrl || ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, videoUrl: e.target.value } : x);
                                        updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-muted-foreground font-semibold">Schedule Start (Date)</label>
                                      <input
                                        type="date"
                                        className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                        value={b.scheduleStart || ""}
                                        onChange={(e) => {
                                          const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, scheduleStart: e.target.value } : x);
                                          updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-muted-foreground font-semibold">Schedule End / Expiry Date</label>
                                      <input
                                        type="date"
                                        className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                        value={b.scheduleEnd || b.expiryDate || ""}
                                        onChange={(e) => {
                                          const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, scheduleEnd: e.target.value, expiryDate: e.target.value } : x);
                                          updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                        }}
                                      />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <label className="text-[10px] text-muted-foreground font-semibold">Expire Time (HH:mm - Optional)</label>
                                      <input
                                        type="time"
                                        className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                        value={b.expiryTime || ""}
                                        onChange={(e) => {
                                          const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, expiryTime: e.target.value } : x);
                                          updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                        }}
                                      />
                                    </div>

                                    {/* Visual preview and focal adjuster inside hero slide panel */}
                                    {b.desktopImage && (
                                      <div className="col-span-2 mt-2">
                                        <ImageFocalAdjuster
                                          imageUrl={b.desktopImage}
                                          focalX={b.focalX ?? 50}
                                          focalY={b.focalY ?? 50}
                                          scale={b.scale ?? 1.0}
                                          aspectRatioClass="aspect-[16/10] md:aspect-[21/9]"
                                          label={`Hero Frame #${bIdx + 1} Image Focal Point & Adjustment`}
                                          onChange={({ focalX, focalY, scale }) => {
                                            const updated = draftLayout.hero.banners.map((x: any) =>
                                              x.id === b.id ? { ...x, focalX, focalY, scale } : x
                                            );
                                            updateDraft({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                          }}
                                        />
                                      </div>
                                    )}

                                    <div className="col-span-2 flex gap-3 mt-1 p-2 bg-zinc-950/40 border border-white/5 rounded">
                                      {b.mobileImage && (
                                        <div className="flex-1 space-y-1">
                                          <span className="text-[9px] text-muted-foreground">Mobile View:</span>
                                          <img src={b.mobileImage} className="w-full h-16 object-cover rounded border border-white/10" alt="" />
                                        </div>
                                      )}
                                      {b.videoUrl && (
                                        <div className="flex-1 space-y-1">
                                          <span className="text-[9px] text-muted-foreground">Video Preview:</span>
                                          <div className="w-full h-16 bg-zinc-900 border border-white/10 rounded flex items-center justify-center text-[10px] text-accent font-semibold truncate px-1">
                                            {b.videoUrl.split("/").pop()}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Shop By Category Editor */}
                    {activeSectionId === "categories" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                          <div className="space-y-1">
                            <label className="text-muted-foreground font-semibold">Section Heading Title</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none text-foreground font-serif"
                              placeholder="Shop by Category"
                              value={draftLayout.categories.title ?? "Shop by Category"}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                categories: { ...draftLayout.categories, title: e.target.value }
                              })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground font-semibold">Section Eyebrow Subtitle</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none text-foreground uppercase tracking-widest text-[10px]"
                              placeholder="Curated Departments"
                              value={draftLayout.categories.subtitle ?? "Curated Departments"}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                categories: { ...draftLayout.categories, subtitle: e.target.value }
                              })}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <label className="text-muted-foreground font-semibold">
                            Category Cards ({draftLayout.categories?.items?.length || 0})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const newId = `cat-${Date.now()}`;
                              const newItem = {
                                id: newId,
                                name: "New Category",
                                image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&h=500&q=80",
                                redirectUrl: "/categories",
                                sortOrder: (draftLayout.categories?.items?.length || 0) + 1,
                                focalX: 50,
                                focalY: 50,
                                scale: 1.0,
                              };
                              const updated = [...(draftLayout.categories?.items || []), newItem];
                              updateDraft({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                            }}
                            className="bg-accent/20 text-accent hover:bg-accent hover:text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors"
                          >
                            + Add Category Card
                          </button>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 divide-y divide-white/5 scrollbar-thin">
                          {(draftLayout.categories?.items || []).map((cat: any, cIdx: number) => (
                            <div key={cat.id} className="pt-4 first:pt-0 space-y-3 bg-white/5 p-3 rounded-xl border border-white/10">
                              <div className="flex justify-between items-center">
                                <span className="font-bold font-mono text-xs text-accent">
                                  #{cIdx + 1} — {cat.name || "Untitled Category"}
                                </span>
                                {(draftLayout.categories?.items || []).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = draftLayout.categories.items.filter((x: any) => x.id !== cat.id);
                                      updateDraft({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                                    }}
                                    className="text-rose-400 hover:text-rose-500 text-[10px] uppercase font-semibold cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-muted-foreground font-semibold">Category Title</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Women, Men, Trending"
                                    className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none text-foreground"
                                    value={cat.name ?? ""}
                                    onChange={(e) => {
                                      const updated = draftLayout.categories.items.map((x: any) =>
                                        x.id === cat.id ? { ...x, name: e.target.value } : x
                                      );
                                      updateDraft({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-muted-foreground font-semibold">Redirect Link</label>
                                  <input
                                    type="text"
                                    placeholder="/categories"
                                    className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none font-mono text-foreground"
                                    value={cat.redirectUrl ?? ""}
                                    onChange={(e) => {
                                      const updated = draftLayout.categories.items.map((x: any) =>
                                        x.id === cat.id ? { ...x, redirectUrl: e.target.value } : x
                                      );
                                      updateDraft({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground font-semibold">Image URL</label>
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none font-mono text-foreground"
                                  value={cat.image ?? ""}
                                  onChange={(e) => {
                                    const updated = draftLayout.categories.items.map((x: any) =>
                                      x.id === cat.id ? { ...x, image: e.target.value } : x
                                    );
                                    updateDraft({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                                  }}
                                />
                              </div>

                              {/* Interactive Image Move & Adjustment Preview */}
                              <ImageFocalAdjuster
                                imageUrl={cat.image || ""}
                                focalX={cat.focalX ?? 50}
                                focalY={cat.focalY ?? 50}
                                scale={cat.scale ?? 1.0}
                                aspectRatioClass="aspect-[3/4]"
                                label={`"${cat.name || 'Category'}" Card Image Adjustment`}
                                onChange={({ focalX, focalY, scale }) => {
                                  const updated = draftLayout.categories.items.map((x: any) =>
                                    x.id === cat.id ? { ...x, focalX, focalY, scale } : x
                                  );
                                  updateDraft({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Flash Sale Editor */}
                    {activeSectionId === "flashSale" && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-muted-foreground font-semibold">Start Date</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono"
                              value={draftLayout.flashSale.startDate}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                flashSale: { ...draftLayout.flashSale, startDate: e.target.value }
                              })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground font-semibold">End Date</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono"
                              value={draftLayout.flashSale.endDate}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                flashSale: { ...draftLayout.flashSale, endDate: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Discount Percentage (%)</label>
                          <input
                            type="number"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono"
                            value={draftLayout.flashSale.discount}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              flashSale: { ...draftLayout.flashSale, discount: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Select Products for Rotation</label>
                          <div className="h-32 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1 scrollbar-thin">
                            {productsList.map((p: any) => {
                              const isSelected = draftLayout.flashSale.products.includes(p.id);
                              return (
                                <div key={p.id} className="flex items-center justify-between">
                                  <span>{p.name} ({p.price})</span>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const next = e.target.checked
                                        ? [...draftLayout.flashSale.products, p.id]
                                        : draftLayout.flashSale.products.filter((x: string) => x !== p.id);
                                      updateDraft({
                                        ...draftLayout,
                                        flashSale: { ...draftLayout.flashSale, products: next }
                                      });
                                    }}
                                    className="rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Trending Editor */}
                    {activeSectionId === "trending" && (
                      <>
                        <div className="flex justify-between items-center">
                          <label className="text-muted-foreground font-semibold">Automatic Scoring Algorithm Mode</label>
                          <input
                            type="checkbox"
                            checked={draftLayout.trending.autoMode}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              trending: { ...draftLayout.trending, autoMode: e.target.checked }
                            })}
                            className="rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                          Auto Mode calculates dynamic popularity metrics based on User Page Views + Cart Additions + Checkout Purchases.
                        </p>
                        {!draftLayout.trending.autoMode && (
                          <div className="space-y-1 animate-in fade-in duration-200">
                            <label className="text-muted-foreground font-semibold">Manual Overrides Products</label>
                            <div className="h-32 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1 scrollbar-thin">
                              {productsList.map((p: any) => {
                                const isSelected = draftLayout.trending.manualProducts.includes(p.id);
                                return (
                                  <div key={p.id} className="flex items-center justify-between">
                                    <span>{p.name}</span>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const next = e.target.checked
                                          ? [...draftLayout.trending.manualProducts, p.id]
                                          : draftLayout.trending.manualProducts.filter((x: string) => x !== p.id);
                                        updateDraft({
                                          ...draftLayout,
                                          trending: { ...draftLayout.trending, manualProducts: next }
                                        });
                                      }}
                                      className="rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* New Arrivals Editor */}
                    {activeSectionId === "newArrivals" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Display Product Count</label>
                          <input
                            type="number"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono"
                            value={draftLayout.newArrival?.productCount || 3}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              newArrival: { ...draftLayout.newArrival, productCount: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Layout Style Curation</label>
                          <select
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                            value={draftLayout.newArrival?.layoutStyle || "grid"}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              newArrival: { ...draftLayout.newArrival, layoutStyle: e.target.value }
                            })}
                          >
                            <option value="grid">Grid Grid Layout</option>
                            <option value="carousel">Horizontal Carousel Slideshow</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Editorial Fashion Campaign Editor */}
                    {activeSectionId === "campaign" && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Campaign Headline</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                            value={draftLayout.campaign.heading}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              campaign: { ...draftLayout.campaign, heading: e.target.value }
                            })}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-muted-foreground font-semibold">CTA Button Label</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                              value={draftLayout.campaign.ctaText || "Shop Campaign"}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                campaign: { ...draftLayout.campaign, ctaText: e.target.value }
                              })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground font-semibold">Redirect Link</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                              value={draftLayout.campaign.redirectUrl}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                campaign: { ...draftLayout.campaign, redirectUrl: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Campaign Large Image URL</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.campaign.image}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              campaign: { ...draftLayout.campaign, image: e.target.value }
                            })}
                          />
                        </div>
                        {/* Interactive Campaign Image Move & Adjustment Preview */}
                        <ImageFocalAdjuster
                          imageUrl={draftLayout.campaign.image || ""}
                          focalX={draftLayout.campaign.focalX ?? 50}
                          focalY={draftLayout.campaign.focalY ?? 50}
                          scale={draftLayout.campaign.scale ?? 1.0}
                          aspectRatioClass="aspect-[16/10] lg:aspect-[21/9]"
                          label="Campaign Banner Image Move & Position Adjustment"
                          onChange={({ focalX, focalY, scale }) => {
                            updateDraft({
                              ...draftLayout,
                              campaign: { ...draftLayout.campaign, focalX, focalY, scale }
                            });
                          }}
                        />
                      </div>
                    )}

                    {/* Featured Collection Editor */}
                    {activeSectionId === "collections" && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Collection Title / Header</label>
                          <input
                            type="text"
                            placeholder="e.g. Premium Collection, Modern Streetwear"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-serif text-sm font-semibold"
                            value={draftLayout.collections.title ?? draftLayout.collections.collectionId ?? "Premium Collection"}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              collections: {
                                ...draftLayout.collections,
                                title: e.target.value,
                                collectionId: e.target.value
                              }
                            })}
                          />
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] text-muted-foreground py-0.5">Quick Presets:</span>
                            {["Premium Collection", "Office Wear", "Party Wear", "Casual Wear", "Luxury Collection"].map((name) => (
                              <button
                                key={name}
                                type="button"
                                onClick={() => updateDraft({
                                  ...draftLayout,
                                  collections: {
                                    ...draftLayout.collections,
                                    title: name,
                                    collectionId: name
                                  }
                                })}
                                className="text-[9px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground border border-white/5 cursor-pointer"
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Featured Cover Image URL</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.collections.coverImage}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              collections: { ...draftLayout.collections, coverImage: e.target.value }
                            })}
                          />
                        </div>

                        {/* Interactive Collection Cover Move & Adjustment Preview */}
                        <ImageFocalAdjuster
                          imageUrl={draftLayout.collections.coverImage || ""}
                          focalX={draftLayout.collections.focalX ?? 50}
                          focalY={draftLayout.collections.focalY ?? 50}
                          scale={draftLayout.collections.scale ?? 1.0}
                          aspectRatioClass="aspect-[16/10] lg:aspect-[3/1]"
                          label="Featured Collection Cover Image Move & Position Adjustment"
                          onChange={({ focalX, focalY, scale }) => {
                            updateDraft({
                              ...draftLayout,
                              collections: { ...draftLayout.collections, focalX, focalY, scale }
                            });
                          }}
                        />
                      </div>
                    )}

                    {/* Live Purchase Feed Editor */}
                    {activeSectionId === "liveFeed" && (
                      <div className="space-y-3">
                        <label className="text-muted-foreground font-semibold">Purchase Alert Feeds Mode</label>
                        <select
                          className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                          value={draftLayout.liveFeed.mode}
                          onChange={(e) => updateDraft({
                            ...draftLayout,
                            liveFeed: { ...draftLayout.liveFeed, mode: e.target.value }
                          })}
                        >
                          <option value="real">Real Database Orders</option>
                          <option value="demo">Demo Simulation Feed</option>
                        </select>
                      </div>
                    )}

                    {/* Best Sellers Editor */}
                    {activeSectionId === "bestSellers" && (
                      <>
                        <div className="flex justify-between items-center">
                          <label className="text-muted-foreground font-semibold">Auto-cured by Sales Volume</label>
                          <input
                            type="checkbox"
                            checked={draftLayout.bestSellers.autoMode}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              bestSellers: { ...draftLayout.bestSellers, autoMode: e.target.checked }
                            })}
                            className="rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                          />
                        </div>
                        {!draftLayout.bestSellers.autoMode && (
                          <div className="space-y-1 animate-in fade-in duration-200">
                            <label className="text-muted-foreground font-semibold">Manual Product Curation</label>
                            <div className="h-32 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1 scrollbar-thin">
                              {productsList.map((p: any) => {
                                const isSelected = draftLayout.bestSellers.manualProducts.includes(p.id);
                                return (
                                  <div key={p.id} className="flex items-center justify-between">
                                    <span>{p.name}</span>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const next = e.target.checked
                                          ? [...draftLayout.bestSellers.manualProducts, p.id]
                                          : draftLayout.bestSellers.manualProducts.filter((x: string) => x !== p.id);
                                        updateDraft({
                                          ...draftLayout,
                                          bestSellers: { ...draftLayout.bestSellers, manualProducts: next }
                                        });
                                      }}
                                      className="rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Limited Stock Editor */}
                    {activeSectionId === "limitedStock" && (
                      <div className="space-y-2">
                        <label className="text-muted-foreground font-semibold">Stock Warning Threshold Curation</label>
                        <input
                          type="number"
                          className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono text-sm"
                          value={draftLayout.limitedStock.threshold}
                          onChange={(e) => updateDraft({
                            ...draftLayout,
                            limitedStock: { ...draftLayout.limitedStock, threshold: Number(e.target.value) }
                          })}
                        />
                        <span className="text-[10px] text-muted-foreground">Alert displays if size stocks fall below this value.</span>
                      </div>
                    )}

                    {/* Influencer Picks Editor */}
                    {activeSectionId === "influencerPicks" && (
                      <div className="space-y-1">
                        <label className="text-muted-foreground font-semibold">Select Styled Influencer Products</label>
                        <div className="h-40 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1 scrollbar-thin">
                          {productsList.map((p: any) => {
                            const isSelected = draftLayout.influencerPicks.products.includes(p.id);
                            return (
                              <div key={p.id} className="flex items-center justify-between">
                                <span>{p.name}</span>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const next = e.target.checked
                                      ? [...draftLayout.influencerPicks.products, p.id]
                                      : draftLayout.influencerPicks.products.filter((x: string) => x !== p.id);
                                    updateDraft({
                                      ...draftLayout,
                                      influencerPicks: { ...draftLayout.influencerPicks, products: next }
                                    });
                                  }}
                                  className="rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Reviews Editor */}
                    {activeSectionId === "reviews" && (
                      <div className="space-y-2">
                        <label className="text-muted-foreground font-semibold">Feature Customer Reviews</label>
                        <div className="h-40 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-2 scrollbar-thin">
                          {Object.entries(state.productReviews).flatMap(([pId, list]) =>
                            list.map(r => ({ ...r, productId: pId }))
                          ).map((r: any) => {
                            const isSelected = draftLayout.reviews.featuredReviewIds.includes(r.id);
                            return (
                              <div key={r.id} className="flex items-start gap-2 border-b border-white/5 pb-2 last:border-0 justify-between">
                                <div className="text-[10px]">
                                  <div className="font-bold">{r.userName}</div>
                                  <div className="italic text-muted-foreground truncate w-44">"{r.comment}"</div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const next = e.target.checked
                                      ? [...draftLayout.reviews.featuredReviewIds, r.id]
                                      : draftLayout.reviews.featuredReviewIds.filter((x: string) => x !== r.id);
                                    updateDraft({
                                      ...draftLayout,
                                      reviews: { ...draftLayout.reviews, featuredReviewIds: next }
                                    });
                                  }}
                                  className="rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5 mt-0.5"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Lookbook Editor */}
                    {activeSectionId === "lookbook" && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Lookbook Banner Image URL</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.lookbook.image}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              lookbook: { ...draftLayout.lookbook, image: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-muted-foreground font-semibold">Interactive Image Coordinate Curation Tagging</label>
                          <p className="text-[10px] text-muted-foreground">Click coordinates on the image container to overlay shoppable points.</p>
                          
                          <div className="relative aspect-[3/4] max-w-[200px] bg-zinc-950 border border-white/10 rounded-xl overflow-hidden mx-auto">
                            <img
                              src={draftLayout.lookbook.image}
                              alt="Lookbook Tag Preview"
                              className="w-full h-full object-cover cursor-crosshair select-none"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                const pId = prompt("Enter product ID to tag (e.g. pr1, pr2, prm1):", "pr1");
                                if (pId && productsList.some(p => p.id === pId)) {
                                  updateDraft({
                                    ...draftLayout,
                                    lookbook: {
                                      ...draftLayout.lookbook,
                                      taggedProducts: [...draftLayout.lookbook.taggedProducts, { productId: pId, x, y }]
                                    }
                                  });
                                } else if (pId) {
                                  alert("Product ID not found in the catalog!");
                                }
                              }}
                            />
                            {draftLayout.lookbook.taggedProducts.map((tag: any, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="absolute w-4 h-4 bg-accent border border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-ping-slow shadow-lg cursor-pointer"
                                style={{ left: `${tag.x}%`, top: `${tag.y}%`, transform: "translate(-50%, -50%)" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm("Delete this tagged product point?")) {
                                    const nextTags = draftLayout.lookbook.taggedProducts.filter((_: any, idx: number) => idx !== tIdx);
                                    updateDraft({
                                      ...draftLayout,
                                      lookbook: { ...draftLayout.lookbook, taggedProducts: nextTags }
                                    });
                                  }
                                }}
                              >
                                {tIdx + 1}
                              </span>
                            ))}
                          </div>

                          <div className="text-[10px] text-muted-foreground space-y-1">
                            <span className="font-semibold text-accent block">Tagged Items:</span>
                            {draftLayout.lookbook.taggedProducts.map((tag: any, tIdx: number) => {
                              const match = productsList.find(p => p.id === tag.productId);
                              return (
                                <div key={tIdx} className="flex justify-between items-center py-0.5 border-b border-white/5 last:border-0 font-mono text-[9px]">
                                  <span>#{tIdx+1}: {match?.name || tag.productId} ({tag.x}%, {tag.y}%)</span>
                                  <button
                                    onClick={() => {
                                      const nextTags = draftLayout.lookbook.taggedProducts.filter((_: any, idx: number) => idx !== tIdx);
                                      updateDraft({
                                        ...draftLayout,
                                        lookbook: { ...draftLayout.lookbook, taggedProducts: nextTags }
                                      });
                                    }}
                                    className="text-rose-400"
                                  >
                                    Remove
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommended Editor */}
                    {activeSectionId === "recommended" && (
                      <div className="space-y-3">
                        <label className="text-muted-foreground font-semibold">Recommendation Curation Engine</label>
                        <select
                          className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                          value={draftLayout.recommended.algorithm}
                          onChange={(e) => updateDraft({
                            ...draftLayout,
                            recommended: { ...draftLayout.recommended, algorithm: e.target.value }
                          })}
                        >
                          <option value="category">Category Viewed History</option>
                          <option value="ai">AI Deep Learning Curation</option>
                        </select>
                      </div>
                    )}

                    {/* Brand Story Editor */}
                    {activeSectionId === "brandStory" && (
                      <>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Story Paragraph Content</label>
                          <textarea
                            rows={4}
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                            value={draftLayout.brandStory.text}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              brandStory: { ...draftLayout.brandStory, text: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Redirect Link Box Text (CTA Button Label)</label>
                          <input
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                            placeholder="Discover Our Story"
                            value={draftLayout.brandStory.buttonText ?? draftLayout.brandStory.linkText ?? "Discover Our Story"}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              brandStory: { ...draftLayout.brandStory, buttonText: e.target.value, linkText: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Redirect Link URL Target</label>
                          <input
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            placeholder="/categories"
                            value={draftLayout.brandStory.redirectUrl ?? draftLayout.brandStory.linkUrl ?? "/categories"}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              brandStory: { ...draftLayout.brandStory, redirectUrl: e.target.value, linkUrl: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Collage Image #1 URL</label>
                          <input
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.brandStory.image1}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              brandStory: { ...draftLayout.brandStory, image1: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Collage Image #2 URL</label>
                          <input
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.brandStory.image2}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              brandStory: { ...draftLayout.brandStory, image2: e.target.value }
                            })}
                          />
                        </div>
                      </>
                    )}

                    {/* Newsletter Editor */}
                    {activeSectionId === "newsletter" && (
                      <div className="space-y-1">
                        <label className="text-muted-foreground font-semibold">Sign-up Reward Amount (INR)</label>
                        <input
                          type="number"
                          className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono text-sm"
                          value={draftLayout.newsletter.rewardAmount}
                          onChange={(e) => updateDraft({
                            ...draftLayout,
                            newsletter: { ...draftLayout.newsletter, rewardAmount: Number(e.target.value) }
                          })}
                        />
                      </div>
                    )}

                    {/* Footer Editor */}
                    {activeSectionId === "footer" && (
                      <>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">About Description Text</label>
                          <textarea
                            rows={3}
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                            value={draftLayout.footer.aboutText}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              footer: { ...draftLayout.footer, aboutText: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Concierge Contact Phone</label>
                          <input
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                            value={draftLayout.footer.phone}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              footer: { ...draftLayout.footer, phone: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Business Email</label>
                          <input
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.footer.email}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              footer: { ...draftLayout.footer, email: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Headquarters Address</label>
                          <input
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                            value={draftLayout.footer.address}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              footer: { ...draftLayout.footer, address: e.target.value }
                            })}
                          />
                        </div>
                      </>
                    )}

                    {/* Custom Banner & Sub Banner Editor */}
                    {(activeSectionId.startsWith("banner-") || activeSectionId.startsWith("subbanner-")) && draftLayout[activeSectionId] && (() => {
                      const secData = draftLayout[activeSectionId];
                      const slides = secData.banners || [];

                      return (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-muted-foreground font-semibold">Section Title / Header</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                              value={secData.title || secData.name || ""}
                              onChange={(e) => updateDraft({
                                ...draftLayout,
                                [activeSectionId]: {
                                  ...secData,
                                  title: e.target.value,
                                  name: e.target.value
                                }
                              })}
                            />
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <label className="text-muted-foreground font-semibold">Banner Photo Slides ({slides.length})</label>
                            <button
                              type="button"
                              onClick={() => {
                                const newBanner = {
                                  id: `slide-${Date.now()}`,
                                  title: secData.title || "Showcase Banner",
                                  subtitle: "",
                                  buttonText: "Explore Collection",
                                  redirectUrl: "/shop",
                                  desktopImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80",
                                  mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
                                  scale: 1.0,
                                  xOffset: 0,
                                  yOffset: 0
                                };
                                const updated = [...slides, newBanner];
                                updateDraft({
                                  ...draftLayout,
                                  [activeSectionId]: {
                                    ...secData,
                                    banners: updated
                                  }
                                });
                                setExpandedSlideIndexMap(prev => ({ ...prev, [activeSectionId]: updated.length - 1 }));
                              }}
                              className="bg-accent/20 text-accent hover:bg-accent hover:text-white px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                            >
                              + Add Photo Slide
                            </button>
                          </div>

                          {/* Fallback conversion */}
                          {slides.length === 0 && (secData.desktopImage || secData.mobileImage) && (
                            <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl space-y-2 text-xs">
                              <p className="text-muted-foreground font-semibold">Existing single-image banner found. Convert to slideshow?</p>
                              <button
                                type="button"
                                onClick={() => {
                                  updateDraft({
                                    ...draftLayout,
                                    [activeSectionId]: {
                                      ...secData,
                                      banners: [
                                        {
                                          id: "slide-root",
                                          title: secData.title || secData.name || "Showcase Banner",
                                          subtitle: secData.subtitle || "",
                                          buttonText: secData.buttonText || "Explore",
                                          redirectUrl: secData.redirectUrl || "/shop",
                                          desktopImage: secData.desktopImage,
                                          mobileImage: secData.mobileImage || secData.desktopImage,
                                          scale: secData.scale || 1.0,
                                          xOffset: secData.xOffset || 0,
                                          yOffset: secData.yOffset || 0
                                        }
                                      ]
                                    }
                                  });
                                }}
                                className="bg-accent text-white px-3 py-1 rounded hover:bg-accent/90 text-[10px] font-bold"
                              >
                                Convert to Slideshow
                              </button>
                            </div>
                          )}

                          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 divide-y divide-white/5 scrollbar-thin">
                            {slides.map((b: any, bIdx: number) => {
                              const isExpanded = (expandedSlideIndexMap[activeSectionId] ?? 0) === bIdx;
                              return (
                                <div key={b.id} className="pt-4 first:pt-0 space-y-3">
                                  <div 
                                    className="flex justify-between items-center bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                                    onClick={() => setExpandedSlideIndexMap(prev => ({ ...prev, [activeSectionId]: bIdx }))}
                                  >
                                    <div className="flex items-center gap-3">
                                      {b.desktopImage && (
                                        <img 
                                          src={b.desktopImage} 
                                          className="w-10 h-7 object-cover rounded border border-white/10" 
                                          alt="" 
                                        />
                                      )}
                                      <span className="font-bold text-accent font-mono text-[10px]">
                                        Slide Photo #{bIdx + 1} {isExpanded ? "▼" : "▶"}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updated = slides.filter((x: any) => x.id !== b.id);
                                        updateDraft({
                                          ...draftLayout,
                                          [activeSectionId]: {
                                            ...secData,
                                            banners: updated
                                          }
                                        });
                                        setExpandedSlideIndexMap(prev => ({ ...prev, [activeSectionId]: Math.max(0, bIdx - 1) }));
                                      }}
                                      className="text-rose-400 hover:text-rose-500 text-[10px] uppercase font-semibold cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>

                                  {isExpanded && (
                                    <div className="grid grid-cols-2 gap-2 text-xs p-2 bg-black/20 rounded-lg">
                                      <div className="col-span-2 space-y-1">
                                        <label className="text-muted-foreground font-semibold">Desktop Image URL</label>
                                        <input
                                          type="text"
                                          placeholder="Desktop Image URL"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono"
                                          value={b.desktopImage || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, desktopImage: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="col-span-2 space-y-1">
                                        <label className="text-muted-foreground font-semibold">Mobile Image URL (Optional)</label>
                                        <input
                                          type="text"
                                          placeholder="Mobile Image URL"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono"
                                          value={b.mobileImage || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, mobileImage: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="col-span-2 space-y-1">
                                        <label className="text-muted-foreground font-semibold">Video URL Option (Optional .mp4 or .webm)</label>
                                        <input
                                          type="text"
                                          placeholder="https://.../video.mp4"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono"
                                          value={b.videoUrl || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, videoUrl: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="col-span-2 space-y-1">
                                        <label className="text-muted-foreground font-semibold">Redirect Link URL</label>
                                        <input
                                          type="text"
                                          placeholder="Redirect Link URL"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none font-mono"
                                          value={b.redirectUrl || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, redirectUrl: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-muted-foreground font-semibold">Schedule Start (Date)</label>
                                        <input
                                          type="date"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                          value={b.scheduleStart || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, scheduleStart: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-muted-foreground font-semibold">Expiry Date (YYYY-MM-DD)</label>
                                        <input
                                          type="date"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                          value={b.expiryDate || b.scheduleEnd || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, expiryDate: e.target.value, scheduleEnd: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="col-span-2 space-y-1">
                                        <label className="text-muted-foreground font-semibold">Expire Time (HH:mm - Optional)</label>
                                        <input
                                          type="time"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                          value={b.expiryTime || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, expiryTime: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-muted-foreground font-semibold">Title</label>
                                        <input
                                          type="text"
                                          placeholder="Slide Title"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                          value={b.title || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, title: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-muted-foreground font-semibold">Subtitle</label>
                                        <input
                                          type="text"
                                          placeholder="Slide Subtitle"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                          value={b.subtitle || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, subtitle: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>
                                      <div className="col-span-2 space-y-1">
                                        <label className="text-muted-foreground font-semibold">Button Text</label>
                                        <input
                                          type="text"
                                          placeholder="Explore Collection"
                                          className="w-full bg-surface border border-border-subtle p-2 outline-none"
                                          value={b.buttonText || ""}
                                          onChange={(e) => {
                                            const updated = slides.map((x: any) => x.id === b.id ? { ...x, buttonText: e.target.value } : x);
                                            updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>

                                      {/* Visual preview and focal adjuster inside slide panel */}
                                      {b.desktopImage && (
                                        <div className="col-span-2 mt-2">
                                          <ImageFocalAdjuster
                                            imageUrl={b.desktopImage}
                                            focalX={b.focalX ?? 50}
                                            focalY={b.focalY ?? 50}
                                            scale={b.scale ?? 1.0}
                                            aspectRatioClass="aspect-[16/10] md:aspect-[21/9]"
                                            label={`Frame #${bIdx + 1} Image Focal Point & Adjustment`}
                                            onChange={({ focalX, focalY, scale }) => {
                                              const updated = slides.map((x: any) =>
                                                x.id === b.id ? { ...x, focalX, focalY, scale } : x
                                              );
                                              updateDraft({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                            }}
                                          />
                                        </div>
                                      )}

                                      <div className="col-span-2 flex gap-3 mt-1 p-2 bg-zinc-950/40 border border-white/5 rounded">
                                        {b.mobileImage && (
                                          <div className="flex-1 space-y-1">
                                            <span className="text-[9px] text-muted-foreground">Mobile View:</span>
                                            <img src={b.mobileImage} className="w-full h-16 object-cover rounded border border-white/10" alt="" />
                                          </div>
                                        )}
                                        {b.videoUrl && (
                                          <div className="flex-1 space-y-1">
                                            <span className="text-[9px] text-muted-foreground">Video Preview:</span>
                                            <div className="w-full h-16 bg-zinc-900 border border-white/10 rounded flex items-center justify-center text-[10px] text-accent font-semibold truncate px-1">
                                              {b.videoUrl.split("/").pop()}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Custom Bucket Editor */}
                    {activeSectionId.startsWith("bucket-") && draftLayout[activeSectionId] && (() => {
                      const bkt = state.buckets?.find(b => b.id === draftLayout[activeSectionId].id);
                      return (
                        <div className="space-y-3">
                          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                            <div className="text-xs font-bold text-emerald-400">Curated Curation Set</div>
                            {bkt ? (
                              <>
                                <div className="text-sm font-semibold text-white">{bkt.name}</div>
                                <div className="text-xs text-muted-foreground">ID: {bkt.id}</div>
                                <div className="text-xs text-muted-foreground">Product Count: {bkt.productIds?.length || 0}</div>
                                <div className="text-xs text-muted-foreground">
                                  Designated Star Product: {productsList.find(p => p.id === bkt.starProductId)?.name || "None"}
                                </div>
                                <div className="pt-2 border-t border-white/5">
                                  <div className="text-[10px] uppercase font-bold text-accent mb-1">Products Included:</div>
                                  <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                                    {bkt.productIds?.map(pid => {
                                      const p = productsList.find(pr => pr.id === pid);
                                      return (
                                        <div key={pid} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                          <span className="truncate">{p?.name || pid}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-rose-400 italic">This bucket was deleted or is missing. Please select another bucket or remove this section.</div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Recently Viewed Editor */}
                    {activeSectionId === "recentlyViewed" && (
                      <div className="space-y-2">
                        <label className="text-muted-foreground font-semibold">Recently Viewed Section</label>
                        <p className="text-xs text-muted-foreground leading-relaxed">This section automatically loads the products recently viewed by customers on this device. Toggle the checkbox at the top to activate/deactivate the section layout.</p>
                      </div>
                    )}

                    {/* Custom Section Editor (buckets and product items) */}
                    {activeSectionId.startsWith("section-") && draftLayout[activeSectionId] && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Section Display Title</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                            value={draftLayout[activeSectionId].name || ""}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              [activeSectionId]: { ...draftLayout[activeSectionId], name: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Section Subname / Subtitle</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                            value={draftLayout[activeSectionId].subname || ""}
                            onChange={(e) => updateDraft({
                              ...draftLayout,
                              [activeSectionId]: { ...draftLayout[activeSectionId], subname: e.target.value }
                            })}
                          />
                        </div>

                        {/* Buckets Selection */}
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Add Curated Buckets to Section</label>
                          <div className="h-32 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1.5 scrollbar-thin">
                            {(state.buckets || []).length === 0 ? (
                              <div className="text-[10px] text-muted-foreground italic">No buckets available. Create one in the Buckets tab first.</div>
                            ) : (
                              (state.buckets || []).map((bkt: any) => {
                                const isSelected = (draftLayout[activeSectionId].bucketIds || []).includes(bkt.id);
                                return (
                                  <div key={bkt.id} className="flex items-center justify-between text-xs">
                                    <span className="text-emerald-400 font-semibold">{bkt.name}</span>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const currentBuckets = draftLayout[activeSectionId].bucketIds || [];
                                        const next = e.target.checked
                                          ? [...currentBuckets, bkt.id]
                                          : currentBuckets.filter((id: string) => id !== bkt.id);
                                        updateDraft({
                                          ...draftLayout,
                                          [activeSectionId]: { ...draftLayout[activeSectionId], bucketIds: next }
                                        });
                                      }}
                                      className="rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5 cursor-pointer"
                                    />
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Products Selection */}
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Add Individual Products to Section</label>
                          <div className="h-44 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1.5 scrollbar-thin font-sans">
                            {productsList.map((p: any) => {
                              const isSelected = (draftLayout[activeSectionId].productIds || []).includes(p.id);
                              return (
                                <div key={p.id} className="flex items-center justify-between text-xs font-mono">
                                  <span className="truncate max-w-[200px] text-foreground font-sans">{p.name} ({p.price})</span>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const currentProducts = draftLayout[activeSectionId].productIds || [];
                                      const next = e.target.checked
                                        ? [...currentProducts, p.id]
                                        : currentProducts.filter((id: string) => id !== p.id);
                                      updateDraft({
                                        ...draftLayout,
                                        [activeSectionId]: { ...draftLayout[activeSectionId], productIds: next }
                                      });
                                    }}
                                    className="rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5 cursor-pointer"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Default editor placeholder */}
                    {!["announcement", "navigation", "hero", "categories", "flashSale", "trending", "newArrivals", "campaign", "collections", "liveFeed", "bestSellers", "limitedStock", "influencerPicks", "reviews", "lookbook", "recommended", "brandStory", "newsletter", "footer"].includes(activeSectionId) && !activeSectionId.startsWith("banner-") && !activeSectionId.startsWith("subbanner-") && !activeSectionId.startsWith("bucket-") && !activeSectionId.startsWith("section-") && (
                      <div className="text-center py-6 text-muted-foreground italic">No specialized controls required. Use the switch above to toggle section visibility.</div>
                    )}

                  </div>
                </AdminCard>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 3. PRODUCTS CATALOG */}
      {tab === "products" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search catalog by name, brand, SKU…"
                  className="w-full bg-surface border border-border-subtle pl-10 pr-4 py-2.5 text-xs outline-none focus:border-accent"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className={`border p-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs h-[38px] ${
                    sortField 
                      ? "border-accent text-accent bg-accent/5 font-bold" 
                      : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
                  }`}
                  title="Sort catalog products"
                >
                  <ListFilter className="w-4 h-4" />
                  {sortField && (
                    <span className="capitalize text-[10px]">
                      {sortField} ({sortDirection === "desc" ? "↓" : "↑"})
                    </span>
                  )}
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-zinc-950 border border-white/15 rounded-xl shadow-2xl z-40 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold p-2 border-b border-white/5">
                      Sort products by
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (sortField === "date") {
                          setSortDirection(sortDirection === "desc" ? "asc" : "desc");
                        } else {
                          setSortField("date");
                          setSortDirection("desc");
                        }
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex justify-between items-center transition-colors cursor-pointer hover:bg-white/5 ${
                        sortField === "date" ? "text-accent font-bold bg-accent/5" : "text-foreground"
                      }`}
                    >
                      <span>Date Created</span>
                      {sortField === "date" && (
                        <span className="text-[10px] font-mono">
                          {sortDirection === "desc" ? "Newest First" : "Oldest First"}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (sortField === "price") {
                          setSortDirection(sortDirection === "desc" ? "asc" : "desc");
                        } else {
                          setSortField("price");
                          setSortDirection("desc");
                        }
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex justify-between items-center transition-colors cursor-pointer hover:bg-white/5 ${
                        sortField === "price" ? "text-accent font-bold bg-accent/5" : "text-foreground"
                      }`}
                    >
                      <span>Price</span>
                      {sortField === "price" && (
                        <span className="text-[10px] font-mono">
                          {sortDirection === "desc" ? "Highest First" : "Lowest First"}
                        </span>
                      )}
                    </button>
                    {sortField && (
                      <button
                        type="button"
                        onClick={() => {
                          setSortField(null);
                          setShowSortDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-rose-400 hover:text-rose-500 transition-colors mt-1.5 pt-2 border-t border-white/5 cursor-pointer"
                      >
                        Reset Sort
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="editorial-label border border-white/10 hover:border-accent text-foreground hover:text-accent bg-transparent px-4 py-2.5 flex items-center gap-2 rounded-sm cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" /> Download Template
              </button>
              <label className="editorial-label border border-white/10 hover:border-accent text-foreground hover:text-accent bg-transparent px-4 py-2.5 flex items-center gap-2 rounded-sm cursor-pointer transition-colors">
                <Upload className="w-4 h-4" /> Import Excel
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsManualCreate(true);
                  const newProductDraft = {
                    name: "",
                    house: "",
                    price: "",
                    image: "",
                    images: [],
                    tag: "New",
                    tags: ["Manual"],
                    gender: "Women",
                    category: "Tops",
                    sizes: ["S", "M", "L"],
                    stockPerSize: { S: 10, M: 10, L: 10 },
                    sku: `SKU-${Math.floor(10000 + Math.random()*90000)}`,
                    originalPrice: "",
                    description: "",
                    material: "",
                    color: "",
                    productInfo: "",
                    type: "",
                    fabric: "",
                    visibility: "VISIBLE",
                    isFeatured: false,
                    isNewArrival: true,
                    isTrending: false,
                    isRecommended: false
                  };
                  setImportedProducts([newProductDraft]);
                  setCurrentImportIndex(0);
                  setIsReviewingImports(true);
                }}
                className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Product
              </button>
            </div>
          </div>

          {isReviewingImports && importedProducts.length > 0 && (() => {
            const currentItem = importedProducts[currentImportIndex];
            if (!currentItem) return null;

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
                <div className="liquid-glass bg-background/95 border border-accent/20 max-w-5xl w-full p-6 md:p-8 max-h-[95vh] overflow-y-auto shadow-2xl relative text-foreground flex flex-col md:flex-row gap-6">
                  
                  {/* Left Column: List of all products to click/jump and overall stats */}
                  <div className="w-full md:w-64 shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 pb-4 md:pb-0 md:pr-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-lg text-amber-500 font-bold">
                        {editingProduct ? "Edit Product" : (isManualCreate ? "New Product" : "Import Review")}
                      </h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                        {editingProduct ? "Modify existing product details" : (isManualCreate ? "Create and manage new draft items" : `Total parsed: ${importedProducts.length} products`)}
                      </p>
                    </div>

                    {!editingProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          const newProductDraft = {
                            name: "",
                            house: "",
                            price: "",
                            image: "",
                            images: [],
                            tag: "New",
                            tags: ["Manual"],
                            gender: "Women",
                            category: "Tops",
                            sizes: ["S", "M", "L"],
                            stockPerSize: { S: 10, M: 10, L: 10 },
                            sku: `SKU-${Math.floor(10000 + Math.random()*90000)}`,
                            originalPrice: "",
                            description: "",
                            material: "",
                            color: "",
                            productInfo: "",
                            type: "",
                            fabric: "",
                            visibility: "VISIBLE",
                            isFeatured: false,
                            isNewArrival: true,
                            isTrending: false,
                            isRecommended: false
                          };
                          setImportedProducts([...importedProducts, newProductDraft]);
                          setCurrentImportIndex(importedProducts.length);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-accent/40 text-accent hover:border-accent hover:bg-accent/5 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add new product
                      </button>
                    )}

                    <div className="flex-1 overflow-y-auto max-h-48 md:max-h-[60vh] pr-2 space-y-2 scrollbar-thin">
                      {importedProducts.map((p, idx) => (
                        <div key={idx} className="relative group/card w-full">
                          <button
                            type="button"
                            onClick={() => setCurrentImportIndex(idx)}
                            className={`w-full text-left p-2.5 pr-8 rounded-xl border text-xs transition-all flex-1 flex items-center gap-2 ${
                              idx === currentImportIndex
                                ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.1)]"
                                : "bg-black/5 dark:bg-white/5 border-transparent text-muted-foreground hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
                            }`}
                          >
                            <div className="w-6 h-6 rounded bg-zinc-950 shrink-0 overflow-hidden border border-black/10 dark:border-white/5">
                              {p.image ? (
                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">IMG</div>
                              )}
                            </div>
                            <div className="truncate flex-1 font-serif">
                              <div className="font-semibold truncate text-[11px]">{p.name || `Product ${idx + 1}`}</div>
                              <div className="text-[9px] text-muted-foreground truncate">{p.house || "No brand"}</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductToDeleteIndex(idx);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/45 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            title="Delete this draft product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Active product editor and arrows */}
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center border-b border-black/10 dark:border-white/5 pb-3">
                      <div>
                        <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {editingProduct ? "Editing Product" : (isManualCreate ? "Creating Card" : "Reviewing Card")}
                        </span>
                        <h4 className="font-serif text-xl font-bold mt-1 text-foreground">
                          Product {currentImportIndex + 1} of {importedProducts.length}
                        </h4>
                      </div>

                      {/* Navigation Arrows */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={currentImportIndex === 0}
                          onClick={handlePrevImport}
                          className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-black/5 p-2 rounded-full border border-black/10 dark:border-white/10 transition-all text-foreground cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={currentImportIndex === importedProducts.length - 1}
                          onClick={handleNextImport}
                          className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-black/5 p-2 rounded-full border border-black/10 dark:border-white/10 transition-all text-foreground cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      {/* Name, Brand, Desc, classification */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Product Name</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                            value={currentItem.name}
                            onChange={e => updateImportedProductField("name", e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Brand / House</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                            value={currentItem.house}
                            onChange={e => updateImportedProductField("house", e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Product Description</label>
                            <span className="text-[9px] text-[#D4AF37] font-medium">Shows directly below title on product detail page</span>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Enter product description (leave empty if not needed)..."
                            className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent resize-y leading-normal"
                            value={currentItem.description || ""}
                            onChange={e => updateImportedProductField("description", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Category</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                              value={currentItem.category}
                              onChange={e => updateImportedProductField("category", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Gender</label>
                            <select
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none cursor-pointer focus:border-accent"
                              value={currentItem.gender}
                              onChange={e => updateImportedProductField("gender", e.target.value)}
                            >
                              <option value="Women">Women</option>
                              <option value="Men">Men</option>
                              <option value="Unisex">Unisex</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Colour</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                              value={currentItem.color || ""}
                              onChange={e => updateImportedProductField("color", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Fabric / Material</label>
                            <input
                              type="text"
                              placeholder="e.g. 100% Organic Cotton, Linen, Silk"
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                              value={currentItem.material || currentItem.fabric || currentItem.fabricMaterial || ""}
                              onChange={e => {
                                const val = e.target.value;
                                updateImportedProductField("material", val);
                                updateImportedProductField("fabric", val);
                                updateImportedProductField("fabricMaterial", val);
                                if (currentItem.productInfo && typeof currentItem.productInfo === "string") {
                                  let updatedInfo = currentItem.productInfo;
                                  if (/\*Material Composition\s*:[^*]+\*/i.test(updatedInfo)) {
                                    updatedInfo = updatedInfo.replace(/\*Material Composition\s*:[^*]+\*/gi, `*Material Composition : ${val || "Cotton"}*`);
                                  }
                                  if (/\*Fabric Type\s*:[^*]+\*/i.test(updatedInfo)) {
                                    updatedInfo = updatedInfo.replace(/\*Fabric Type\s*:[^*]+\*/gi, `*Fabric Type : ${val || "Apparel"}*`);
                                  }
                                  updateImportedProductField("productInfo", updatedInfo);
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Ratings & Customer Reviews Controls */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/10 dark:border-white/10">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Product Rating</label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const isNone = currentItem.customRating === null || currentItem.customRating === undefined || String(currentItem.customRating).toLowerCase() === "none";
                                    updateImportedProductField("customRating", isNone ? 4.8 : null);
                                  }}
                                  className={cn(
                                    "text-[9px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer",
                                    currentItem.customRating === null || currentItem.customRating === undefined || String(currentItem.customRating).toLowerCase() === "none"
                                      ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                                      : "bg-surface border-white/10 text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  {currentItem.customRating === null || currentItem.customRating === undefined || String(currentItem.customRating).toLowerCase() === "none" ? "None (Organic)" : "Set None"}
                                </button>
                                <span className="text-xs font-mono font-bold text-amber-400">
                                  {currentItem.customRating !== undefined && currentItem.customRating !== null && String(currentItem.customRating).toLowerCase() !== "none"
                                    ? Number(currentItem.customRating).toFixed(1)
                                    : "None"}
                                </span>
                              </div>
                            </div>
                            {currentItem.customRating !== null && currentItem.customRating !== undefined && String(currentItem.customRating).toLowerCase() !== "none" ? (
                              <>
                                <input
                                  type="range"
                                  min="0.5"
                                  max="5"
                                  step="0.1"
                                  className="w-full accent-amber-400 cursor-pointer h-2 bg-surface rounded-lg"
                                  value={Number(currentItem.customRating) || 4.8}
                                  onChange={e => updateImportedProductField("customRating", parseFloat(e.target.value))}
                                />
                                <div className="flex items-center gap-1 text-amber-400 pt-0.5">
                                  {[...Array(5)].map((_, i) => {
                                    const score = Number(currentItem.customRating) || 4.8;
                                    const fill = i + 1 <= score ? 1 : (i < score ? 0.5 : 0);
                                    return (
                                      <Star
                                        key={i}
                                        className={cn("w-3.5 h-3.5 text-amber-400", fill > 0 ? "fill-amber-400" : "fill-transparent")}
                                      />
                                    );
                                  })}
                                </div>
                              </>
                            ) : (
                              <p className="text-[10px] text-muted-foreground italic pt-1">
                                Real customer ratings only (no boost applied).
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Reviews Count</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const isNone = currentItem.customReviewCount === null || currentItem.customReviewCount === undefined || String(currentItem.customReviewCount).toLowerCase() === "none";
                                  updateImportedProductField("customReviewCount", isNone ? 14 : null);
                                }}
                                className={cn(
                                  "text-[9px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer",
                                  currentItem.customReviewCount === null || currentItem.customReviewCount === undefined || String(currentItem.customReviewCount).toLowerCase() === "none"
                                    ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                                    : "bg-surface border-white/10 text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {currentItem.customReviewCount === null || currentItem.customReviewCount === undefined || String(currentItem.customReviewCount).toLowerCase() === "none" ? "None (Organic)" : "Set None"}
                              </button>
                            </div>
                            {currentItem.customReviewCount !== null && currentItem.customReviewCount !== undefined && String(currentItem.customReviewCount).toLowerCase() !== "none" ? (
                              <input
                                type="number"
                                min="0"
                                placeholder="e.g. 14"
                                className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none font-mono focus:border-accent"
                                value={currentItem.customReviewCount ?? ""}
                                onChange={e => updateImportedProductField("customReviewCount", e.target.value === "" ? null : parseInt(e.target.value) || 0)}
                              />
                            ) : (
                              <p className="text-[10px] text-muted-foreground italic pt-1">
                                Organic buyer reviews only (no boost added).
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Atelier Overview Section */}
                        <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-accent">Atelier Overview Title</label>
                            <input
                              type="text"
                              placeholder="ATELIER OVERVIEW"
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                              value={currentItem.overviewTitle ?? ""}
                              onChange={e => updateImportedProductField("overviewTitle", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Atelier Overview Description / Story</label>
                            <textarea
                              rows={2}
                              placeholder="Craftsmanship narrative or atelier story for the overview section..."
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent resize-y leading-normal font-sans"
                              value={currentItem.details ?? currentItem.overviewDescription ?? ""}
                              onChange={e => {
                                updateImportedProductField("details", e.target.value);
                                updateImportedProductField("overviewDescription", e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        {/* Simplified Markup Format Product Information Textarea */}
                        <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-[10px] uppercase font-bold tracking-wider text-accent block">Product Information Markup</label>
                              <p className="text-[10px] text-muted-foreground">
                                Use <code className="text-gold">*#Title#*</code> for accordion headers, <code className="text-gold">**Subtitle**</code> for subtitles, and <code className="text-gold">*Label : Value*</code> for rows.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const sampleMarkup = `*#Product Details#*\n**Premium Quality Specifications**\n*Material Composition : 100% Organic Cotton*\n*Fabric Type : Organic Cotton*\n*Care Instructions : Dry clean only.*\n\n*#Manufacturing Information#*\n**Production & Origin**\n*Country of Origin : India*\n*Manufacturer : Atelier ReeVibes Crafts Ltd.*\n*SKU / Reference : SKU-55006*\n\n*#Shipping & Warranty#*\n**Delivery Information**\n*Shipping Time : 3–5 Business Days*\n*Warranty : 12 Months*\n*Return Policy : 7-Day Easy Returns*`;
                                updateImportedProductField("productInfo", sampleMarkup);
                              }}
                              className="text-[10px] text-accent hover:underline uppercase font-bold cursor-pointer"
                            >
                              Load Template
                            </button>
                          </div>
                          <textarea
                            rows={10}
                            placeholder={`*#Product Details#*
**Premium Quality Specifications**
*Material Composition : 100% Organic Cotton*
*Fabric Type : Organic Cotton*
*Care Instructions : Dry clean only.*

*#Manufacturing Information#*
**Production & Origin**
*Country of Origin : India*
*Manufacturer : Atelier ReeVibes Crafts Ltd.*
*SKU / Reference : SKU-55006*`}
                            className="w-full bg-surface border border-black/10 dark:border-white/10 p-3 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono leading-relaxed resize-y min-h-[200px]"
                            value={currentItem.productInfo || ""}
                            onChange={e => updateImportedProductField("productInfo", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Right column: Price, Sizes, Stock, Image curation */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Original Price (regular)</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                              value={currentItem.originalPrice || ""}
                              placeholder="e.g. ₹1,299"
                              onChange={e => {
                                const val = e.target.value;
                                const parsedVal = val.replace(/[^0-9.]/g, "");
                                updateImportedProductField("originalPrice", parsedVal ? `₹${parseInt(parsedVal).toLocaleString()}` : "");
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Discounted Price (sale)</label>
                            <input
                              type="text"
                              required
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                              value={currentItem.price}
                              placeholder="e.g. ₹999"
                              onChange={e => {
                                const val = e.target.value;
                                const parsedVal = val.replace(/[^0-9.]/g, "");
                                updateImportedProductField("price", parsedVal ? `₹${parseInt(parsedVal).toLocaleString()}` : "");
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Product Type</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                              value={currentItem.type || ""}
                              onChange={e => updateImportedProductField("type", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">SKU Reference</label>
                            <input
                              type="text"
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                              value={currentItem.sku}
                              onChange={e => updateImportedProductField("sku", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Sizes and Quantities */}
                        <div className="space-y-2 border border-black/10 dark:border-white/10 rounded-2xl p-3 bg-black/5 dark:bg-white/5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-accent block">Sizes and Quantities</label>
                          
                          {/* List of current sizes */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                            {Object.entries(currentItem.stockPerSize || {}).map(([sz, qty]: [string, any]) => (
                              <div key={sz} className="space-y-1 border border-black/10 dark:border-white/10 rounded-xl p-2 bg-black/5 dark:bg-white/5 relative group">
                                <label className="text-[9px] uppercase text-muted-foreground font-mono font-bold block">Size {sz}</label>
                                <div className="flex items-center gap-1 justify-between">
                                  <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-transparent border-0 p-0 text-xs text-foreground outline-none font-mono focus:ring-0"
                                    value={qty}
                                    onChange={e => updateImportedProductStock(sz, Math.max(0, parseInt(e.target.value) || 0))}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSizeFromImport(sz)}
                                    className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                                    title={`Remove size ${sz}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Form to add new size */}
                          <div className="border-t border-black/10 dark:border-white/10 pt-2 mt-2 flex items-end gap-2">
                            <div className="flex-1 space-y-1">
                              <label className="text-[8px] uppercase text-muted-foreground font-bold block">Size</label>
                              <input
                                type="text"
                                placeholder="XL"
                                className="w-full bg-surface border border-black/10 dark:border-white/10 p-1 text-xs text-foreground rounded-lg outline-none focus:border-accent uppercase"
                                value={newSizeName}
                                onChange={e => setNewSizeName(e.target.value)}
                              />
                            </div>
                            <div className="w-16 space-y-1">
                              <label className="text-[8px] uppercase text-muted-foreground font-bold block">Qty</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full bg-surface border border-black/10 dark:border-white/10 p-1 text-xs text-foreground rounded-lg outline-none focus:border-accent text-center font-mono"
                                value={newSizeQty}
                                onChange={e => setNewSizeQty(Math.max(0, parseInt(e.target.value) || 0))}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddSizeToImport}
                              className="bg-accent/20 border border-accent/30 text-accent hover:bg-accent hover:text-white px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Images preview and add */}
                        <div className="space-y-2 border border-black/10 dark:border-white/10 rounded-2xl p-3 bg-black/5 dark:bg-white/5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-accent block">Images Dossier</label>
                          
                          {/* Image preview thumbnails */}
                          <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin max-h-24">
                            {(currentItem.images || []).map((imgUrl: string, idx: number) => {
                              const isFirst = idx === 0;
                              const isLast = idx === (currentItem.images || []).length - 1;
                              return (
                                <div key={idx} className="relative w-16 h-20 rounded-lg overflow-hidden border border-black/15 dark:border-white/15 bg-black shrink-0 group">
                                  <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                                  
                                  {/* Delete Trigger */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImageFromImport(imgUrl)}
                                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-rose-600 text-white rounded-full p-0.5 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                                    title="Remove image"
                                  >
                                    <X className="w-2 h-2" />
                                  </button>

                                  {/* Reorder Shifting Triggers */}
                                  <div className="absolute inset-0 flex items-center justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                                    {!isFirst ? (
                                      <button
                                        type="button"
                                        onClick={() => handleMoveImageLeft(idx)}
                                        className="bg-black/80 hover:bg-accent text-white p-0.5 rounded cursor-pointer pointer-events-auto shadow-md"
                                        title="Move left"
                                      >
                                        <ArrowLeft className="w-2.5 h-2.5" />
                                      </button>
                                    ) : <div />}
                                    {!isLast ? (
                                      <button
                                        type="button"
                                        onClick={() => handleMoveImageRight(idx)}
                                        className="bg-black/80 hover:bg-accent text-white p-0.5 rounded cursor-pointer pointer-events-auto shadow-md"
                                        title="Move right"
                                      >
                                        <ArrowRight className="w-2.5 h-2.5" />
                                      </button>
                                    ) : <div />}
                                  </div>

                                  {currentItem.image === imgUrl && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-accent/80 text-[7px] font-bold text-center text-white py-0.5">
                                      MAIN
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {(currentItem.images || []).length === 0 && (
                              <div className="text-xs text-muted-foreground italic py-4">No images added.</div>
                            )}
                          </div>

                          {/* Add new image URL */}
                          <div className="flex gap-2 items-end pt-1">
                            <div className="flex-1 space-y-1">
                              <label className="text-[8px] uppercase text-muted-foreground font-bold block">New Image URL</label>
                              <input
                                type="text"
                                placeholder="Paste image url..."
                                className="w-full bg-surface border border-black/10 dark:border-white/10 p-1 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                                value={newImageUrl}
                                onChange={e => setNewImageUrl(e.target.value)}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddImageToImport}
                              className="bg-accent/20 border border-accent/30 text-accent hover:bg-accent hover:text-white px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/5">
                      <button
                        type="button"
                        onClick={() => {
                          setImportedProducts([]);
                          setIsReviewingImports(false);
                          setIsManualCreate(false);
                          setEditingProduct(null);
                        }}
                        className="editorial-label border border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground dark:hover:text-white px-5 py-2.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {editingProduct ? "Cancel" : (isManualCreate ? "Cancel" : "Cancel Import")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveImportedProducts(true)}
                        className="editorial-label bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-sm shadow-lg font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Check className="w-4 h-4" /> {editingProduct ? "Save Changes" : (isManualCreate ? "Publish Products" : "Publish")}
                      </button>

                      {!editingProduct && (
                        <button
                          type="button"
                          onClick={() => handleSaveImportedProducts(false)}
                          className="editorial-label bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-sm shadow-lg font-bold flex items-center gap-2 cursor-pointer transition-colors border border-white/5"
                        >
                          <PlusCircle className="w-4 h-4" /> {isManualCreate ? "Add Products" : "Add (Unpublished)"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {productToDeleteIndex !== null && (() => {
            const prodToDelete = importedProducts[productToDeleteIndex];
            return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-zinc-950 border border-rose-500/20 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
                  <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold text-white font-serif">Remove Draft Card?</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Are you sure you want to delete <span className="text-white font-semibold">{prodToDelete?.name || `Product ${productToDeleteIndex + 1}`}</span> from the creation list? This action cannot be undone.
                  </p>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (productToDeleteIndex !== null) {
                          const updated = importedProducts.filter((_, i) => i !== productToDeleteIndex);
                          if (updated.length === 0) {
                            setIsReviewingImports(false);
                            setImportedProducts([]);
                            setIsManualCreate(false);
                            setEditingProduct(null);
                          } else {
                            setImportedProducts(updated);
                            if (currentImportIndex >= updated.length) {
                              setCurrentImportIndex(Math.max(0, updated.length - 1));
                            } else if (currentImportIndex === productToDeleteIndex) {
                              setCurrentImportIndex(Math.max(0, productToDeleteIndex - 1));
                            }
                          }
                          setProductToDeleteIndex(null);
                        }
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductToDeleteIndex(null)}
                      className="bg-white/10 hover:bg-white/20 text-foreground py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}


          {/* Sub-tabs for All, Unpublished, and Published */}
          <div className="flex border-b border-white/10 gap-6 text-xs font-bold uppercase tracking-wider mb-4">
            <button
              onClick={() => {
                setCatalogTab("all");
                setSelectedProductIds([]);
              }}
              className={`pb-2.5 transition-colors cursor-pointer ${catalogTab === "all" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              All Products ({productsList.length})
            </button>
            <button
              onClick={() => {
                setCatalogTab("unpublished");
                setSelectedProductIds([]);
              }}
              className={`pb-2.5 transition-colors cursor-pointer ${catalogTab === "unpublished" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              Unpublished ({productsList.filter((p: any) => p.status && p.status !== "PUBLISHED").length})
            </button>
            <button
              onClick={() => {
                setCatalogTab("published");
                setSelectedProductIds([]);
              }}
              className={`pb-2.5 transition-colors cursor-pointer ${catalogTab === "published" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              Published ({productsList.filter((p: any) => p.status === "PUBLISHED" || !p.status).length})
            </button>
          </div>

          {/* Bulk Actions Bar */}
          {(() => {
            let filtered = productsList;

            // 2. Filter by Catalog Tab
            if (catalogTab === "published") {
              filtered = filtered.filter((p: any) => p.status === "PUBLISHED" || !p.status);
            } else if (catalogTab === "unpublished") {
              filtered = filtered.filter((p: any) => p.status && p.status !== "PUBLISHED");
            }

            // 3. Filter by Search Term
            if (searchTerm) {
              const keywords = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
              if (keywords.length > 0) {
                filtered = filtered.filter((p: any) => {
                  let score = 0;
                  keywords.forEach(kw => {
                    const name = String(p.name || "").toLowerCase();
                    const house = String(p.house || "").toLowerCase();
                    const category = String(p.category || "").toLowerCase();
                    const gender = String(p.gender || "").toLowerCase();
                    const fabric = String(p.fabricMaterial || p.material || p.fabric || "").toLowerCase();
                    const description = String(p.description || "").toLowerCase();
                    const color = String(p.color || "").toLowerCase();
                    const type = String(p.type || "").toLowerCase();
                    const sku = String(p.sku || "").toLowerCase();
                    
                    // Sizes and stocks
                    const sizes = (p.sizes || []).map((s: string) => String(s || "").toLowerCase());
                    const sizesStr = sizes.join(",");
                    const stocks = Object.entries(p.stockPerSize || {}).map(([sz, qty]) => `${String(sz).toLowerCase()}:${qty}`);
                    const stocksStr = stocks.join(" ");

                    // Price info
                    const price = String(p.price || "").toLowerCase();
                    const originalPrice = String(p.originalPrice || "").toLowerCase();

                    // Check gender match
                    if (["men", "man", "gentlemen", "boy", "male"].includes(kw)) {
                      if (gender === "men" || gender === "unisex") {
                        score++;
                        return;
                      }
                    }
                    if (["women", "woman", "lady", "ladies", "girl", "female"].includes(kw)) {
                      if (gender === "women" || gender === "unisex") {
                        score++;
                        return;
                      }
                    }

                    // Check category (singular/plural)
                    const catNorm = category.replace("s", "");
                    const kwNorm = kw.replace("s", "");
                    if (catNorm.includes(kwNorm) || kwNorm.includes(catNorm)) {
                      score++;
                      return;
                    }

                    // Check other fields
                    if (
                      name.includes(kw) ||
                      house.includes(kw) ||
                      description.includes(kw) ||
                      color.includes(kw) ||
                      fabric.includes(kw) ||
                      type.includes(kw) ||
                      sku.includes(kw) ||
                      sizesStr.includes(kw) ||
                      stocksStr.includes(kw) ||
                      price.includes(kw) ||
                      originalPrice.includes(kw)
                    ) {
                      score++;
                      return;
                    }
                  });
                  return score === keywords.length;
                });
              }
            }

            // 4. Sort Catalog Products
            if (sortField === "date") {
              const getProductTimestamp = (prod: any) => {
                if (prod.id && String(prod.id).startsWith("pr-")) {
                  const parts = String(prod.id).split("-");
                  const ts = parseInt(parts[1]);
                  if (!isNaN(ts)) return ts;
                }
                const numericPart = parseInt(String(prod.id).replace(/\D/g, ""));
                return isNaN(numericPart) ? 0 : numericPart;
              };
              filtered = [...filtered].sort((a, b) => {
                const tsA = getProductTimestamp(a);
                const tsB = getProductTimestamp(b);
                return sortDirection === "desc" ? tsB - tsA : tsA - tsB;
              });
            } else if (sortField === "price") {
              const getProductPrice = (prod: any) => {
                const basePrice = parseFloat(String(prod.price || "").replace(/[^0-9.]/g, ""));
                if (isNaN(basePrice)) return 0;
                const pct = prod.discount || 0;
                if (pct > 0) {
                  return basePrice * (1 - pct / 100);
                }
                return basePrice;
              };
              filtered = [...filtered].sort((a, b) => {
                const pA = getProductPrice(a);
                const pB = getProductPrice(b);
                return sortDirection === "desc" ? pB - pA : pA - pB;
              });
            }

            return (
              <>
                <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl mb-6 text-xs backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length === filtered.length && filtered.length > 0}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedProductIds(filtered.map(p => String(p.id)));
                          } else {
                            setSelectedProductIds([]);
                          }
                        }}
                        className="rounded border-white/20 text-accent focus:ring-accent w-4 h-4 bg-transparent"
                      />
                      <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Select All ({filtered.length})</span>
                    </label>
                    {selectedProductIds.length > 0 && (
                      <span className="text-accent font-mono font-bold">[{selectedProductIds.length} Selected]</span>
                    )}
                  </div>
                  
                  {selectedProductIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => {
                          selectedProductIds.forEach(id => {
                            const p = productsList.find(x => String(x.id) === id);
                            if (p) {
                              updateProduct(id, { ...p, status: "PUBLISHED", visibility: "VISIBLE" });
                            }
                          });
                          setSelectedProductIds([]);
                          triggerModal("success", "Bulk Published", "Selected products are now published to the user shop portal.", () => {});
                        }}
                        className="bg-accent text-white px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-accent/90 transition-all cursor-pointer shadow-lg shadow-accent/20"
                      >
                        Bulk Publish ({selectedProductIds.length})
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${selectedProductIds.length} selected product(s)? This action cannot be undone.`)) {
                            const count = selectedProductIds.length;
                            selectedProductIds.forEach(id => {
                              deleteProduct(id);
                            });
                            setSelectedProductIds([]);
                            triggerModal("success", "Products Deleted", `Successfully deleted ${count} selected products from production database.`, () => {});
                          }
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full transition-all cursor-pointer shadow-lg shadow-rose-600/20 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Bulk Delete ({selectedProductIds.length})
                      </button>
                      <button
                        onClick={() => setSelectedProductIds([])}
                        className="bg-white/5 border border-white/10 text-foreground px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Deselect All
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((p: any) => {
                    const isChecked = selectedProductIds.includes(String(p.id));
                    const isComplete =
                      !!p.name &&
                      !!p.category &&
                      !!p.gender &&
                      (!!p.tag || (p.tags && p.tags.length > 0)) &&
                      (!!p.material || !!p.fabric) &&
                      (p.house || p.brand) &&
                      !!p.price &&
                      p.sizes &&
                      p.sizes.length > 0 &&
                      ((p.images && p.images.length > 0) || !!p.image) &&
                      !!p.sku;

                    const hasRating =
                      p.customRating !== undefined &&
                      p.customRating !== null &&
                      String(p.customRating).toLowerCase() !== "none" &&
                      Number(p.customRating) > 0;

                    const isPublished = p.status === "PUBLISHED";
                    const isVisible = p.visibility !== "HIDDEN";
                    const fabricInfo = p.material || p.fabric || p.fabricMaterial;

                    return (
                      <div
                        key={p.id}
                        className="liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden border border-white/10 rounded-2xl bg-white/[0.02] hover:border-accent/40 transition-all duration-300"
                      >
                        {/* Checkbox Selector */}
                        <div className="absolute top-2.5 left-2.5 z-20">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedProductIds([...selectedProductIds, String(p.id)]);
                              } else {
                                setSelectedProductIds(selectedProductIds.filter(id => id !== String(p.id)));
                              }
                            }}
                            className="rounded border-white/30 text-accent focus:ring-accent w-4 h-4 bg-zinc-950/85 backdrop-blur cursor-pointer"
                          />
                        </div>

                        {/* Top Right: Status dot & Live badge */}
                        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                          <span
                            className={cn(
                              "text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md border shadow-sm",
                              isPublished
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            )}
                          >
                            {isPublished ? "Live" : "Draft"}
                          </span>
                          <div
                            title={isPublished ? "Published live" : isComplete ? "Complete but unpublished" : "Incomplete"}
                            className={cn(
                              "w-2 h-2 rounded-full border border-white/20 shadow-md",
                              isPublished
                                ? "bg-emerald-500 shadow-emerald-500/80"
                                : isComplete
                                ? "bg-blue-500 shadow-blue-500/80"
                                : "bg-yellow-500 shadow-yellow-500/80 animate-pulse"
                            )}
                          />
                        </div>

                        {/* Compact Image Container */}
                        <div className="aspect-[4/5] overflow-hidden bg-zinc-950 relative">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {p.tag && (
                            <span className="absolute bottom-2 left-2 bg-accent/95 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm backdrop-blur-sm">
                              {p.tag}
                            </span>
                          )}
                          {p.discount > 0 && (
                            <span className="absolute bottom-2 right-2 bg-rose-600/95 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm">
                              {p.discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Compact Product Details Body */}
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5 text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground gap-1">
                              <span className="truncate font-semibold">{p.house || p.brand} · {p.category}</span>
                              <span className="text-accent uppercase font-mono text-[9px] shrink-0">{p.type || "Product"}</span>
                            </div>
                            <h4
                              className="font-serif text-sm text-foreground font-bold line-clamp-1 group-hover:text-accent transition-colors"
                              title={p.name}
                            >
                              {p.name}
                            </h4>

                            {/* Price Line */}
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="text-accent text-sm font-bold">{p.price}</span>
                              {p.originalPrice && p.originalPrice !== p.price && (
                                <span className="line-through text-muted-foreground text-[11px]">{p.originalPrice}</span>
                              )}
                            </div>

                            {/* Compact Info Badges: Fabric & Rating */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              {fabricInfo && (
                                <span
                                  className="text-[9px] text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded max-w-[120px] truncate"
                                  title={`Fabric/Material: ${fabricInfo}`}
                                >
                                  {fabricInfo}
                                </span>
                              )}
                              {hasRating ? (
                                <span className="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  {Number(p.customRating).toFixed(1)}
                                  {p.customReviewCount ? ` (${p.customReviewCount})` : ""}
                                </span>
                              ) : (
                                <span className="text-[9px] text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                                  ★ Organic
                                </span>
                              )}
                              {p.sku && (
                                <span className="text-[9px] text-muted-foreground/80 font-mono">
                                  {p.sku}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Toolbar: Visibility, Edit, Delete */}
                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                              {/* Hide / Unhide Toggle */}
                              <button
                                type="button"
                                onClick={() => {
                                  const nextStatus = isPublished ? "UNPUBLISHED" : "PUBLISHED";
                                  const nextVisibility = isPublished ? "HIDDEN" : "VISIBLE";
                                  updateProduct(p.id, {
                                    ...p,
                                    status: nextStatus,
                                    visibility: nextVisibility,
                                  });
                                  toast.success(isPublished ? `"${p.name}" hidden from shop` : `"${p.name}" published live`);
                                }}
                                className={cn(
                                  "flex-1 py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider border flex items-center justify-center gap-1 transition-colors cursor-pointer",
                                  isPublished
                                    ? "bg-white/5 hover:bg-white/10 border-white/15 text-muted-foreground hover:text-foreground"
                                    : "bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-400"
                                )}
                                title={isPublished ? "Hide from customer storefront" : "Publish to customer storefront"}
                              >
                                {isPublished ? (
                                  <>
                                    <EyeOff className="w-3 h-3" /> Hide
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3" /> Publish
                                  </>
                                )}
                              </button>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleEditProduct(p)}
                                className="flex-1 border border-accent/30 hover:border-accent text-accent hover:bg-accent/10 py-1.5 px-2 text-[9px] uppercase tracking-wider font-bold flex items-center justify-center gap-1 rounded-lg cursor-pointer transition-colors"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="border border-rose-500/25 hover:border-rose-500/60 text-rose-400 hover:bg-rose-500/15 p-1.5 rounded-lg cursor-pointer transition-colors"
                                title="Delete product permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* 4. ORDERS LIFE CYCLE */}
      {tab === "orders" && (
        <AdminCard className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-serif text-xl">Order Tracker Dashboard</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Live status-driven logistics & fulfillment pipeline.</p>
            </div>

            {/* 3 Workflow Tabs Navigation */}
            <div className="flex items-center gap-2 bg-surface-2 p-1 rounded-lg border border-border-subtle">
              <button
                onClick={() => setOrderSubTab("ordered")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                  orderSubTab === "ordered"
                    ? "bg-accent text-white shadow"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Ordered Products
                <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                  {ordersList.filter(o => ["pending approval", "accepted", "processing", "pending", "order placed"].includes(o.status?.toLowerCase() || "")).length}
                </span>
              </button>

              <button
                onClick={() => setOrderSubTab("delivering")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                  orderSubTab === "delivering"
                    ? "bg-accent text-white shadow"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <Truck className="w-3.5 h-3.5" />
                Delivering Orders
                <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                  {ordersList.filter(o => ["ready to ship", "ready to dispatch", "pickup scheduled", "shipped", "in transit", "in-transit", "delivered by tomorrow", "delivered by today", "out for delivery"].includes(o.status?.toLowerCase() || "")).length}
                </span>
              </button>

              <button
                onClick={() => setOrderSubTab("delivered")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                  orderSubTab === "delivered"
                    ? "bg-accent text-white shadow"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Delivered Orders
                <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                  {ordersList.filter(o => ["delivered", "returned", "refunded", "rejected"].includes(o.status?.toLowerCase() || "")).length}
                </span>
              </button>
            </div>
          </div>

          {/* Sub-tab 1: Ordered Products */}
          {orderSubTab === "ordered" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-2/40 p-3 rounded-lg border border-white/5">
                <div className="text-xs text-muted-foreground">
                  Orders placed by customers awaiting fulfillment, courier assignment, and pickup scheduling.
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadBulkExcel}
                    className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Download Excel
                  </button>
                  <button
                    onClick={handleDownloadBulkCSV}
                    className="bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/30 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Download CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-sm">
                    {(() => {
                      const list = ordersList.filter(o =>
                        ["pending approval", "accepted", "processing", "pending", "order placed"].includes(o.status?.toLowerCase() || "")
                      );
                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-xs text-muted-foreground italic">
                              No ordered products pending processing.
                            </td>
                          </tr>
                        );
                      }
                      return list.map(o => (
                        <tr key={o.id} className="hover:bg-surface-2/40">
                          <td className="py-4 font-mono text-xs">
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              className="text-accent hover:underline text-left font-bold cursor-pointer"
                            >
                              {o.id}
                            </button>
                          </td>
                          <td className="py-4 text-xs">
                            <div className="font-semibold text-white">{o.customerName || "Member"}</div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const matched = state.users.find(u => u.id === o.userId) || { id: o.userId, firstName: o.customerName || "Customer", lastName: "" };
                                setSelectedCustomerDetails(matched);
                                setDossierTab("details");
                              }}
                              className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline cursor-pointer"
                              title={`Open Customer Curation Dossier for ${o.userId}`}
                            >
                              <User className="w-2.5 h-2.5" />
                              {o.userId}
                            </button>
                          </td>
                          <td className="py-4 text-xs">
                            {(() => {
                              const items = Array.isArray(o.items) && o.items.length > 0
                                ? o.items
                                : (o.itemsJson ? (() => { try { const p = JSON.parse(o.itemsJson); return Array.isArray(p) ? p : []; } catch { return []; } })() : []);
                              if (!items || items.length === 0) return <span className="text-muted-foreground italic">No items listed</span>;
                              return items.map((item: any) => `${item.name || 'Item'} (${item.selectedSize || "M"}) x${item.qty || 1}`).join(", ");
                            })()}
                          </td>
                          <td className="py-4 font-serif font-bold text-accent">₹{o.total.toLocaleString()}</td>
                          <td className="py-4 text-xs">
                            {o.paymentMethod?.toLowerCase().includes("cash") || o.paymentMethod?.toLowerCase().includes("cod") ? (
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-flex items-center gap-1">
                                <Banknote className="w-3 h-3" /> COD · {o.paymentStatus || "Pending"}
                              </span>
                            ) : o.paymentMethod?.toLowerCase().includes("wallet") ? (
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 inline-flex items-center gap-1">
                                <Wallet className="w-3 h-3" /> Wallet · {o.paymentStatus || "Paid"}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20 inline-flex items-center gap-1">
                                <CreditCard className="w-3 h-3" /> {o.paymentMethod || "Online"} · {o.paymentStatus || "Paid"}
                              </span>
                            )}
                          </td>
                          <td className="py-4">
                            <StatusChip status={o.status} tone="warn" />
                          </td>
                          <td className="py-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              className="bg-accent/20 hover:bg-accent text-accent hover:text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
                            >
                              View Order & Process
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Delivering Orders */}
          {orderSubTab === "delivering" && (
            <div className="space-y-4">
              <div className="text-xs text-muted-foreground bg-surface-2/40 p-3 rounded-lg border border-white/5">
                Orders handed over to Shiprocket logisitcs pipeline. Live tracking updates automatically via webhook.
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Courier / AWB</th>
                      <th className="pb-3">Est. Delivery</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-sm">
                    {(() => {
                      const list = ordersList.filter(o =>
                        ["ready to ship", "ready to dispatch", "pickup scheduled", "shipped", "in transit", "in-transit", "delivered by tomorrow", "delivered by today", "out for delivery"].includes(o.status?.toLowerCase() || "")
                      );
                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground italic">
                              No active delivering orders currently in transit.
                            </td>
                          </tr>
                        );
                      }
                      return list.map(o => (
                        <tr key={o.id} className="hover:bg-surface-2/40">
                          <td className="py-4 font-mono text-xs">
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              className="text-accent hover:underline text-left font-bold cursor-pointer"
                            >
                              {o.id}
                            </button>
                          </td>
                          <td className="py-4 text-xs">
                            <div className="font-semibold text-white">{o.customerName || "Member"}</div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const matched = state.users.find(u => u.id === o.userId) || { id: o.userId, firstName: o.customerName || "Customer", lastName: "" };
                                setSelectedCustomerDetails(matched);
                                setDossierTab("details");
                              }}
                              className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline cursor-pointer"
                              title={`Open Customer Curation Dossier for ${o.userId}`}
                            >
                              <User className="w-2.5 h-2.5" />
                              {o.userId}
                            </button>
                          </td>
                          <td className="py-4 text-xs">
                            <div className="font-semibold text-accent">{o.courierPartner || "Shiprocket Express"}</div>
                            <div className="font-mono text-[10px] text-muted-foreground">AWB: {o.trackingNumber || "Assigned"}</div>
                          </td>
                          <td className="py-4 text-xs text-muted-foreground">
                            {o.estimatedDeliveryDate || "Calculating..."}
                          </td>
                          <td className="py-4">
                            <StatusChip status={o.status} tone="accent" />
                          </td>
                          <td className="py-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              className="bg-accent/20 hover:bg-accent text-accent hover:text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
                            >
                              View Order & Track
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Delivered Orders */}
          {orderSubTab === "delivered" && (
            <div className="space-y-4">
              <div className="text-xs text-muted-foreground bg-surface-2/40 p-3 rounded-lg border border-white/5">
                Successfully delivered customer orders with active 7-day return eligibility window.
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Delivered Date</th>
                      <th className="pb-3">Return Window</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-sm">
                    {(() => {
                      const list = ordersList.filter(o =>
                        ["delivered", "returned", "refunded", "rejected"].includes(o.status?.toLowerCase() || "")
                      );
                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground italic">
                              No delivered orders recorded yet.
                            </td>
                          </tr>
                        );
                      }
                      return list.map(o => {
                        const delDate = new Date(o.date);
                        const now = new Date();
                        const diffDays = Math.floor((now.getTime() - delDate.getTime()) / (1000 * 3600 * 24));
                        const returnDaysLeft = Math.max(0, 7 - diffDays);

                        return (
                          <tr key={o.id} className="hover:bg-surface-2/40">
                            <td className="py-4 font-mono text-xs">
                              <button
                                onClick={() => setSelectedOrderDetails(o)}
                                className="text-accent hover:underline text-left font-bold cursor-pointer"
                              >
                                {o.id}
                              </button>
                            </td>
                            <td className="py-4 text-xs">
                              <div className="font-semibold text-white">{o.customerName || "Member"}</div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const matched = state.users.find(u => u.id === o.userId) || { id: o.userId, firstName: o.customerName || "Customer", lastName: "" };
                                  setSelectedCustomerDetails(matched);
                                  setDossierTab("details");
                                }}
                                className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline cursor-pointer"
                                title={`Open Customer Curation Dossier for ${o.userId}`}
                              >
                                <User className="w-2.5 h-2.5" />
                                {o.userId}
                              </button>
                            </td>
                            <td className="py-4 text-xs text-muted-foreground">
                              {formatOrderDateTime(o.date)}
                            </td>
                            <td className="py-4 text-xs">
                              {returnDaysLeft > 0 ? (
                                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  Eligible ({returnDaysLeft} Days Left)
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-[10px] bg-white/5 px-2 py-0.5 rounded">
                                  Window Expired
                                </span>
                              )}
                            </td>
                            <td className="py-4">
                              <StatusChip status={o.status} tone="success" />
                            </td>
                            <td className="py-4 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedOrderDetails(o)}
                                className="bg-accent/20 hover:bg-accent text-accent hover:text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
                              >
                                View Order
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </AdminCard>
      )}

      {/* 5. RETURNS & REFUNDS */}
      {tab === "returns" && (
        <AdminCard className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-serif text-xl">Returns Queue & Refund Processing</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manage customer return requests and pipeline operations.</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Filter Status:</span>
              <select
                value={returnsFilter}
                onChange={e => setReturnsFilter(e.target.value)}
                className="bg-surface border border-border-subtle rounded-md text-xs px-2.5 py-1.5 text-white outline-none focus:border-accent"
              >
                <option value="All">All Requests</option>
                <option value="New Requests">New Requests</option>
                <option value="Approved">Approved</option>
                <option value="Pickup Scheduled">Pickup Scheduled</option>
                <option value="In Transit">In Transit</option>
                <option value="Received">Received</option>
                <option value="Refund Pending">Refund Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                  <th className="pb-3">Return ID</th>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Item Details</th>
                  <th className="pb-3">Delivery Date</th>
                  <th className="pb-3">Original Payment</th>
                  <th className="pb-3">Reason & Comments</th>
                  <th className="pb-3">Pending Refund</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {filteredReturns.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-xs text-muted-foreground italic">
                      No returns registered in system queue.
                    </td>
                  </tr>
                ) : (
                  filteredReturns.map(r => {
                    const order = Object.values(state.orders).flat().find(o => o.id === r.orderId);
                    const deliveryDateStr = order?.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "—";
                    const isCod = (order?.paymentMethod || "").toLowerCase().includes("cash") || (order?.paymentMethod || "").toLowerCase().includes("cod");
                    const isWallet = (order?.paymentMethod || "").toLowerCase().includes("wallet") && ((order?.razorpayAmountPaid ?? 0) === 0);
                    const isSplit = ((order?.walletAmountUsed ?? 0) > 0) && ((order?.razorpayAmountPaid ?? 0) > 0);

                    return (
                      <tr key={r.id} className="hover:bg-surface-2/40 group cursor-pointer" onClick={() => setSelectedReturnDetails(r)}>
                        <td className="py-4 font-mono text-xs text-accent font-bold group-hover:underline">
                          {r.id}
                        </td>
                        <td className="py-4 font-mono text-xs">{r.orderId}</td>
                        <td className="py-4">
                          <div className="font-semibold text-white">{r.customerName}</div>
                        </td>
                        <td className="py-4">
                          <div className="font-medium text-white">{r.productName}</div>
                          <div className="text-[10px] text-muted-foreground">Size: {r.selectedSize || "—"} · Qty: {r.qty || 1}</div>
                        </td>
                        <td className="py-4 text-xs text-muted-foreground">{deliveryDateStr}</td>
                        <td className="py-4 whitespace-nowrap">
                          {isCod ? (
                            <span className="text-amber-300 font-bold inline-flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[10px]">
                              <Banknote className="w-3 h-3" /> COD
                            </span>
                          ) : isWallet ? (
                            <span className="text-purple-300 font-bold inline-flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-[10px]">
                              <Wallet className="w-3 h-3" /> Wallet
                            </span>
                          ) : isSplit ? (
                            <span className="text-sky-300 font-bold inline-flex items-center gap-1 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 text-[10px]">
                              <Layers3 className="w-3 h-3" /> Split
                            </span>
                          ) : (
                            <span className="text-sky-300 font-bold inline-flex items-center gap-1 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 text-[10px]">
                              <CreditCard className="w-3 h-3" /> Razorpay
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="font-semibold text-amber-200">{r.reason}</div>
                          <div className="text-xs text-muted-foreground max-w-xs truncate">{r.comment}</div>
                        </td>
                        <td className="py-4">
                          <div className="font-serif font-semibold">₹{r.refundAmount.toLocaleString()}</div>
                          <div className="text-[9px] font-mono mt-0.5">
                            {r.status === "Refund Completed" ? (
                              <div className="space-y-0.5">
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Refund Settled
                                </span>
                                {(r.razorpayRefundId || r.refundTransactionId) && (
                                  <div className="flex items-center gap-1 text-[9px] text-sky-400">
                                    <span className="font-bold">RP:</span>
                                    <span className="truncate max-w-[85px]">{r.razorpayRefundId || r.refundTransactionId}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(r.razorpayRefundId || r.refundTransactionId || "");
                                        toast.success("Refund ID copied!");
                                      }}
                                      className="text-muted-foreground hover:text-white p-0.5 cursor-pointer"
                                      title="Copy Refund ID"
                                    >
                                      <Copy className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                )}
                                {r.walletTransactionId && (
                                  <div className="flex items-center gap-1 text-[9px] text-amber-300">
                                    <span className="font-bold">WLT:</span>
                                    <span className="truncate max-w-[85px]">{r.walletTransactionId}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(r.walletTransactionId || "");
                                        toast.success("Wallet Tx ID copied!");
                                      }}
                                      className="text-muted-foreground hover:text-white p-0.5 cursor-pointer"
                                      title="Copy Wallet Tx ID"
                                    >
                                      <Copy className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : r.status === "Item Received" ? (
                              <span className="text-amber-300 font-bold animate-pulse">● Ready to Refund</span>
                            ) : (
                              <span className="text-muted-foreground">Pending Return</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <StatusChip
                            status={r.status}
                            tone={
                              r.status === "Refund Completed" || r.status === "Approved" ? "success" :
                              r.status === "Pending" || r.status === "Under Review" || r.status === "Item Received" ? "warn" :
                              r.status === "Rejected" ? "danger" : "accent"
                            }
                          />
                        </td>
                        <td className="py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1.5 justify-end items-center">
                            {(r.status === "Return Requested" || r.status === "Pending" || r.status === "Under Review") && (
                              <>
                                <button
                                  onClick={async () => {
                                    await approveReturn(r.id);
                                    toast.success(`Return ${r.id} approved!`);
                                  }}
                                  title="Approve Return Request"
                                  className="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white text-[10px] uppercase font-bold px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" /> Accept
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectionModalReturnId(r.id);
                                    setSelectedRejectionReason("Return window expired");
                                    setCustomRejectionText("");
                                  }}
                                  title="Decline Return Request"
                                  className="bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white text-[10px] uppercase font-bold px-2 py-1 rounded border border-rose-500/30 flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="w-3 h-3" /> Decline
                                </button>
                              </>
                            )}

                            {r.status === "Return Approved" && (
                              <button
                                onClick={async () => {
                                  toast.info("Assigning reverse pickup on Shiprocket...");
                                  const res = await assignReturnPickup(r.id);
                                  if (res) toast.success("Shiprocket Reverse Pickup assigned!");
                                  else toast.error("Failed to assign pickup.");
                                }}
                                title="Assign Reverse Pickup Agent"
                                className="bg-sky-600/30 hover:bg-sky-600 text-sky-200 hover:text-white text-[10px] uppercase font-bold px-2 py-1 rounded border border-sky-500/30 flex items-center gap-1 cursor-pointer"
                              >
                                <Truck className="w-3 h-3" /> Pickup
                              </button>
                            )}

                            {(r.status === "Pickup Scheduled" || r.status === "In Transit") && (
                              <button
                                onClick={() => {
                                  updateReturnDetails(r.id, { status: "Item Received" });
                                  toast.success(`Return ${r.id} marked as received at warehouse!`);
                                }}
                                title="Mark Item Received at Warehouse"
                                className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] uppercase font-bold px-2 py-1 rounded border border-indigo-500/30 flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" /> Received
                              </button>
                            )}

                            {r.status === "Item Received" && (
                              <>
                                {isCod ? (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (confirm(`Credit ₹${r.refundAmount.toLocaleString()} to Customer's ReeVibes Wallet (COD Refund)?`)) {
                                        toast.info("Crediting customer's wallet...");
                                        const res = await processSplitRefund(r.id, "WALLET");
                                        if (res) toast.success("Wallet refund processed!");
                                        else toast.error("Failed to process refund.");
                                      }
                                    }}
                                    title="Credit Refund to ReeVibes Wallet (COD)"
                                    className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow flex items-center gap-1 cursor-pointer animate-pulse"
                                  >
                                    <Wallet className="w-3 h-3" /> Refund to Wallet
                                  </button>
                                ) : isWallet ? (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (confirm(`Refund ₹${r.refundAmount.toLocaleString()} back to Customer's ReeVibes Wallet?`)) {
                                        toast.info("Refunding to wallet...");
                                        const res = await processSplitRefund(r.id, "WALLET");
                                        if (res) toast.success("Wallet refund processed!");
                                        else toast.error("Failed to process refund.");
                                      }
                                    }}
                                    title="Refund to ReeVibes Wallet"
                                    className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow flex items-center gap-1 cursor-pointer animate-pulse"
                                  >
                                    <Wallet className="w-3 h-3" /> Refund to Wallet
                                  </button>
                                ) : isSplit ? (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (confirm(`Execute Split Refund of ₹${r.refundAmount.toLocaleString()} (Wallet + Razorpay)?`)) {
                                        toast.info("Processing split refund...");
                                        const res = await processSplitRefund(r.id, "AUTO");
                                        if (res) toast.success("Split refund executed!");
                                        else toast.error("Failed to process refund.");
                                      }
                                    }}
                                    title="Execute Split Refund (Wallet + Razorpay)"
                                    className="bg-accent hover:bg-accent/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow flex items-center gap-1 cursor-pointer animate-pulse"
                                  >
                                    <Layers3 className="w-3 h-3" /> Split Refund
                                  </button>
                                ) : (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (confirm(`Initiate Razorpay API Refund of ₹${r.refundAmount.toLocaleString()} to customer's original payment method?`)) {
                                        toast.info("Initiating Razorpay API refund...");
                                        const res = await processSplitRefund(r.id, "RAZORPAY");
                                        if (res) toast.success(`Razorpay refund initiated! ID: ${res.razorpayRefundId || res.refundTransactionId}`);
                                        else toast.error("Failed to initiate Razorpay refund.");
                                      }
                                    }}
                                    title="Initiate Gateway Refund via Razorpay API"
                                    className="bg-sky-600 hover:bg-sky-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow flex items-center gap-1 cursor-pointer animate-pulse"
                                  >
                                    <CreditCard className="w-3 h-3" /> Refund via Razorpay
                                  </button>
                                )}
                              </>
                            )}

                            {r.status === "Refund Completed" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedReturnDetails(r);
                                }}
                                title="View Refund Settlement Receipt"
                                className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] uppercase font-bold px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Receipt
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedReturnDetails(r)}
                              className="bg-accent/20 hover:bg-accent text-accent hover:text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* 5.5 PAYMENT GATEWAY & WEBHOOK MONITOR */}
      {tab === "gateways" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Operational Status Header */}
          <AdminCard className="p-6 bg-gradient-to-r from-surface-2 via-surface to-surface-2 border border-border-subtle relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="editorial-label text-emerald-400 font-mono tracking-widest text-[11px] uppercase font-bold">
                    Live Webhook Gateway &bull; Active & Listening
                  </span>
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl mt-1.5 flex items-center gap-2">
                  Payment Gateway & Webhook Operations
                </h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                  Real-time event stream capturing payments, instant refunds, chargeback disputes, bank network downtimes, and automated settlements across all Razorpay action events.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-foreground/80 flex items-center gap-1.5">
                    <span className="text-muted-foreground">Endpoint:</span>
                    <code className="text-accent font-semibold">https://scratch-render-sj9n.onrender.com/api/webhooks/razorpay</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("https://scratch-render-sj9n.onrender.com/api/webhooks/razorpay");
                      toast.success("Webhook URL copied to clipboard!");
                    }}
                    className="bg-accent/15 hover:bg-accent text-accent hover:text-white px-2.5 py-1 rounded border border-accent/30 text-[11px] font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy URL
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-center justify-start lg:justify-end">
                <button
                  type="button"
                  onClick={loadGatewayEvents}
                  disabled={loadingRzpEvents}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/5 flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", loadingRzpEvents && "animate-spin")} />
                  Refresh Feed
                </button>

                {/* Simulate Event Dropdown */}
                <div className="relative group">
                  <button
                    type="button"
                    disabled={simulatingEvent}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-accent text-white hover:bg-accent/90 flex items-center gap-1.5 shadow-lg shadow-accent/20 cursor-pointer transition-all"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Simulate Event
                  </button>
                  <div className="absolute right-0 top-full mt-1.5 w-72 bg-surface-2 border border-border-subtle rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2.5 py-1">
                      Trigger Simulated Event
                    </div>
                    {[
                      { label: "Payment Captured (₹4,499)", event: "payment.captured", amount: 4499 },
                      { label: "Payment Failed (OTP Expired)", event: "payment.failed", amount: 2499, error: "OTP_TIMEOUT" },
                      { label: "Payment Dispute Action Required", event: "payment.dispute.action_required", amount: 5999 },
                      { label: "Bank Network Downtime Alert", event: "payment.downtime.started", amount: 0 },
                      { label: "Bank Network Downtime Resolved", event: "payment.downtime.resolved", amount: 0 },
                      { label: "Refund Processed (Instant ₹1,899)", event: "refund.processed", amount: 1899 },
                      { label: "Refund Speed Changed (Normal ➔ Instant)", event: "refund.speed_changed", amount: 1299 },
                      { label: "Merchant Settlement (₹42,850)", event: "settlement.processed", amount: 42850 },
                      { label: "Order Paid & Confirmed", event: "order.paid", amount: 3199 },
                    ].map(sim => (
                      <button
                        key={sim.event + sim.label}
                        type="button"
                        onClick={async () => {
                          setSimulatingEvent(true);
                          toast.info(`Simulating ${sim.event}...`);
                          await insertRazorpayWebhookEvent({
                            event_type: sim.event,
                            amount: sim.amount,
                            status: sim.event.includes("failed") ? "failed" : sim.event.includes("dispute") ? "action_required" : "processed",
                            error_description: sim.error ? "Simulated issuing bank OTP timeout" : undefined,
                            payload_json: { simulated: true, event: sim.event, amount: sim.amount * 100 }
                          });
                          await loadGatewayEvents();
                          setSimulatingEvent(false);
                          toast.success(`Event ${sim.event} received and recorded!`);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{sim.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Active Downtime Notification Banner (if any bank downtime is open) */}
          {activeDowntimes.length > 0 && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                <div>
                  <div className="text-sm font-bold text-amber-300">Bank Gateway Downtime Notification Active</div>
                  <div className="text-xs text-amber-200/80">
                    Razorpay network has reported temporary downtime on partner banking switches (e.g. Netbanking / UPI). Success rates may fluctuate.
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/30 shrink-0">
                Active Alert
              </span>
            </div>
          )}

          {/* 5 KPI Stat Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <AdminCard className="p-4">
              <div className="editorial-label text-muted-foreground flex items-center justify-between">
                <span>Webhook Events</span>
                <Activity className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="font-serif text-3xl mt-2">{rzpEvents.length}</div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Stream Active
              </div>
            </AdminCard>

            <AdminCard className="p-4">
              <div className="editorial-label text-muted-foreground flex items-center justify-between">
                <span>Captured Payments</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="font-serif text-3xl mt-2">
                ₹{capturedPaymentsTotal.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {capturedPaymentsCount} transactions settled
              </div>
            </AdminCard>

            <AdminCard className="p-4">
              <div className="editorial-label text-muted-foreground flex items-center justify-between">
                <span>Processed Refunds</span>
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="font-serif text-3xl mt-2">
                ₹{processedRefundsTotal.toLocaleString()}
              </div>
              <div className="text-[11px] text-purple-400 mt-1 font-mono">
                {processedRefundsCount} refunds completed
              </div>
            </AdminCard>

            <AdminCard className="p-4">
              <div className="editorial-label text-muted-foreground flex items-center justify-between">
                <span>Disputes & Alerts</span>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="font-serif text-3xl mt-2">
                {activeDisputesCount}
              </div>
              <div className="text-[11px] text-rose-400 mt-1 font-mono">
                ₹{activeDisputesTotal.toLocaleString()} in dispute
              </div>
            </AdminCard>

            <AdminCard className="p-4">
              <div className="editorial-label text-muted-foreground flex items-center justify-between">
                <span>Bank Settlements</span>
                <Banknote className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="font-serif text-3xl mt-2">
                ₹{settlementsTotal.toLocaleString()}
              </div>
              <div className="text-[11px] text-sky-400 mt-1 font-mono">
                {settlementsCount} payouts processed
              </div>
            </AdminCard>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-surface border border-border-subtle p-3 rounded-2xl">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              {[
                { id: "ALL", label: "All Events" },
                { id: "PAYMENTS", label: "Payments" },
                { id: "REFUNDS", label: "Refunds" },
                { id: "DISPUTES", label: "Disputes" },
                { id: "DOWNTIMES", label: "Downtimes" },
                { id: "ORDERS", label: "Orders" },
                { id: "SETTLEMENTS", label: "Settlements" },
                { id: "INVOICES", label: "Invoices" },
                { id: "SUBSCRIPTIONS", label: "Subscriptions" },
                { id: "LINKS_ENGAGE", label: "Links & Engage" },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setRzpCategoryFilter(cat.id as EventCategory)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs",
                    rzpCategoryFilter === cat.id
                      ? "bg-accent text-white font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Event, Pay ID, Email..."
                value={rzpSearchQuery}
                onChange={e => setRzpSearchQuery(e.target.value)}
                className="w-full bg-surface-2 border border-border-subtle rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Events Stream Table */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-white/[0.02] text-muted-foreground text-[11px] uppercase tracking-widest font-mono">
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Entity ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs">
                  {filteredRzpEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-30 animate-pulse" />
                        <div>No webhook events found matching the filter criteria.</div>
                        <div className="text-[11px] text-muted-foreground/70 mt-1">
                          Use the "Simulate Event" button above or trigger real events in Razorpay dashboard.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRzpEvents.map(evt => {
                      const isDispute = evt.event_type.includes("dispute");
                      const isDowntime = evt.event_type.includes("downtime");
                      const isRefund = evt.event_type.startsWith("refund.");
                      const isSettlement = evt.event_type.startsWith("settlement.");

                      return (
                        <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                isDispute ? "bg-rose-500" :
                                isDowntime ? "bg-amber-500" :
                                isRefund ? "bg-purple-400" :
                                isSettlement ? "bg-sky-400" :
                                evt.event_type.includes("failed") ? "bg-rose-400" :
                                "bg-emerald-400"
                              )} />
                              <span className="font-mono text-xs font-semibold text-foreground">
                                {evt.event_type}
                              </span>
                            </div>
                            {evt.error_description && (
                              <div className="text-[10px] text-rose-400 truncate max-w-xs mt-0.5">
                                {evt.error_description}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span>{evt.entity_id || evt.event_id || "N/A"}</span>
                              {evt.entity_id && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(evt.entity_id!);
                                    toast.success("Entity ID copied!");
                                  }}
                                  className="text-muted-foreground hover:text-accent p-0.5 cursor-pointer"
                                  title="Copy Entity ID"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-foreground">{evt.customer_email || "System/Merchant"}</div>
                            {evt.customer_contact && (
                              <div className="text-[10px] text-muted-foreground font-mono">{evt.customer_contact}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold">
                            {evt.amount && evt.amount > 0 ? `₹${evt.amount.toLocaleString()}` : "—"}
                          </td>
                          <td className="py-3 px-4">
                            <span className={cn(
                              "text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border",
                              evt.status === "captured" || evt.status === "processed" || evt.status === "paid"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : evt.status === "failed"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : evt.status === "under_review" || evt.status === "action_required"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-white/5 text-muted-foreground border-white/10"
                            )}>
                              {evt.status || "logged"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-[11px] whitespace-nowrap">
                            {formatOrderDateTime(evt.created_at)}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedRzpEvent(evt)}
                              className="bg-accent/15 hover:bg-accent text-accent hover:text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>
      )}

      {/* 6. CUSTOMERS DIRECTORY */}
      {tab === "customers" && (
        <AdminCard className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif text-xl">Customer Directories</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manage registered platform members, profile dossiers, and shipping destinations</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  toast.info("Refreshing customers from Supabase...");
                  await fetchBackendState(true);
                  toast.success("Customers directory up to date!");
                }}
                className="editorial-label bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-full transition-all inline-flex items-center gap-2 text-xs font-bold cursor-pointer"
                title="Sync latest from Supabase"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Live
              </button>
              <button
                onClick={handleExportCustomersExcel}
                className="editorial-label bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full transition-all shadow-md inline-flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export to Excel
              </button>
            </div>
          </div>
          {/* Search, Filter & Sort Controls */}
          <div className="space-y-3 pt-2">
            {/* Search Input Bar */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search customers by name, email, phone, user ID, address, city, state, pincode..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-foreground text-xs focus:outline-none focus:border-accent shadow-sm"
              />
              {customerSearchQuery && (
                <button
                  onClick={() => setCustomerSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Clear Search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter & Sort Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 rounded-xl">
                  <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Sort:</span>
                  <select
                    value={customerSortBy}
                    onChange={(e) => setCustomerSortBy(e.target.value)}
                    className="bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="created-desc" className="bg-background text-foreground">📅 Date Created: Newest First</option>
                    <option value="created-asc" className="bg-background text-foreground">📅 Date Created: Oldest First</option>
                    <option value="name-asc" className="bg-background text-foreground">🔤 Name: A → Z</option>
                    <option value="name-desc" className="bg-background text-foreground">🔤 Name: Z → A</option>
                    <option value="wallet-desc" className="bg-background text-foreground">💰 Wallet: Highest Balance</option>
                    <option value="wallet-asc" className="bg-background text-foreground">💰 Wallet: Lowest Balance</option>
                    <option value="orders-desc" className="bg-background text-foreground">📦 Orders: Most Orders</option>
                    <option value="orders-asc" className="bg-background text-foreground">📦 Orders: Fewest Orders</option>
                    <option value="age-asc" className="bg-background text-foreground">🎂 Age: Youngest First</option>
                    <option value="age-desc" className="bg-background text-foreground">🎂 Age: Oldest First</option>
                  </select>
                </div>

                {/* Gender Filter */}
                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 rounded-xl">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Gender:</span>
                  <select
                    value={customerGenderFilter}
                    onChange={(e) => setCustomerGenderFilter(e.target.value)}
                    className="bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="all" className="bg-background text-foreground">All Genders</option>
                    <option value="Male" className="bg-background text-foreground">Male</option>
                    <option value="Female" className="bg-background text-foreground">Female</option>
                    <option value="Other" className="bg-background text-foreground">Other</option>
                  </select>
                </div>

                {/* Age Filter */}
                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 rounded-xl">
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Age:</span>
                  <select
                    value={customerAgeFilter}
                    onChange={(e) => setCustomerAgeFilter(e.target.value)}
                    className="bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="all" className="bg-background text-foreground">All Ages</option>
                    <option value="under25" className="bg-background text-foreground">Under 25</option>
                    <option value="25-35" className="bg-background text-foreground">25 – 35 yrs</option>
                    <option value="36-50" className="bg-background text-foreground">36 – 50 yrs</option>
                    <option value="above50" className="bg-background text-foreground">50+ yrs</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 rounded-xl">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
                  <select
                    value={customerStatusFilter}
                    onChange={(e) => setCustomerStatusFilter(e.target.value)}
                    className="bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="all" className="bg-background text-foreground">All Status</option>
                    <option value="Active" className="bg-background text-foreground">Active</option>
                    <option value="Suspended" className="bg-background text-foreground">Suspended</option>
                  </select>
                </div>

                {/* Reset Button if active */}
                {(customerSearchQuery || customerGenderFilter !== "all" || customerStatusFilter !== "all" || customerAgeFilter !== "all" || customerSortBy !== "created-desc") && (
                  <button
                    onClick={() => {
                      setCustomerSearchQuery("");
                      setCustomerGenderFilter("all");
                      setCustomerStatusFilter("all");
                      setCustomerAgeFilter("all");
                      setCustomerSortBy("created-desc");
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold flex items-center gap-1 cursor-pointer ml-1"
                  >
                    <Undo className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Count Badge */}
              <div className="text-xs text-muted-foreground font-mono">
                Showing <strong className="text-accent font-bold">{filteredAndSortedCustomers.length}</strong> of {customersList.length} members
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                  <th className="pb-3">User ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Demographics</th>
                  <th className="pb-3">Wallet</th>
                  <th className="pb-3 text-center">Cart & Wishlist</th>
                  <th className="pb-3 text-center">Orders</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {filteredAndSortedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground text-sm space-y-2">
                      <p>
                        {customersList.length === 0
                          ? "No registered user accounts found in the Customers Directory."
                          : "No customers match the active search and filter criteria."}
                      </p>
                      {(customerSearchQuery || customerGenderFilter !== "all" || customerStatusFilter !== "all" || customerAgeFilter !== "all") && (
                        <button
                          onClick={() => {
                            setCustomerSearchQuery("");
                            setCustomerGenderFilter("all");
                            setCustomerStatusFilter("all");
                            setCustomerAgeFilter("all");
                            setCustomerSortBy("created-desc");
                          }}
                          className="editorial-label bg-accent/20 hover:bg-accent/30 text-accent border border-accent/40 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Undo className="w-3 h-3" /> Reset All Filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedCustomers.map(c => {
                    const bal = state.wallets[c.id] ?? c.walletBalance ?? 0;
                    const orderCount = state.orders[c.id]?.length ?? (c as any).orders?.length ?? 0;
                    const cartCount = (c.cart || []).length;
                    const wishCount = (state.shopWishlist[c.id] || (c as any).wishlist || []).length;

                    return (
                      <tr key={c.id} className="hover:bg-surface-2/40 transition-colors">
                        <td className="py-4">
                          <button
                            onClick={() => { setSelectedCustomerDetails(c); setDossierTab("details"); }}
                            className="font-mono text-xs text-accent hover:underline text-left cursor-pointer font-bold block"
                            title="Click to view customer dossier"
                          >
                            {c.id}
                          </button>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent((c.firstName || "") + (c.lastName || ""))}`}
                              alt=""
                              className="w-7 h-7 rounded-full bg-surface border border-white/10 shrink-0 object-cover"
                            />
                            <div>
                              <div className="font-semibold text-foreground">{c.firstName} {c.lastName}</div>
                              <div className="text-[10px] text-muted-foreground">Joined: {c.registeredAt || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-foreground text-xs">{c.email}</div>
                          <div className="text-[11px] text-muted-foreground">{c.phone || "—"}</div>
                        </td>
                        <td className="py-4 text-xs">
                          <div>{c.gender || "—"} {c.age ? `· ${c.age} yrs` : ""}</div>
                          <div className="text-[10px] text-muted-foreground">{c.country || "India"}</div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-accent text-sm">
                              ₹{bal.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setCreditModalCustomer(c);
                                setCreditAmountInput("");
                                setCreditMessageInput("");
                              }}
                              className="p-1 rounded-md hover:bg-accent/20 text-accent transition-colors cursor-pointer"
                              title="Quick Credit Wallet"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center gap-2 text-xs font-mono">
                            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-muted-foreground" title="Cart Items">
                              🛒 {cartCount}
                            </span>
                            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-muted-foreground" title="Wishlist Items">
                              ❤️ {wishCount}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center font-semibold">
                          <span className="bg-accent/10 text-accent px-2.5 py-0.5 rounded-full text-xs font-mono">
                            {orderCount}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <StatusChip status={c.status || "Active"} tone={c.status === "Active" ? "success" : "danger"} />
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCreditModalCustomer(c);
                                setCreditAmountInput("");
                                setCreditMessageInput("");
                              }}
                              className="editorial-label bg-accent/15 hover:bg-accent/30 text-accent border border-accent/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                              title="Credit ReeVibes Wallet"
                            >
                              <IndianRupee className="w-3 h-3" /> Credit
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedCustomerDetails(c); setDossierTab("details"); }}
                              className="editorial-label bg-white/5 hover:bg-white/15 text-foreground/80 hover:text-foreground border border-white/10 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title="View Customer Dossier"
                            >
                              <Eye className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* 7. COUPONS & WALLET+ MANAGER */}
      {tab === "coupons" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sub-tab Switcher Header */}
          <div className="flex border-b border-white/10 gap-6 pb-2">
            <button
              type="button"
              onClick={() => setCouponsSubTab("store-coupons")}
              className={`pb-2 font-serif text-lg font-bold border-b-2 transition-all cursor-pointer ${
                couponsSubTab === "store-coupons"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Store Coupons
            </button>
            <button
              type="button"
              onClick={() => setCouponsSubTab("wallet-gift-cards")}
              className={`pb-2 font-serif text-lg font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                couponsSubTab === "wallet-gift-cards"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Wallet+ Gift Cards</span>
              <span className="bg-accent/20 text-accent text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                {(state.walletGiftCards || []).length}
              </span>
            </button>
          </div>

          {/* Sub-tab 1: Store Promotional Coupons */}
          {couponsSubTab === "store-coupons" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold">Active Store Coupons</h3>
                <button
                  onClick={() => {
                    if (isAddingCoupon) {
                      setIsAddingCoupon(false);
                      setEditingCoupon(null);
                    } else {
                      setEditingCoupon(null);
                      setCouponForm({
                        code: "",
                        discount: 10,
                        type: "percentage",
                        expiryType: "limited",
                        expiryDate: "2026-12-31",
                        userLimitType: "limited",
                        usageLimit: 100,
                        userEligibility: "All",
                        productType: "",
                        brand: ""
                      });
                      setIsAddingCoupon(true);
                    }
                  }}
                  className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2 rounded-full cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Coupon
                </button>
              </div>

              {isAddingCoupon && (
                <AdminCard className="space-y-6 animate-in slide-in-from-top-4 duration-200">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold flex items-center gap-2">
                        {editingCoupon ? (
                          <>
                            <span>Edit Store Coupon:</span>
                            <span className="font-mono text-accent">{editingCoupon.code}</span>
                          </>
                        ) : (
                          "Create Store Coupon Code"
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {editingCoupon
                          ? "Modify discount values, targeting criteria, user limits, or expiry settings"
                          : "Target specific Product Types, Brands, or create Storewide offers"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingCoupon(false);
                        setEditingCoupon(null);
                      }}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCouponSubmit} className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Coupon Code</label>
                      <input required className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none font-mono uppercase focus:border-accent text-foreground rounded-xl" placeholder="DIWALI30" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Discount / Cashback Value</label>
                      <input required type="number" min="1" className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none font-mono focus:border-accent text-foreground rounded-xl" value={couponForm.discount} onChange={e => setCouponForm({...couponForm, discount: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Coupon Type</label>
                      <select className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl" value={couponForm.type} onChange={e => setCouponForm({...couponForm, type: e.target.value as any})}>
                        <option value="percentage">Percentage (%) Discount</option>
                        <option value="fixed">Fixed Amount (₹) Discount</option>
                        <option value="wallet">Wallet+ Cashback (Credited upon delivery)</option>
                      </select>
                    </div>

                    {/* PRODUCT TYPE TARGETING */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground font-semibold">Product Type / Category</label>
                        <span className="text-[10px] text-accent/80 font-mono">Optional</span>
                      </div>
                      <input
                        list="catalog-product-types-list"
                        className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl"
                        placeholder="e.g. Tops, Dresses, Outerwear (leave blank for all)"
                        value={couponForm.productType}
                        onChange={e => setCouponForm({ ...couponForm, productType: e.target.value })}
                      />
                      <datalist id="catalog-product-types-list">
                        {availableProductTypes.map(t => (
                          <option key={t} value={t} />
                        ))}
                      </datalist>
                      <p className="text-[10px] text-muted-foreground">Matches product category or type in catalog.</p>
                    </div>

                    {/* BRAND / HOUSE TARGETING */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground font-semibold">Brand / Fashion House</label>
                        <span className="text-[10px] text-accent/80 font-mono">Optional</span>
                      </div>
                      <input
                        list="catalog-brands-list"
                        className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl"
                        placeholder="e.g. Maison Lumière, Atelier Reine (leave blank for all)"
                        value={couponForm.brand}
                        onChange={e => setCouponForm({ ...couponForm, brand: e.target.value })}
                      />
                      <datalist id="catalog-brands-list">
                        {availableBrands.map(b => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                      <p className="text-[10px] text-muted-foreground">Matches product fashion house or brand in catalog.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">User Eligibility Limit</label>
                      <select className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl" value={couponForm.userLimitType} onChange={e => setCouponForm({...couponForm, userLimitType: e.target.value})}>
                        <option value="unlimited">Unlimited Users</option>
                        <option value="limited">Limited Users</option>
                      </select>
                    </div>
                    {couponForm.userLimitType === "limited" && (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs text-muted-foreground font-semibold">Max User Count</label>
                        <input required type="number" min="1" className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none font-mono focus:border-accent text-foreground rounded-xl" value={couponForm.usageLimit} onChange={e => setCouponForm({...couponForm, usageLimit: Number(e.target.value)})} />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Coupon Expiry Duration</label>
                      <select className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl" value={couponForm.expiryType} onChange={e => setCouponForm({...couponForm, expiryType: e.target.value})}>
                        <option value="unlimited">Unlimited Time (No Expiry)</option>
                        <option value="limited">Limited Time (Expires)</option>
                      </select>
                    </div>
                    {couponForm.expiryType === "limited" && (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs text-muted-foreground font-semibold">Expiry Date</label>
                        <input required type="date" className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl" value={couponForm.expiryDate} onChange={e => setCouponForm({...couponForm, expiryDate: e.target.value})} />
                      </div>
                    )}

                    <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-border-subtle">
                      <AdminButton
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddingCoupon(false);
                          setEditingCoupon(null);
                        }}
                      >
                        Cancel
                      </AdminButton>
                      <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer shadow-md flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        {editingCoupon ? "Save Changes (Sync to Supabase & Backend)" : "Add Coupon (Save to Supabase)"}
                      </button>
                    </div>
                  </form>
                </AdminCard>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {couponsList.map(c => {
                  const today = new Date().toISOString().slice(0, 10);
                  const isExpired = c.expiryDate && c.expiryDate !== "unlimited" && today > c.expiryDate;
                  const isLimitReached = c.usageLimit !== undefined && c.usageLimit !== -1 && c.usageLimit > 0 && (c.usedCount || 0) >= c.usageLimit;
                  const isActive = Boolean(c.active) && !isExpired && !isLimitReached;

                  const hasProductType = Boolean(c.productType && c.productType.trim());
                  const hasBrand = Boolean(c.brand && c.brand.trim());

                  return (
                    <AdminCard key={c.code} className="relative overflow-hidden flex flex-col justify-between min-h-56 p-5 border border-white/10 hover:border-accent/40 transition-colors">
                      <div className="absolute top-0 right-0 w-28 h-28 bg-accent/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
                      
                      <div>
                        {/* Header: Code & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="font-mono text-xl font-bold tracking-widest text-accent flex items-center gap-2">
                              {c.code}
                            </div>
                            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                              {c.type === "wallet" ? "Wallet Cashback" : `${c.type} discount`}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex flex-col items-end gap-1">
                            {isExpired ? (
                              <span className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Expired
                              </span>
                            ) : isLimitReached ? (
                              <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Max Limit
                              </span>
                            ) : c.active ? (
                              <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                              </span>
                            ) : (
                              <span className="bg-zinc-500/20 border border-zinc-500/30 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Paused
                              </span>
                            )}
                            <span className="text-[9px] text-muted-foreground/70 font-mono">Cloud Synced</span>
                          </div>
                        </div>

                        {/* Targeting Scope Chips */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {hasProductType && (
                            <span className="bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>Type:</span> <span className="text-white font-bold">{c.productType}</span>
                            </span>
                          )}
                          {hasBrand && (
                            <span className="bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>Brand:</span> <span className="text-white font-bold">{c.brand}</span>
                            </span>
                          )}
                          {!hasProductType && !hasBrand && (
                            <span className="bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              🌐 Storewide (All Products)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Details & Claims */}
                      <div className="text-xs space-y-1.5 my-3 text-muted-foreground border-y border-white/5 py-2.5">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground/80">Expiry:</span>
                          <span>{c.expiryDate === "unlimited" || !c.expiryDate ? "Unlimited (No Expiry)" : c.expiryDate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground/80">Claims:</span>
                          <span>{c.usageLimit === -1 || !c.usageLimit ? `${c.usedCount || 0} / Unlimited` : `${c.usedCount || 0} / ${c.usageLimit} users`}</span>
                        </div>
                      </div>

                      {/* Footer: Value & Actions */}
                      <div className="flex justify-between items-end pt-1">
                        <div>
                          <div className="font-serif text-2xl font-bold text-foreground">
                            {c.type === "percentage" ? `${c.discount}% OFF` : c.type === "wallet" ? `₹${c.discount.toLocaleString()} Cashback` : `₹${c.discount.toLocaleString()} OFF`}
                          </div>
                          {c.type === "wallet" && (
                            <div className="text-[10px] text-emerald-400 font-medium">Credited to wallet upon delivery</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCoupon(c);
                              setCouponForm({
                                code: c.code,
                                discount: c.discount,
                                type: c.type,
                                expiryType: c.expiryDate === "unlimited" || !c.expiryDate ? "unlimited" : "limited",
                                expiryDate: c.expiryDate && c.expiryDate !== "unlimited" ? c.expiryDate : "2026-12-31",
                                userLimitType: c.usageLimit === -1 || !c.usageLimit ? "unlimited" : "limited",
                                usageLimit: c.usageLimit && c.usageLimit > 0 ? c.usageLimit : 100,
                                userEligibility: c.userEligibility || "All",
                                productType: c.productType || "",
                                brand: c.brand || ""
                              });
                              setIsAddingCoupon(true);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="text-xs text-accent hover:text-accent/80 uppercase font-semibold cursor-pointer flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-md border border-accent/30 hover:bg-accent/20 transition-colors"
                            title="Edit coupon"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCouponActive(c.code)}
                            className={`text-xs uppercase font-semibold cursor-pointer transition-colors px-2 py-1 rounded-md border ${
                              c.active ? "text-amber-400 border-amber-500/30 hover:bg-amber-500/10" : "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                            }`}
                            title={c.active ? "Pause coupon" : "Activate coupon"}
                          >
                            {c.active ? "Pause" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCoupon(c.code)}
                            className="text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:bg-rose-500/10 uppercase font-semibold cursor-pointer px-2 py-1 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </AdminCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-tab 2: Wallet+ Gift Cards Manager */}
          {couponsSubTab === "wallet-gift-cards" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold">Wallet+ Gift Cards Manager</h3>
                  <p className="text-xs text-muted-foreground">Create and manage digital wallet gift cards for customer redemption</p>
                </div>
                <button
                  onClick={() => {
                    setEditingGiftCard(null);
                    setGiftCardForm({
                      code: "",
                      amount: 500,
                      usageType: "unlimited",
                      usageLimit: 100,
                      validityType: "unlimited",
                      expiryDate: "2026-12-31",
                      status: "Active"
                    });
                    setIsAddingGiftCard(!isAddingGiftCard);
                  }}
                  className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2 rounded-full cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create Wallet Gift Card
                </button>
              </div>

              {/* Gift Card Create / Edit Form */}
              {isAddingGiftCard && (
                <AdminCard className="space-y-6 animate-in slide-in-from-top-4 duration-200">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h4 className="font-serif text-lg font-bold">{editingGiftCard ? "Edit Wallet Gift Card" : "Create Wallet Gift Card"}</h4>
                    <button onClick={() => setIsAddingGiftCard(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleGiftCardSubmit} className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Gift Card Code</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. GIFT20, WELCOME500, BONUS100"
                        className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none font-mono uppercase focus:border-accent text-foreground rounded-xl"
                        value={giftCardForm.code}
                        onChange={e => setGiftCardForm({ ...giftCardForm, code: e.target.value.toUpperCase() })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Wallet Credit Amount (₹)</label>
                      <input
                        required
                        type="number"
                        min="1"
                        placeholder="e.g. 500"
                        className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none font-mono focus:border-accent text-foreground rounded-xl"
                        value={giftCardForm.amount}
                        onChange={e => setGiftCardForm({ ...giftCardForm, amount: Number(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Status</label>
                      <select
                        className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl"
                        value={giftCardForm.status}
                        onChange={e => setGiftCardForm({ ...giftCardForm, status: e.target.value as any })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Usage Limit Type</label>
                      <select
                        className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl"
                        value={giftCardForm.usageType}
                        onChange={e => setGiftCardForm({ ...giftCardForm, usageType: e.target.value as any })}
                      >
                        <option value="unlimited">Unlimited Uses</option>
                        <option value="custom">Custom Usage Limit</option>
                      </select>
                    </div>

                    {giftCardForm.usageType === "custom" && (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs text-muted-foreground font-semibold">Maximum Redemptions</label>
                        <input
                          required
                          type="number"
                          min="1"
                          placeholder="e.g. 100 users"
                          className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none font-mono focus:border-accent text-foreground rounded-xl"
                          value={giftCardForm.usageLimit}
                          onChange={e => setGiftCardForm({ ...giftCardForm, usageLimit: Number(e.target.value) })}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold">Validity Period</label>
                      <select
                        className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl"
                        value={giftCardForm.validityType}
                        onChange={e => setGiftCardForm({ ...giftCardForm, validityType: e.target.value as any })}
                      >
                        <option value="unlimited">Unlimited Validity (No Expiry)</option>
                        <option value="custom">Custom Expiration Date</option>
                      </select>
                    </div>

                    {giftCardForm.validityType === "custom" && (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs text-muted-foreground font-semibold">Expiration Date</label>
                        <input
                          required
                          type="date"
                          className="w-full bg-surface border border-border-subtle p-2.5 text-sm outline-none text-foreground focus:border-accent rounded-xl"
                          value={giftCardForm.expiryDate}
                          onChange={e => setGiftCardForm({ ...giftCardForm, expiryDate: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-border-subtle">
                      <AdminButton type="button" variant="outline" onClick={() => setIsAddingGiftCard(false)}>Cancel</AdminButton>
                      <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer">
                        {editingGiftCard ? "Update Gift Card" : "Create Gift Card"}
                      </button>
                    </div>
                  </form>
                </AdminCard>
              )}

              {/* Gift Cards Table */}
              <AdminCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-border-subtle text-[10px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-4">Gift Card Code</th>
                        <th className="p-4">Credit Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Usage Type</th>
                        <th className="p-4">Redemptions</th>
                        <th className="p-4">Validity / Expiration</th>
                        <th className="p-4">Created Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {(state.walletGiftCards || []).map((card) => {
                        const today = new Date().toISOString().split("T")[0];
                        const isExpired = card.validityType === "custom" && card.expiryDate && card.expiryDate < today;
                        const isFullyRedeemed = card.usageType === "custom" && card.usageLimit !== undefined && card.usedCount >= card.usageLimit;
                        const displayStatus = isExpired ? "Expired" : isFullyRedeemed ? "Fully Redeemed" : card.status;

                        return (
                          <tr key={card.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono font-bold text-accent text-sm">{card.code}</td>
                            <td className="p-4 font-mono font-bold text-foreground">₹{card.amount.toLocaleString()}</td>
                            <td className="p-4">
                              <StatusChip
                                status={displayStatus}
                                tone={displayStatus === "Active" ? "success" : displayStatus === "Expired" ? "warn" : displayStatus === "Fully Redeemed" ? "danger" : "neutral"}
                              />
                            </td>
                            <td className="p-4 capitalize">{card.usageType}</td>
                            <td className="p-4 font-mono">
                              {card.usageType === "custom" ? `${card.usedCount} / ${card.usageLimit}` : `${card.usedCount} / Unlimited`}
                            </td>
                            <td className="p-4">
                              {card.validityType === "custom" ? card.expiryDate || "Specified" : "Unlimited"}
                            </td>
                            <td className="p-4 font-mono text-muted-foreground">{card.createdAt}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleWalletGiftCardStatus(card.id)}
                                  className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                                    card.status === "Active"
                                      ? "border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                                      : "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                  }`}
                                >
                                  {card.status === "Active" ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingGiftCard(card);
                                    setGiftCardForm({
                                      code: card.code,
                                      amount: card.amount,
                                      usageType: card.usageType,
                                      usageLimit: card.usageLimit || 100,
                                      validityType: card.validityType,
                                      expiryDate: card.expiryDate || "2026-12-31",
                                      status: card.status === "Expired" || card.status === "Fully Redeemed" ? "Active" : card.status
                                    });
                                    setIsAddingGiftCard(true);
                                  }}
                                  className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-accent/30 text-accent hover:bg-accent/10 cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerModal("danger", "Delete Wallet Gift Card", `Are you sure you want to delete gift card "${card.code}"? This action cannot be undone.`, () => {
                                      deleteWalletGiftCard(card.id);
                                      toast.success(`Gift card ${card.code} deleted.`);
                                    });
                                  }}
                                  className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </AdminCard>
            </div>
          )}
        </div>
      )}

      {/* 8. REVIEWS MODERATION */}
      {tab === "reviews" && (() => {
        const allReviews = Object.entries(state.productReviews || {}).flatMap(([productId, list]) =>
          (list || []).map(r => ({ ...r, productId: r.productId || productId }))
        );

        const approvedCount = allReviews.filter(r => r.status === "Approved").length;
        const hiddenCount = allReviews.filter(r => r.status === "Hidden").length;
        const avgRating = allReviews.length > 0
          ? (allReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / allReviews.length).toFixed(1)
          : "5.0";

        const filtered = allReviews.filter(r => {
          if (reviewsFilter === "approved" && r.status !== "Approved") return false;
          if (reviewsFilter === "hidden" && r.status === "Approved") return false;
          if (reviewsSearch.trim()) {
            const q = reviewsSearch.toLowerCase().trim();
            const p = state.products.find(prod => prod.id === r.productId);
            const pName = (r.productName || p?.name || "").toLowerCase();
            const pId = (r.productId || "").toLowerCase();
            const uName = (r.userName || "").toLowerCase();
            const uEmail = (r.userEmail || "").toLowerCase();
            const uId = (r.userId || "").toLowerCase();
            const oId = (r.orderId || "").toLowerCase();
            const comm = (r.comment || "").toLowerCase();
            return pName.includes(q) || pId.includes(q) || uName.includes(q) || uEmail.includes(q) || uId.includes(q) || oId.includes(q) || comm.includes(q);
          }
          return true;
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminCard className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Total Verified Reviews</span>
                  <div className="text-2xl font-serif font-bold mt-1 text-foreground">{allReviews.length}</div>
                  <span className="text-[11px] text-muted-foreground">Direct from Supabase database</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <Star className="w-6 h-6 fill-current" />
                </div>
              </AdminCard>

              <AdminCard className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 block">Live On Storefront</span>
                  <div className="text-2xl font-serif font-bold mt-1 text-emerald-500">{approvedCount}</div>
                  <span className="text-[11px] text-muted-foreground">Visible to all shoppers</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <Eye className="w-6 h-6" />
                </div>
              </AdminCard>

              <AdminCard className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 block">Hidden / Moderated</span>
                  <div className="text-2xl font-serif font-bold mt-1 text-rose-500">{hiddenCount}</div>
                  <span className="text-[11px] text-muted-foreground">Hidden by Admin</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500">
                  <EyeOff className="w-6 h-6" />
                </div>
              </AdminCard>

              <AdminCard className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block">Average Rating</span>
                  <div className="text-2xl font-serif font-bold mt-1 text-amber-500 flex items-center gap-1.5">
                    <span>{avgRating}</span>
                    <Star className="w-5 h-5 fill-current text-amber-400" />
                  </div>
                  <span className="text-[11px] text-muted-foreground">Across verified orders</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </AdminCard>
            </div>

            {/* Filter Bar & Search */}
            <AdminCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by customer, product, order ID, or user ID..."
                    value={reviewsSearch}
                    onChange={e => setReviewsSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-accent text-foreground"
                  />
                  {reviewsSearch && (
                    <button onClick={() => setReviewsSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setReviewsFilter("all")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    reviewsFilter === "all" ? "bg-accent text-white border-accent shadow-sm" : "border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({allReviews.length})
                </button>
                <button
                  onClick={() => setReviewsFilter("approved")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    reviewsFilter === "approved" ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Live ({approvedCount})
                </button>
                <button
                  onClick={() => setReviewsFilter("hidden")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    reviewsFilter === "hidden" ? "bg-rose-600 text-white border-rose-600 shadow-sm" : "border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Hidden ({hiddenCount})
                </button>
              </div>
            </AdminCard>

            {/* Reviews Cards List */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <AdminCard className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto text-accent">
                    <Star className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold text-foreground">No Reviews Found</h4>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                      {allReviews.length === 0
                        ? "The reviews database is currently clean. As verified buyers order products and leave feedback, their ratings and reviews will appear here with full customer dossier and product linkage."
                        : "No reviews match your current search and filter criteria."}
                    </p>
                  </div>
                </AdminCard>
              ) : (
                filtered.map(r => {
                  const product = state.products.find(p => p.id === r.productId) || {
                    id: r.productId,
                    name: r.productName || "Luxury Apparel",
                    price: "₹99,000",
                    image: r.productImage || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
                    category: "Curation"
                  };
                  const prodImage = r.productImage || product.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80";
                  const prodName = r.productName || product.name || "Luxury Apparel";

                  const handleOpenCustomerDossier = () => {
                    const cust = state.users.find(u =>
                      (r.userId && u.id === r.userId) ||
                      (r.userEmail && u.email && u.email.toLowerCase() === r.userEmail.toLowerCase())
                    );

                    if (cust) {
                      setSelectedCustomerDetails(cust);
                    } else {
                      setSelectedCustomerDetails({
                        id: r.userId || "USR-CUSTOMER",
                        firstName: r.userName || "Verified Customer",
                        lastName: "",
                        email: r.userEmail || "",
                        phone: "",
                        country: "India",
                        status: "Active",
                        walletBalance: 0,
                        wishlist: [],
                        cart: [],
                        orders: []
                      });
                    }
                    setDossierTab("details");
                  };

                  return (
                    <AdminCard key={r.id} className="p-5 space-y-4 hover:border-accent/40 transition-colors">
                      <div className="flex flex-col lg:flex-row gap-5 items-start justify-between">
                        
                        {/* 1. Product Link & Preview Card */}
                        <div className="flex items-center gap-3.5 sm:min-w-[280px] max-w-sm shrink-0 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                          <img
                            src={prodImage}
                            alt={prodName}
                            className="w-16 h-20 object-cover rounded-xl border border-black/10 dark:border-white/10 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedProductPreview(product)}
                          />
                          <div className="min-w-0 space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-accent font-bold block">Reviewed Product</span>
                            <button
                              type="button"
                              onClick={() => setSelectedProductPreview(product)}
                              className="font-serif font-bold text-sm text-foreground hover:text-accent transition-colors truncate block text-left cursor-pointer"
                              title={prodName}
                            >
                              {prodName}
                            </button>
                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                              <span>Code: <strong className="text-foreground">{r.productId}</strong></span>
                              {product.price && <span>• <strong className="text-accent">{product.price}</strong></span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedProductPreview(product)}
                              className="text-[10px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                            >
                              <span>View Product Details</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* 2. Review Content & User Information */}
                        <div className="flex-1 min-w-0 space-y-2.5">
                          {/* User Header with Clickable User ID Badge */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            {/* Clickable User ID badge opening Customer Curation Dossier */}
                            <button
                              type="button"
                              onClick={handleOpenCustomerDossier}
                              className="px-2.5 py-1 rounded-full bg-accent/15 hover:bg-accent hover:text-white border border-accent/40 text-accent font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm group"
                              title="Click to inspect customer profile, orders, wallet, and cart in Customer Curation Dossier"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>{r.userId || "USR-CUSTOMER"}</span>
                              <span className="text-[9px] opacity-75 group-hover:opacity-100">↗</span>
                            </button>

                            <span className="font-serif font-bold text-sm text-foreground">{r.userName}</span>
                            
                            {r.userEmail && (
                              <span className="text-xs text-muted-foreground font-mono">({r.userEmail})</span>
                            )}

                            {r.orderId && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Verified Order #{r.orderId}</span>
                              </span>
                            )}

                            <span className="text-[11px] text-muted-foreground font-mono ml-auto">
                              {r.date}
                            </span>
                          </div>

                          {/* Star Rating Display */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 fill-current ${i < (r.rating || 5) ? "text-amber-400" : "text-zinc-600 fill-transparent"}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-foreground">{r.rating || 5}.0 / 5</span>
                          </div>

                          {/* Review Comment Quote Box */}
                          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                            <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                              "{r.comment}"
                            </p>
                          </div>

                          {/* Media attachments */}
                          {((r.images && r.images.length > 0) || (r.videos && r.videos.length > 0)) && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {(r.images || []).map((img, i) => (
                                <img key={i} src={img} alt="review attachment" className="w-14 h-14 object-cover rounded-xl border border-black/10 dark:border-white/10" />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 3. Moderation Status & Action Controls */}
                        <div className="flex flex-row lg:flex-col items-end lg:items-end justify-between w-full lg:w-auto gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-black/10 dark:border-white/10">
                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            {r.status === "Approved" ? (
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5" />
                                <span>Live on Store</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-500/15 border border-zinc-500/30 text-zinc-400 flex items-center gap-1.5">
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Hidden</span>
                              </span>
                            )}
                          </div>

                          {/* Admin Action Buttons */}
                          <div className="flex items-center gap-2">
                            {r.status === "Approved" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  moderateReview(r.productId, r.id, "hide");
                                  toast.info(`Review by ${r.userName} hidden from storefront.`);
                                }}
                                className="text-[11px] uppercase font-bold border border-rose-500/30 hover:border-rose-500 bg-rose-500/10 text-rose-400 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Hide Review</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  moderateReview(r.productId, r.id, "approve");
                                  toast.success(`Review by ${r.userName} published to storefront!`);
                                }}
                                className="text-[11px] uppercase font-bold border border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/10 text-emerald-400 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Show Review</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setModal({
                                  type: "danger",
                                  title: "Delete Review Permanently",
                                  desc: `Are you sure you want to delete this review by ${r.userName}? This will permanently remove it from the Supabase database.`,
                                  action: () => {
                                    deleteReview(r.productId, r.id);
                                    toast.success("Review deleted successfully.");
                                  }
                                });
                              }}
                              className="text-[11px] uppercase font-bold border border-rose-500/20 hover:border-rose-500 text-rose-500 hover:bg-rose-500/10 p-2 rounded-xl transition-colors cursor-pointer"
                              title="Delete review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </AdminCard>
                  );
                })
              )}
            </div>
          </div>
        );
      })()}


    </div>
  );
}
