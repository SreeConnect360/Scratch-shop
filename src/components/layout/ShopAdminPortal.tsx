import { useState, useEffect, useMemo } from "react";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { Link } from "@tanstack/react-router";
import {
  ShoppingBag, Truck, RefreshCw, Users, Ticket, Star, Store, BarChart3,
  Sparkles, LayoutGrid, Plus, Edit2, Trash2, Check, X, ShieldAlert,
  ArrowUpRight, IndianRupee, Search, Shield, Eye, EyeOff, PlusCircle,
  Settings, History, ListFilter, Tag, BarChart2, Undo, CheckSquare,
  Square, ArrowUpDown, Layers3, Download, Upload, ArrowLeft, ArrowRight,
  FileSpreadsheet
} from "lucide-react";
import * as XLSX from "xlsx";
import { AdminCard, AdminButton, StatusChip } from "./AdminCommon";
import { PRODUCTS } from "@/lib/data";
import { LiveCountdown } from "@/routes/_shop";
import * as vendorApi from "@/lib/vendor-api";
import { toast } from "sonner";
import VendorDashboard from "./VendorDashboard";
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
  const [filterMonth, setFilterMonth] = useState<string>("--");
  const [filterYear, setFilterYear] = useState<string>("--");
  const { state, createProduct, updateProduct, deleteProduct, updateOrderStatus, approveReturn, rejectReturn, updateReturnDetails, suspendCustomer, reactivateCustomer, addCoupon, removeCoupon, moderateReview, createVendor, deleteVendor, addWalletCredit, updateHomepageLayoutDraft, publishHomepageLayout, revertHomepageLayout, createBucket, updateBucket, deleteBucket, reorderBuckets } = usePortal();

  // Dynamic products list from state
  const productsList = state.products || [];
  const ordersList = Object.entries(state.orders).flatMap(([userId, list]) =>
    list.map(o => ({ ...o, userId, customerName: state.users.find(u => u.id === userId)?.firstName + " " + (state.users.find(u => u.id === userId)?.lastName || "") }))
  );
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

    // Month & Year filtering
    const isMonthUnselected = filterMonth === "--";
    const isYearUnselected = filterYear === "--";

    if (!isMonthUnselected) {
      const targetMonth = parseInt(filterMonth, 10);
      list = list.filter(o => {
        const d = new Date(o.date);
        return !isNaN(d.getTime()) && d.getMonth() === targetMonth;
      });
    }
    if (!isYearUnselected) {
      const targetYear = parseInt(filterYear, 10);
      list = list.filter(o => {
        const d = new Date(o.date);
        return !isNaN(d.getTime()) && d.getFullYear() === targetYear;
      });
    }

    return list;
  }, [ordersList, filterMonth, filterYear]);
  const returnsList = state.returns || [];
  const customersList = state.users || [];
  const couponsList = state.coupons || [];
  const vendorsList = state.vendors || [];

  // Local UI States
  const [catalogTab, setCatalogTab] = useState<"all" | "published" | "unpublished">("all");
  const [catalogSection, setCatalogSection] = useState<"main" | "vendors">("main");
  const [selectedCatalogVendor, setSelectedCatalogVendor] = useState<string>("blankapparel");
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

  useEffect(() => {
    if (selectedOrderDetails) {
      setEditStatus(selectedOrderDetails.status || "Processing");
      setEditPaymentStatus(selectedOrderDetails.paymentStatus || "Paid");
      setEditTrackingNum(selectedOrderDetails.trackingNumber || "");
      setEditCourier(selectedOrderDetails.courierPartner || "");
      setEditEstDelivery(selectedOrderDetails.estimatedDeliveryDate || "");
    }
  }, [selectedOrderDetails]);

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
    isFeatured: false, isNewArrival: false, isTrending: false, isRecommended: false, productInfo: ""
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
    userEligibility: "All"
  });
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);

  const [vendorForm, setVendorForm] = useState({
    companyName: "", contactPerson: "", email: "", phone: ""
  });
  const [isAddingVendor, setIsAddingVendor] = useState(false);

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

  useEffect(() => {
    if (vendorsList.length > 0 && (!selectedCatalogVendor || !vendorsList.some(v => v.id === selectedCatalogVendor))) {
      setSelectedCatalogVendor(vendorsList[0].id);
    }
  }, [vendorsList, selectedCatalogVendor]);

  // Homepage Builder States
  const [draftLayout, setDraftLayout] = useState<any>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("announcement");
  const [expandedSlideIndexMap, setExpandedSlideIndexMap] = useState<Record<string, number>>({});
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Bucket Dashboard States
  const [editingBucket, setEditingBucket] = useState<any | null>(null);
  const [isAddingBucket, setIsAddingBucket] = useState(false);
  const [bucketForm, setBucketForm] = useState<{ name: string; productIds: string[]; starProductId?: string }>({
    name: "",
    productIds: [],
    starProductId: ""
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

  useEffect(() => {
    if (state && state.homepageLayoutDraft && !draftLayout) {
      const layoutCopy = { ...state.homepageLayoutDraft };
      if (!layoutCopy.assistant) {
        layoutCopy.assistant = { enabled: true };
      }
      if (!layoutCopy.chatbot) {
        layoutCopy.chatbot = { enabled: true };
      }
      setDraftLayout(layoutCopy);
    }
  }, [state, draftLayout]);

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
    const productDraft = {
      id: p.id,
      name: p.name,
      house: p.house || p.brand || "",
      price: p.price,
      image: p.image,
      tag: p.tag || "",
      tags: p.tags || tagList,
      gender: p.gender || "Women",
      category: p.category || "Tops",
      categoriesList: p.categoriesList || (p.category ? [p.category] : []),
      sizes: p.sizes || ["S", "M", "L"],
      stockPerSize: p.stockPerSize || { S: 10, M: 10, L: 10 },
      sku: p.sku || `SKU-${Math.floor(10000 + Math.random()*90000)}`,
      originalPrice: p.originalPrice || p.price,
      description: p.description || "",
      material: p.material || "",
      color: p.color || "",
      images: p.images || [],
      discountLimitBuyers: p.discountLimitBuyers,
      discountExpiryDate: p.discountExpiryDate || "",
      discountBuyersCount: p.discountBuyersCount || 0,
      type: p.type || "",
      fabric: p.fabric || "",
      collections: p.collections || "",
      visibility: p.visibility || "VISIBLE",
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      seoKeywords: p.seoKeywords || "",
      isFeatured: p.isFeatured || false,
      isNewArrival: p.isNewArrival || false,
      isTrending: p.isTrending || false,
      isRecommended: p.isRecommended || false,
      productInfo: p.productInfo || ""
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
    
    addCoupon({
      code: couponForm.code,
      discount: couponForm.discount,
      type: couponForm.type as "fixed" | "percentage",
      expiryDate: finalExpiryDate,
      usageLimit: finalUsageLimit,
      userEligibility: couponForm.userEligibility
    });
    setIsAddingCoupon(false);
    setCouponForm({
      code: "",
      discount: 10,
      type: "percentage",
      expiryType: "limited",
      expiryDate: "2026-12-31",
      userLimitType: "limited",
      usageLimit: 100,
      userEligibility: "All"
    });
    triggerModal("success", "Coupon Created", "New coupon successfully generated and active.", () => {});
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVendor(vendorForm);
    setIsAddingVendor(false);
    setVendorForm({ companyName: "", contactPerson: "", email: "", phone: "" });
    triggerModal("success", "Vendor Registered", "New vendor added to the portal.", () => {});
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
      if (editingProduct) {
        updateProduct(editingProduct.id, finalForm);
      } else {
        createProduct(finalForm);
      }
    });
    setIsReviewingImports(false);
    setImportedProducts([]);
    if (editingProduct) {
      triggerModal("success", "Product Updated", "The product has been successfully updated in the catalog.", () => {});
      setEditingProduct(null);
    } else if (isManualCreate) {
      const msg = publishLive
        ? `Successfully created and published ${importedProducts.length} new products to the catalog.`
        : `Successfully created ${importedProducts.length} new draft products (unpublished) in the catalog.`;
      triggerModal("success", "Products Created", msg, () => {});
      setIsManualCreate(false);
    } else {
      const msg = publishLive
        ? `Successfully imported and published ${importedProducts.length} products to the catalog.`
        : `Successfully imported ${importedProducts.length} draft products (unpublished) to the catalog.`;
      triggerModal("success", "Products Imported", msg, () => {});
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
                    <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Wallet:</span><span className="col-span-2 font-semibold text-accent">₹{(state.wallets[selectedCustomerDetails.id] ?? 0).toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Saved Shipping Destinations</h4>
                  {(state.addresses[selectedCustomerDetails.id] ?? []).length === 0 ? (
                    <p className="text-muted-foreground italic">No addresses saved.</p>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {(state.addresses[selectedCustomerDetails.id] ?? []).map((addr: string, i: number) => (
                        <li key={i}>{addr}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {dossierTab === "wishlist" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] pb-2 border-b border-white/10">Active Wishlist Items</h4>
                {(state.shopWishlist[selectedCustomerDetails.id] ?? []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No items saved in wishlist.</p>
                ) : (
                  <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">
                    {(state.shopWishlist[selectedCustomerDetails.id] ?? []).map(productId => {
                      const p = state.products.find(x => x.id === productId);
                      const inStock = p ? true : false;
                      return (
                        <div key={productId} className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={p?.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop"} alt={p?.name} className="w-10 h-10 object-cover bg-white/5 rounded" />
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
                )}
              </div>
            )}

            {dossierTab === "cart" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] pb-2 border-b border-white/10">Current Shopping Cart</h4>
                {(selectedCustomerDetails.cart || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Shopping cart is empty.</p>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {(selectedCustomerDetails.cart || []).map((item: any, i: number) => {
                      const itemPrice = Number(String(item.price).replace(/[^0-9.]/g, "")) || 0;
                      const totalAmount = itemPrice * item.qty;
                      return (
                        <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop"} alt={item.name} className="w-10 h-10 object-cover bg-white/5 rounded" />
                            <div>
                              <div className="font-semibold text-white">{item.name}</div>
                              <div className="text-[10px] text-muted-foreground">
                                Size: {item.selectedSize || "M"} · House: {item.house || "Maison"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-muted-foreground">Qty: {item.qty}</span>
                            <span className="font-serif text-muted-foreground">{item.price}</span>
                            <span className="font-serif font-bold text-accent">₹{totalAmount.toLocaleString()}</span>
                            <Link to="/product/$productId" params={{ productId: item.productId }} className="text-[10px] uppercase font-bold text-accent border border-accent/30 hover:border-accent px-3 py-1 rounded-full">
                              View Product
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {dossierTab === "orders" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] pb-2 border-b border-white/10">Ordered Items Curation</h4>
                {(state.orders[selectedCustomerDetails.id] ?? []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No orders placed yet.</p>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2 divide-y divide-white/5">
                    {(state.orders[selectedCustomerDetails.id] ?? []).map((ord: any) => (
                      <div key={ord.id} className="pt-3 first:pt-0 space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <div>
                            <span className="font-bold font-mono text-white">{ord.id}</span>
                            <span className="text-[10px] text-muted-foreground ml-3">{formatOrderDateTime(ord.date)}</span>
                          </div>
                          <div className="flex gap-2">
                            <StatusChip status={ord.status} tone={ord.status === "Delivered" ? "success" : ord.status === "Processing" ? "warn" : "accent"} />
                            <StatusChip status={ord.paymentStatus} tone={ord.paymentStatus === "Paid" ? "success" : "warn"} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          {ord.items.map((item: any, idx: number) => {
                            const priceVal = Number(String(item.price).replace(/[^0-9.]/g, "")) || 0;
                            return (
                              <div key={idx} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded bg-white/5" />
                                  <div>
                                    <div className="font-medium text-white">{item.name}</div>
                                    <div className="text-[10px] text-muted-foreground">Size: {item.selectedSize || "—"} · Qty: {item.qty}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-serif font-bold text-accent">₹{(priceVal * item.qty).toLocaleString()}</span>
                                  <Link to="/product/$productId" params={{ productId: item.productId }} className="text-[9px] uppercase font-bold text-accent/80 hover:text-accent">
                                    View
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-[10px] text-muted-foreground bg-white/5 p-2 rounded">
                          <div><span className="font-semibold text-white">Shipping Address:</span> {ord.address}</div>
                          <div className="mt-1"><span className="font-semibold text-white">Tracking Details:</span> TRK-{ord.id.replace("ORD-", "")} (Delhivery Express)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/10">
              <AdminButton variant="outline" onClick={() => setSelectedCustomerDetails(null)}>Close dossier</AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Selected Order Details Modal */}
      {selectedOrderDetails && (
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

            <div className="space-y-4 text-xs leading-relaxed">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] mb-2">Order Core Specs</h4>
                  <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">ID:</span><span className="col-span-2 font-mono font-bold text-accent">{selectedOrderDetails.id}</span></div>
                  <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Date/Time:</span><span className="col-span-2">{formatOrderDateTime(selectedOrderDetails.date)}</span></div>
                  <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Address:</span><span className="col-span-2 leading-normal">{selectedOrderDetails.address}</span></div>
                  <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground font-semibold">Total Amount:</span><span className="col-span-2 font-serif font-bold text-accent">₹{selectedOrderDetails.total.toLocaleString()}</span></div>
                </div>
                
                <div>
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px] mb-2">Razorpay Gateway Info</h4>
                  {selectedOrderDetails.razorpayPaymentId ? (
                    <>
                      <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Payment ID:</span><span className="col-span-2 font-mono text-white break-all">{selectedOrderDetails.razorpayPaymentId}</span></div>
                      <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Order ID:</span><span className="col-span-2 font-mono text-white break-all">{selectedOrderDetails.razorpayOrderId}</span></div>
                      <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Method:</span><span className="col-span-2 text-white">{selectedOrderDetails.paymentMethod}</span></div>
                      <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Currency:</span><span className="col-span-2 text-white font-mono">{selectedOrderDetails.currency}</span></div>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">No Razorpay payment metadata present (Local Wallet Pay / Custom).</p>
                  )}
                </div>
              </div>

              {/* Order Status & Delivery Management form */}
              <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-4">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Curation Shipment Management</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Order Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Preparing Order">Preparing Order</option>
                      <option value="Packed">Packed</option>
                      <option value="Ready for Dispatch">Ready for Dispatch</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivering Today">Delivering Today</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Payment Status</label>
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
                    <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tracking ID</label>
                    <input
                      type="text"
                      value={editTrackingNum}
                      onChange={e => setEditTrackingNum(e.target.value)}
                      placeholder="e.g. TRK-98319"
                      className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Courier Partner</label>
                    <input
                      type="text"
                      value={editCourier}
                      onChange={e => setEditCourier(e.target.value)}
                      placeholder="e.g. Delhivery Express"
                      className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Est. Delivery Date</label>
                    <input
                      type="text"
                      value={editEstDelivery}
                      onChange={e => setEditEstDelivery(e.target.value)}
                      placeholder="e.g. July 20, 2026"
                      className="w-full bg-surface border border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <AdminButton
                    variant="accent"
                    onClick={() => {
                      updateOrderStatus(selectedOrderDetails.userId, selectedOrderDetails.id, editStatus, {
                        paymentStatus: editPaymentStatus,
                        trackingNumber: editTrackingNum || null,
                        courierPartner: editCourier || null,
                        estimatedDeliveryDate: editEstDelivery || null
                      });
                      toast.success("Order status and shipment details successfully updated.");
                      setSelectedOrderDetails(null);
                    }}
                  >
                    Save Curation Details
                  </AdminButton>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Items of the Delivery</h4>
                <div className="space-y-2 border border-white/10 rounded-2xl p-3 bg-white/5 max-h-40 overflow-y-auto">
                  {selectedOrderDetails.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center gap-3 py-1 first:pt-0 border-t border-white/5 first:border-0">
                      <div className="flex items-center gap-2">
                        <img src={item.image} className="w-8 h-10 object-cover rounded-md border border-white/5" />
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-[10px] text-muted-foreground">{item.house} · Size: {item.selectedSize || "M"}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div>{item.price}</div>
                        <div className="text-[10px] text-muted-foreground">Qty: {item.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <AdminButton variant="outline" onClick={() => setSelectedOrderDetails(null)}>Close dossier</AdminButton>
            </div>
          </div>
        </div>
      )}

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
                      <span className="text-muted-foreground">Refund Method:</span>
                      <span className="font-semibold text-amber-200">{activeReturn.refundMethod || "Original Payment Method"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Refund Amount:</span>
                      <span className="font-serif font-bold text-accent">₹{activeReturn.refundAmount.toLocaleString()}</span>
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

              {((activeReturn.images && activeReturn.images.length > 0) || (activeReturn.videos && activeReturn.videos.length > 0)) && (
                <div className="space-y-2">
                  <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Evidence Uploaded</h4>
                  <div className="border border-white/10 rounded-2xl p-4 bg-white/5 flex flex-wrap gap-3">
                    {activeReturn.images?.map((img, i) => (
                      <a href={img} target="_blank" rel="noopener noreferrer" key={i} className="group relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-accent">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-white">View</span>
                      </a>
                    ))}
                    {activeReturn.videos?.map((vid, i) => (
                      <div key={i} className="w-24 h-16 rounded-lg border border-white/10 bg-black flex flex-col justify-center items-center text-[8px] text-muted-foreground p-1 text-center">
                        <span className="text-accent font-semibold">Video Evidence</span>
                        <span className="truncate w-full mt-1">{vid.split("/").pop()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    
                    <button
                      onClick={() => updateReturnDetails(activeReturn.id, { status: "Return Approved" })}
                      className="bg-emerald-600/35 hover:bg-emerald-600 text-emerald-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-emerald-500/20"
                    >
                      Approve Return
                    </button>

                    <button
                      onClick={() => {
                        setPickupModalReturnId(activeReturn.id);
                        setPickupDateInput(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
                      }}
                      className="bg-blue-600/35 hover:bg-blue-600 text-blue-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-blue-500/20"
                    >
                      Schedule Pickup
                    </button>

                    <button
                      onClick={() => updateReturnDetails(activeReturn.id, { status: "Item Received" })}
                      className="bg-indigo-600/35 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-indigo-500/20"
                    >
                      Mark Item Received
                    </button>

                    <button
                      onClick={() => {
                        triggerModal("success", "Issue Refund & Complete Return", `Approve refund and complete payout of ₹${activeReturn.refundAmount.toLocaleString()}? This will instantly credit the customer wallet/account and mark it completed.`, () => {
                          approveReturn(activeReturn.id);
                        });
                      }}
                      className="bg-accent hover:bg-accent/90 text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg shadow-lg"
                    >
                      Issue Refund
                    </button>

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

      {/* 1. OVERVIEW & ANALYTICS */}
      {tab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ["Live Users", "148", "Active right now"],
              ["Active Sessions", "3,489", "Today's traffic"],
              ["Orders Today", ordersList.filter(o => o.date.slice(0, 10) === new Date().toISOString().slice(0, 10)).length.toString(), "Real-time updates"],
              ["Revenue Today", "₹" + ordersList.filter(o => o.date.slice(0, 10) === new Date().toISOString().slice(0, 10)).reduce((sum, o) => sum + o.total, 0).toLocaleString(), "Paid orders"],
            ].map(([k, v, d]) => (
              <AdminCard key={k}>
                <div className="editorial-label text-muted-foreground">{k}</div>
                <div className="font-serif text-3xl mt-3">{v}</div>
                <div className="text-[10px] text-accent mt-2 uppercase tracking-wider">{d}</div>
              </AdminCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <AdminCard className="lg:col-span-2 space-y-6">
              <h3 className="font-serif text-xl">Top Categories & Sales</h3>
              <div className="space-y-4">
                {[
                  ["Tops & Corsets", "₹12,45,000", "72% conversion"],
                  ["Bottoms & Pants", "₹8,90,000", "65% conversion"],
                  ["Couture Dresses", "₹24,50,000", "42% conversion"],
                  ["Shirts & Tees", "₹4,12,000", "88% conversion"],
                ].map(([cat, rev, rate]) => (
                  <div key={cat} className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-0">
                    <div>
                      <div className="text-sm font-semibold">{cat}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{rate}</div>
                    </div>
                    <div className="font-serif text-sm">{rev}</div>
                  </div>
                ))}
              </div>
            </AdminCard>
            <AdminCard className="space-y-6">
              <h3 className="font-serif text-xl">Refund Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Total Returns Queue</span>
                  <span className="font-serif font-bold text-lg">{returnsList.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Pending Approval</span>
                  <span className="font-serif text-amber-300 font-bold">{returnsList.filter(r => r.status === "Pending").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Approved Refunds</span>
                  <span className="font-serif text-emerald-300 font-bold">{returnsList.filter(r => r.status === "Approved").length}</span>
                </div>
                <div className="h-px bg-border-subtle" />
                <div className="text-xs text-muted-foreground italic">
                  Razorpay Auto-Payout integration status: <span className="text-emerald-400 font-semibold uppercase tracking-widest text-[9px]">ONLINE</span>
                </div>
              </div>
            </AdminCard>
          </div>
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
                  setBucketForm({ name: "", productIds: [], starProductId: "" });
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
                  if (editingBucket) {
                    updateBucket(editingBucket.id, bucketForm);
                    setEditingBucket(null);
                    setIsAddingBucket(false);
                    triggerModal("success", "Bucket Updated", "The curation bucket has been updated successfully.", () => {});
                  } else {
                    createBucket(bucketForm.name, bucketForm.productIds, bucketForm.starProductId);
                    setIsAddingBucket(false);
                    triggerModal("success", "Bucket Created", "New curation bucket successfully generated.", () => {});
                  }
                  setBucketForm({ name: "", productIds: [], starProductId: "" });
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
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-semibold">Select Star Product (Use as Thumbnail)</label>
                    <select
                      className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground"
                      value={bucketForm.starProductId || ""}
                      onChange={(e) => setBucketForm({ ...bucketForm, starProductId: e.target.value })}
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
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                  <AdminButton type="button" variant="outline" onClick={() => setIsAddingBucket(false)}>Cancel</AdminButton>
                  <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90">
                    {editingBucket ? "Save Changes" : "Create Bucket"}
                  </button>
                </div>
              </form>
            </AdminCard>
          )}

          <div className={`${rearrangeMode ? "flex flex-col gap-3" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
            {(state.buckets || []).map((b, idx) => {
              const starProd = productsList.find((p) => p.id === b.starProductId) || productsList.find((p) => b.productIds.includes(p.id));
              const thumbnail = starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";

              if (rearrangeMode) {
                return (
                  <div
                    key={b.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className="liquid-glass border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-4 flex items-center justify-between cursor-move hover:bg-amber-500/10 transition-all select-none animate-in fade-in duration-200"
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
                    <span className="absolute top-3 left-3 bg-accent/95 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold">
                      {b.productIds.length} Products
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
                      <div className="editorial-label text-muted-foreground text-[10px]">Curation Bucket</div>
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
                            starProductId: b.starProductId || ""
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
            <div>
              <h3 className="font-serif text-xl">Homepage Layout Dashboard</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Customize, reorder, and publish sections for shop.reevibes.com</p>
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
                onClick={() => {
                  triggerModal(
                    "warning",
                    "Publish Homepage",
                    "Are you sure you want to push all draft modifications live to shop.reevibes.com? This will overwrite the active homepage layout.",
                    () => {
                      updateHomepageLayoutDraft(draftLayout);
                      publishHomepageLayout();
                      triggerModal("success", "Homepage Published", "The new homepage layout has been published successfully and is now live.", () => {});
                    }
                  );
                }}
                className="editorial-label text-xs bg-accent text-white px-4 py-2 rounded-full hover:bg-accent/90 transition-all shadow-md"
              >
                Publish Live
              </button>
              <button
                onClick={() => {
                  triggerModal(
                    "danger",
                    "Revert Layout Changes",
                    "Are you sure you want to discard all your draft changes and restore the homepage layout to the last published live version?",
                    () => {
                      revertHomepageLayout();
                      setDraftLayout(null); // Force re-render from state
                      triggerModal("success", "Reverted Successfully", "Draft layout has been reverted to the live version.", () => {});
                    }
                  );
                }}
                className="editorial-label text-xs border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 px-4 py-2 rounded-full transition-all"
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
                        setDraftLayout({
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
                        });
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
                        setDraftLayout({
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
                        });
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
                    const filteredList = draftLayout.sectionOrder.filter(
                      (id: string) => ["announcement", "hero", "recentlyViewed"].includes(id) || id.startsWith("section-") || id.startsWith("subbanner-")
                    ).concat(["chatbot", "assistant"]);
                    return filteredList.map((secId: string, idx: number) => {
                      const sec = draftLayout[secId];
                      if (!sec) return null;
                      const isSelected = activeSectionId === secId;

                      let displayName = secId;
                      if (secId === "announcement") displayName = "Top Announcement";
                      else if (secId === "hero") displayName = "Hero Banner Carousel";
                      else if (secId === "recentlyViewed") displayName = "Recently Viewed Products";
                      else if (secId === "chatbot") displayName = "AI Chatbot";
                      else if (secId === "assistant") displayName = "Floating 3D Robot";
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
                                setDraftLayout({
                                  ...draftLayout,
                                  [secId]: { ...sec, enabled: !sec.enabled }
                                });
                              }}
                              className={`p-1 rounded ${sec.enabled ? "text-accent" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
                              title={sec.enabled ? "Hide Section" : "Show Section"}
                            >
                              {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            {/* Reordering Actions */}
                            {secId !== "assistant" && secId !== "chatbot" && (
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
                                    setDraftLayout({ ...draftLayout, sectionOrder: nextOrder });
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
                                    setDraftLayout({ ...draftLayout, sectionOrder: nextOrder });
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
                                    setDraftLayout(nextDraft);
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
                <AdminCard className="space-y-4 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h4 className="font-serif text-md capitalize">{activeSectionId.replace(/([A-Z])/g, " $1")} Editor</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">Enabled:</span>
                      <input
                        type="checkbox"
                        checked={draftLayout[activeSectionId].enabled}
                        onChange={(e) => {
                          setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
                              ...draftLayout,
                              announcement: { ...draftLayout.announcement, linkUrl: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Background Theme Color</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                              value={draftLayout.announcement.backgroundColor}
                              onChange={(e) => setDraftLayout({
                                ...draftLayout,
                                announcement: { ...draftLayout.announcement, backgroundColor: e.target.value }
                              })}
                            />
                            <input
                              type="text"
                              className="flex-1 bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground font-mono"
                              value={draftLayout.announcement.backgroundColor}
                              onChange={(e) => setDraftLayout({
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
                              setDraftLayout({
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
                                setDraftLayout({
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
                                      setDraftLayout({
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
                                      setDraftLayout({
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
                                      setDraftLayout({
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
                              setDraftLayout({
                                ...draftLayout,
                                chatbot: { ...draftLayout.chatbot, enabled: e.target.checked }
                              });
                            }}
                            className="rounded border-white/10 text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {/* Floating 3D Robot Editor */}
                    {activeSectionId === "assistant" && (
                      <div className="space-y-3">
                        <label className="text-muted-foreground font-semibold block">Floating 3D Robot Visibility</label>
                        <p className="text-[11px] text-muted-foreground">The interactive 3D Robot animation appears fixed at the bottom-right corner of the homepage, tracking the user's mouse cursor for a premium interactive experience.</p>
                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                          <span className="text-muted-foreground font-semibold">Enable Floating 3D Robot</span>
                          <input
                            type="checkbox"
                            checked={draftLayout.assistant?.enabled !== false}
                            onChange={(e) => {
                              setDraftLayout({
                                ...draftLayout,
                                assistant: { ...draftLayout.assistant, enabled: e.target.checked }
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
                                redirectUrl: "/shop/categories",
                                desktopImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80",
                                mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
                                videoUrl: "",
                                scheduleStart: "",
                                scheduleEnd: ""
                              };
                              const updated = [...draftLayout.hero.banners, newBanner];
                              setDraftLayout({
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
                                      setDraftLayout({
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
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                      className="col-span-2 bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                                    >
                                      <option value="Image Banner">Image Banner</option>
                                      <option value="Video Banner">Video Banner</option>
                                      <option value="Collection Banner">Collection Banner</option>
                                      <option value="Brand Campaign Banner">Brand Campaign Banner</option>
                                    </select>
                                    <input
                                      placeholder="Title"
                                      className="bg-surface border border-border-subtle p-2 outline-none"
                                      value={b.title}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, title: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Subtitle"
                                      className="bg-surface border border-border-subtle p-2 outline-none"
                                      value={b.subtitle}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, subtitle: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Button text"
                                      className="bg-surface border border-border-subtle p-2 outline-none"
                                      value={b.buttonText || "Shop Now"}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, buttonText: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Redirect URL"
                                      className="bg-surface border border-border-subtle p-2 outline-none font-mono"
                                      value={b.redirectUrl}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, redirectUrl: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Desktop Image URL"
                                      className="col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono"
                                      value={b.desktopImage}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, desktopImage: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Mobile Image URL"
                                      className="col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono"
                                      value={b.mobileImage}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, mobileImage: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Video URL Option"
                                      className="col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono"
                                      value={b.videoUrl || ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, videoUrl: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Schedule Start (YYYY-MM-DD)"
                                      className="bg-surface border border-border-subtle p-2 outline-none"
                                      value={b.scheduleStart || ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, scheduleStart: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />
                                    <input
                                      placeholder="Schedule End (YYYY-MM-DD)"
                                      className="bg-surface border border-border-subtle p-2 outline-none"
                                      value={b.scheduleEnd || ""}
                                      onChange={(e) => {
                                        const updated = draftLayout.hero.banners.map((x: any) => x.id === b.id ? { ...x, scheduleEnd: e.target.value } : x);
                                        setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                                      }}
                                    />

                                    {/* Visual preview inside slide panel */}
                                    <div className="col-span-2 flex gap-3 mt-2 p-2 bg-zinc-950/40 border border-white/5 rounded">
                                      {b.desktopImage && (
                                        <div className="flex-1 space-y-1">
                                          <span className="text-[9px] text-muted-foreground">Desktop Preview:</span>
                                          <img src={b.desktopImage} className="w-full h-20 object-cover rounded border border-white/10" alt="" />
                                        </div>
                                      )}
                                      {b.mobileImage && (
                                        <div className="flex-1 space-y-1">
                                          <span className="text-[9px] text-muted-foreground">Mobile Preview:</span>
                                          <img src={b.mobileImage} className="w-full h-20 object-cover rounded border border-white/10" alt="" />
                                        </div>
                                      )}
                                      {b.videoUrl && (
                                        <div className="flex-1 space-y-1">
                                          <span className="text-[9px] text-muted-foreground">Video Preview:</span>
                                          <div className="w-full h-20 bg-zinc-900 border border-white/10 rounded flex items-center justify-center text-[10px] text-accent font-semibold truncate px-1">
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
                        <label className="text-muted-foreground font-semibold">Category Card Listings</label>
                        <div className="space-y-3">
                          {draftLayout.categories.items.map((cat: any) => (
                            <div key={cat.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                              <div className="font-bold font-mono text-[10px] text-accent">{cat.name} Category</div>
                              <input
                                placeholder="Redirect Link"
                                className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none font-mono"
                                value={cat.redirectUrl}
                                onChange={(e) => {
                                  const updated = draftLayout.categories.items.map((x: any) => x.id === cat.id ? { ...x, redirectUrl: e.target.value } : x);
                                  setDraftLayout({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                                }}
                              />
                              <input
                                placeholder="Image URL"
                                className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none font-mono"
                                value={cat.image}
                                onChange={(e) => {
                                  const updated = draftLayout.categories.items.map((x: any) => x.id === cat.id ? { ...x, image: e.target.value } : x);
                                  setDraftLayout({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
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
                              onChange={(e) => setDraftLayout({
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
                              onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                                      setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                                        setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                      <>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Campaign Headline</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                            value={draftLayout.campaign.heading}
                            onChange={(e) => setDraftLayout({
                              ...draftLayout,
                              campaign: { ...draftLayout.campaign, heading: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">CTA Button Label</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground"
                            value={draftLayout.campaign.ctaText || "Shop Campaign"}
                            onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
                              ...draftLayout,
                              campaign: { ...draftLayout.campaign, redirectUrl: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Campaign Large Image URL</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.campaign.image}
                            onChange={(e) => setDraftLayout({
                              ...draftLayout,
                              campaign: { ...draftLayout.campaign, image: e.target.value }
                            })}
                          />
                        </div>
                      </>
                    )}

                    {/* Featured Collection Editor */}
                    {activeSectionId === "collections" && (
                      <>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Collection Label</label>
                          <select
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                            value={draftLayout.collections.collectionId}
                            onChange={(e) => setDraftLayout({
                              ...draftLayout,
                              collections: { ...draftLayout.collections, collectionId: e.target.value }
                            })}
                          >
                            <option value="Premium Collection">Premium Collection</option>
                            <option value="Office Wear">Office Wear</option>
                            <option value="Party Wear">Party Wear</option>
                            <option value="Casual Wear">Casual Wear</option>
                            <option value="Luxury Collection">Luxury Collection</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Featured Cover Image URL</label>
                          <input
                            type="text"
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.collections.coverImage}
                            onChange={(e) => setDraftLayout({
                              ...draftLayout,
                              collections: { ...draftLayout.collections, coverImage: e.target.value }
                            })}
                          />
                        </div>
                      </>
                    )}

                    {/* Live Purchase Feed Editor */}
                    {activeSectionId === "liveFeed" && (
                      <div className="space-y-3">
                        <label className="text-muted-foreground font-semibold">Purchase Alert Feeds Mode</label>
                        <select
                          className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs"
                          value={draftLayout.liveFeed.mode}
                          onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                                        setDraftLayout({
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
                          onChange={(e) => setDraftLayout({
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
                                    setDraftLayout({
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
                                    setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                                  setDraftLayout({
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
                                    setDraftLayout({
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
                                      setDraftLayout({
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
                          onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
                              ...draftLayout,
                              brandStory: { ...draftLayout.brandStory, text: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground font-semibold">Collage Image #1 URL</label>
                          <input
                            className="w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono"
                            value={draftLayout.brandStory.image1}
                            onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                          onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                              onChange={(e) => setDraftLayout({
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
                                setDraftLayout({
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
                                  setDraftLayout({
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
                                        setDraftLayout({
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
                                            setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
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
                                            setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
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
                                            setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
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
                                            setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
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
                                            setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                                          }}
                                        />
                                      </div>

                                      {/* Visual Preview thumbnails inside custom banner slide panel */}
                                      <div className="col-span-2 flex gap-3 mt-2 p-2 bg-zinc-950/40 border border-white/5 rounded">
                                        {b.desktopImage && (
                                          <div className="flex-1 space-y-1">
                                            <span className="text-[9px] text-muted-foreground">Desktop Preview:</span>
                                            <img src={b.desktopImage} className="w-full h-16 object-cover rounded border border-white/10" alt="" />
                                          </div>
                                        )}
                                        {b.mobileImage && (
                                          <div className="flex-1 space-y-1">
                                            <span className="text-[9px] text-muted-foreground">Mobile Preview:</span>
                                            <img src={b.mobileImage} className="w-full h-16 object-cover rounded border border-white/10" alt="" />
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
                            onChange={(e) => setDraftLayout({
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
                            onChange={(e) => setDraftLayout({
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
                                        setDraftLayout({
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
                                      setDraftLayout({
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
                          <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Description</label>
                          <textarea
                            rows={3}
                            className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent resize-none leading-normal"
                            value={currentItem.description}
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
                              className="w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                              value={currentItem.material || ""}
                              onChange={e => {
                                updateImportedProductField("material", e.target.value);
                                updateImportedProductField("fabric", e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Product Information</label>
                          <textarea
                            rows={4}
                            placeholder="Heading-based details. E.g.
### Product details
Material composition: 60% Cotton, 40% Polyester

### About this item
Fit: Regular Fit"
                            className="w-full bg-surface border border-black/10 dark:border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent resize-y min-h-[100px] leading-normal font-mono"
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


          {/* Top-Level Catalog Navigation */}
          <div className="flex border-b border-white/10 gap-8 text-sm font-serif mb-6">
            <button
              onClick={() => {
                setCatalogSection("main");
                setCatalogTab("all");
                setSelectedProductIds([]);
              }}
              className={`pb-3 transition-colors cursor-pointer font-bold ${
                catalogSection === "main" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Main Catalog
            </button>
            <button
              onClick={() => {
                setCatalogSection("vendors");
                setCatalogTab("all");
                setSelectedCatalogVendor(vendorsList[0]?.id || "blankapparel");
                setSelectedProductIds([]);
              }}
              className={`pb-3 transition-colors cursor-pointer font-bold ${
                catalogSection === "vendors" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Vendors
            </button>
          </div>

          {/* Vendor-Specific Sub-tabs (only shown when Vendors catalog section is active) */}
          {catalogSection === "vendors" && (
            <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-full w-fit border border-white/5">
              {vendorsList.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedCatalogVendor(v.id);
                    setCatalogTab("all");
                    setSelectedProductIds([]);
                  }}
                  className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${
                    selectedCatalogVendor === v.id
                      ? "bg-accent text-white"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {v.companyName || v.id}
                </button>
              ))}
            </div>
          )}

          {/* Sub-tabs for All, Unpublished, and Published */}
          <div className="flex border-b border-white/10 gap-6 text-xs font-bold uppercase tracking-wider mb-4">
            <button
              onClick={() => {
                setCatalogTab("all");
                setSelectedProductIds([]);
              }}
              className={`pb-2.5 transition-colors cursor-pointer ${catalogTab === "all" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              All Products ({
                (catalogSection === "main"
                  ? productsList
                  : productsList.filter((p: any) => p.vendorId === selectedCatalogVendor && p.inCatalog === true)
                ).length
              })
            </button>
            <button
              onClick={() => {
                setCatalogTab("unpublished");
                setSelectedProductIds([]);
              }}
              className={`pb-2.5 transition-colors cursor-pointer ${catalogTab === "unpublished" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              Unpublished ({
                (catalogSection === "main"
                  ? productsList.filter((p: any) => p.status && p.status !== "PUBLISHED")
                  : productsList.filter((p: any) => p.vendorId === selectedCatalogVendor && p.inCatalog === true && p.status && p.status !== "PUBLISHED")
                ).length
              })
            </button>
            <button
              onClick={() => {
                setCatalogTab("published");
                setSelectedProductIds([]);
              }}
              className={`pb-2.5 transition-colors cursor-pointer ${catalogTab === "published" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              Published ({
                (catalogSection === "main"
                  ? productsList.filter((p: any) => p.status === "PUBLISHED" || !p.status)
                  : productsList.filter((p: any) => p.vendorId === selectedCatalogVendor && p.inCatalog === true && (p.status === "PUBLISHED" || !p.status))
                ).length
              })
            </button>
          </div>

          {/* Bulk Actions Bar */}
          {(() => {
            let filtered = productsList;

            // 1. Filter by Catalog Section
            if (catalogSection === "main") {
              // Main Catalog shows all products in the catalog
            } else if (catalogSection === "vendors") {
              // Show only imported products from the selected vendor
              filtered = filtered.filter((p: any) => p.vendorId === selectedCatalogVendor && p.inCatalog === true);
            }

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
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          selectedProductIds.forEach(id => {
                            const p = productsList.find(x => String(x.id) === id);
                            if (p) {
                              updateProduct(id, { ...p, status: "PUBLISHED" });
                            }
                          });
                          setSelectedProductIds([]);
                          triggerModal("success", "Bulk Published", "Selected products are now published to the user shop portal.", () => {});
                        }}
                        className="bg-accent text-white px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-accent/90 transition-all cursor-pointer shadow-lg shadow-accent/20"
                      >
                        Bulk Publish
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

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((p: any) => {
                    const isChecked = selectedProductIds.includes(String(p.id));
                    // Check if information is fully complete
                    // Check if information is fully complete (Description, Images, Material/Fabric, Categories, Product Type, Sizes, Pricing, SEO Details)
                    const isComplete = !!p.name && !!p.description && !!p.category && !!p.gender && 
                      (!!p.tag || (p.tags && p.tags.length > 0)) && !!p.color && 
                      (!!p.material || !!p.fabric) && (p.house || p.brand) && !!p.originalPrice && 
                      !!p.price && p.sizes && p.sizes.length > 0 && 
                      ((p.images && p.images.length > 0) || !!p.image) && !!p.sku &&
                      !!p.type && !!p.seoTitle && !!p.seoDescription && !!p.seoKeywords;

                    return (
                      <div key={p.id} className="liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden border border-white/5 rounded-2xl bg-white/[0.02]">
                        {/* Checkbox Selector */}
                        <div className="absolute top-3 left-3 z-20">
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
                            className="rounded border-white/30 text-accent focus:ring-accent w-4 h-4 bg-zinc-950/80 backdrop-blur cursor-pointer"
                          />
                        </div>

                        {/* Color dot indicator (Green = live, Blue = complete but not live, Yellow = incomplete) */}
                        <div className="absolute top-3 right-3 z-20 flex items-center">
                          {(() => {
                            let dotColorClass = "bg-yellow-500 shadow-yellow-500/80";
                            let tooltipTitle = "Product information incomplete";
                            if (p.status === "PUBLISHED") {
                              dotColorClass = "bg-emerald-500 shadow-emerald-500/80";
                              tooltipTitle = "Published live";
                            } else if (isComplete) {
                              dotColorClass = "bg-blue-500 shadow-blue-500/80";
                              tooltipTitle = "Product fully complete but unpublished";
                            }
                            return (
                              <div
                                title={tooltipTitle}
                                className={`w-2.5 h-2.5 rounded-full border border-white/20 shadow-md animate-pulse ${dotColorClass}`}
                              />
                            );
                          })()}
                        </div>

                        <div className="aspect-[3/4] overflow-hidden bg-zinc-950 relative">
                          <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          {p.tag && <span className="absolute bottom-3 left-3 bg-accent/95 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5">{p.tag}</span>}
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                              <span>{p.house || p.brand} · {p.category}</span>
                              <span className="text-accent uppercase font-mono tracking-wider">{p.type || "Product"}</span>
                            </div>
                            <h4 className="font-serif text-base mt-1 text-white font-bold line-clamp-1">{p.name}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-accent text-sm font-semibold">{p.price}</span>
                              {p.originalPrice && p.originalPrice !== p.price && (
                                <span className="line-through text-muted-foreground text-xs">{p.originalPrice}</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Quick Product Visibility / Status Workflow Selector */}
                          <div className="space-y-3 pt-2 border-t border-white/5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                <span>Status:</span>
                                <span className={p.status === "PUBLISHED" ? "text-emerald-400" : "text-amber-500"}>
                                  {p.status === "PUBLISHED" ? "Published" : "Unpublished"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const isPublished = p.status === "PUBLISHED";
                                  updateProduct(p.id, {
                                    status: isPublished ? "UNPUBLISHED" : "PUBLISHED",
                                    visibility: isPublished ? "HIDDEN" : "VISIBLE"
                                  });
                                  toast.success(isPublished ? "Product hidden" : "Product published live");
                                }}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 outline-none cursor-pointer transition-colors"
                              >
                                {p.status === "PUBLISHED" ? "Hide" : "Unhide"}
                              </button>
                            </div>

                            <div className="flex gap-2">
                              <button onClick={() => handleEditProduct(p)} className="flex-1 border border-white/10 hover:border-white/20 py-2 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 rounded-xl cursor-pointer bg-white/[0.02]"><Edit2 className="w-3 h-3" /> Edit</button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="border border-rose-500/20 hover:border-rose-500/45 text-rose-400 py-2 px-3 text-[10px] flex items-center justify-center rounded-xl cursor-pointer bg-rose-500/5"><Trash2 className="w-3.5 h-3.5" /></button>
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
            <h3 className="font-serif text-xl">Orders Lifecycle Tracker</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Month:</span>
                <select
                  value={filterMonth}
                  onChange={e => setFilterMonth(e.target.value)}
                  className="bg-surface border border-border-subtle rounded-md text-xs px-2.5 py-1.5 text-white outline-none focus:border-accent"
                >
                  <option value="--">--</option>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, idx) => (
                    <option key={m} value={String(idx)}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Year:</span>
                <select
                  value={filterYear}
                  onChange={e => setFilterYear(e.target.value)}
                  className="bg-surface border border-border-subtle rounded-md text-xs px-2.5 py-1.5 text-white outline-none focus:border-accent"
                >
                  <option value="--">--</option>
                  {Array.from(new Set([
                    ...Array.from(new Set(ordersList.map(o => {
                      const d = new Date(o.date);
                      return isNaN(d.getTime()) ? null : d.getFullYear();
                    }).filter((y): y is number => typeof y === "number"))),
                    new Date().getFullYear(),
                    2026, 2025, 2024
                  ])).sort((a: number, b: number) => b - a).map(y => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Order Date & Time</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total (INR)</th>
                  <th className="pb-3">Delivery Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-surface-2/40">
                    <td className="py-4 font-mono text-xs">
                      <button
                        onClick={() => setSelectedOrderDetails(o)}
                        className="text-accent hover:underline text-left font-bold cursor-pointer"
                      >
                        {o.id}
                      </button>
                    </td>
                    <td className="py-4 whitespace-nowrap text-xs text-muted-foreground">
                      {formatOrderDateTime(o.date)}
                    </td>
                    <td className="py-4">{o.customerName || "Member"}</td>
                    <td className="py-4">
                      {o.items.map(item => `${item.name} (${item.selectedSize || "M"}) x${item.qty}`).join(", ")}
                    </td>
                    <td className="py-4 font-serif">₹{o.total.toLocaleString()}</td>
                    <td className="py-4">
                      <StatusChip
                        status={o.status}
                        tone={
                          o.status === "Delivered" ? "success" :
                          o.status === "Processing" ? "warn" :
                          o.status === "Shipped" ? "accent" : "neutral"
                        }
                      />
                    </td>
                    <td className="py-4 text-right space-x-1 whitespace-nowrap">
                      {o.status === "Processing" && (
                        <>
                          <button onClick={() => updateOrderStatus(o.userId, o.id, "Accepted")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Accept</button>
                          <button onClick={() => updateOrderStatus(o.userId, o.id, "Rejected")} className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Reject</button>
                        </>
                      )}
                      {o.status === "Accepted" && (
                        <button onClick={() => updateOrderStatus(o.userId, o.id, "Shipped")} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Ship Package</button>
                      )}
                      {o.status === "Shipped" && (
                        <button onClick={() => updateOrderStatus(o.userId, o.id, "Delivered")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Deliver</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* 5. RETURNS & REFUNDS */}
      {tab === "returns" && (
        <AdminCard className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl">Returns Queue & Razorpay Auto-Refund</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manage customer return requests, schedule courier pickups, and issue payouts.</p>
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
                  <th className="pb-3">Reason / Details</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {returnsList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-xs text-muted-foreground italic">
                      No returns registered in system queue.
                    </td>
                  </tr>
                ) : (
                  returnsList.map(r => (
                    <tr key={r.id} className="hover:bg-surface-2/40 group cursor-pointer" onClick={() => setSelectedReturnDetails(r)}>
                      <td className="py-4 font-mono text-xs text-accent font-bold group-hover:underline">
                        {r.id}
                      </td>
                      <td className="py-4 font-mono text-xs">{r.orderId}</td>
                      <td className="py-4">
                        <div className="font-semibold text-white">{r.customerName}</div>
                        <div className="text-[10px] text-muted-foreground">{r.customerId}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium text-white">{r.productName}</div>
                        <div className="text-[10px] text-muted-foreground">Size: {r.selectedSize || "—"} · Qty: {r.qty || 1}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-semibold text-amber-200">{r.reason}</div>
                        <div className="text-xs text-muted-foreground max-w-xs truncate">{r.comment}</div>
                      </td>
                      <td className="py-4 font-serif font-semibold">₹{r.refundAmount.toLocaleString()}</td>
                      <td className="py-4">
                        <StatusChip
                          status={r.status}
                          tone={
                            r.status === "Refund Completed" || r.status === "Approved" ? "success" :
                            r.status === "Pending" || r.status === "Under Review" ? "warn" :
                            r.status === "Rejected" ? "danger" : "accent"
                          }
                        />
                      </td>
                      <td className="py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setSelectedReturnDetails(r)}
                            className="bg-accent/20 hover:bg-accent text-accent hover:text-white text-[10px] uppercase font-bold px-2 py-1 rounded"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* 6. CUSTOMERS DIRECTORY */}
      {tab === "customers" && (
        <AdminCard className="space-y-6 animate-in fade-in duration-200">
          <h3 className="font-serif text-xl">Customer Directories</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                  <th className="pb-3">User ID</th>
                  <th className="pb-3">Customer Name</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Wallet Balance</th>
                  <th className="pb-3 text-right">Orders Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {customersList.map(c => {
                  const bal = state.wallets[c.id] ?? 0;
                  const orderCount = state.orders[c.id]?.length ?? 0;
                  return (
                    <tr key={c.id} className="hover:bg-surface-2/40">
                      <td className="py-4">
                        <button
                          onClick={() => { setSelectedCustomerDetails(c); setDossierTab("details"); }}
                          className="font-mono text-xs text-accent hover:underline text-left cursor-pointer"
                        >
                          {c.id}
                        </button>
                      </td>
                      <td className="py-4 font-semibold">{c.firstName} {c.lastName}</td>
                      <td className="py-4">
                        <div>{c.email}</div>
                        <div className="text-xs text-muted-foreground">{c.phone}</div>
                      </td>
                      <td className="py-4 font-serif font-semibold text-accent">₹{bal.toLocaleString()}</td>
                      <td className="py-4 text-right font-semibold pr-2">
                        {orderCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* 7. COUPONS MANAGER */}
      {tab === "coupons" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl">Active Store Coupons</h3>
            <button
              onClick={() => setIsAddingCoupon(!isAddingCoupon)}
              className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Coupon
            </button>
          </div>

          {isAddingCoupon && (
            <AdminCard className="space-y-6 animate-in slide-in-from-top-4 duration-200">
              <h4 className="font-serif text-lg">Create Coupon Code</h4>
              <form onSubmit={handleCouponSubmit} className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Coupon Code</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" placeholder="DIWALI30" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Discount Value</label>
                  <input required type="number" className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" value={couponForm.discount} onChange={e => setCouponForm({...couponForm, discount: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Coupon Type</label>
                  <select className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={couponForm.type} onChange={e => setCouponForm({...couponForm, type: e.target.value as any})}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="wallet">Wallet Cashback</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">User Eligibility Limit</label>
                  <select className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={couponForm.userLimitType} onChange={e => setCouponForm({...couponForm, userLimitType: e.target.value})}>
                    <option value="unlimited">Unlimited Users</option>
                    <option value="limited">Limited Users</option>
                  </select>
                </div>
                {couponForm.userLimitType === "limited" && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <label className="text-xs text-muted-foreground font-semibold">Max User Count</label>
                    <input required type="number" min="1" className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" value={couponForm.usageLimit} onChange={e => setCouponForm({...couponForm, usageLimit: Number(e.target.value)})} />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Coupon Expiry Duration</label>
                  <select className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={couponForm.expiryType} onChange={e => setCouponForm({...couponForm, expiryType: e.target.value})}>
                    <option value="unlimited">Unlimited Time (No Expiry)</option>
                    <option value="limited">Limited Time (Expires)</option>
                  </select>
                </div>
                {couponForm.expiryType === "limited" && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <label className="text-xs text-muted-foreground font-semibold">Expiry Date</label>
                    <input required type="date" className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={couponForm.expiryDate} onChange={e => setCouponForm({...couponForm, expiryDate: e.target.value})} />
                  </div>
                )}

                <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-border-subtle">
                  <AdminButton type="button" variant="outline" onClick={() => setIsAddingCoupon(false)}>Cancel</AdminButton>
                  <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90">Add Coupon</button>
                </div>
              </form>
            </AdminCard>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {couponsList.map(c => (
              <AdminCard key={c.code} className="relative overflow-hidden flex flex-col justify-between min-h-48 p-5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-8 -mt-8" />
                <div className="space-y-1">
                  <div className="font-mono text-xl font-bold tracking-widest text-accent">{c.code}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.type} discount</div>
                </div>
                
                <div className="text-xs space-y-1 my-3 text-muted-foreground border-y border-white/5 py-2">
                  <div>
                    <span className="font-semibold text-foreground/80">Expiry:</span>{" "}
                    {c.expiryDate === "unlimited" || !c.expiryDate ? "Unlimited (No Expiry)" : c.expiryDate}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/80">Claims:</span>{" "}
                    {c.usageLimit === -1 || !c.usageLimit ? `${c.usedCount || 0} / Unlimited` : `${c.usedCount || 0} / ${c.usageLimit} users`}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div className="font-serif text-2xl font-bold">{c.type === "percentage" ? `${c.discount}% OFF` : `₹${c.discount.toLocaleString()} OFF`}</div>
                  <button onClick={() => removeCoupon(c.code)} className="text-xs text-rose-400 hover:text-rose-500 uppercase font-semibold">Delete</button>
                </div>
              </AdminCard>
            ))}
          </div>
        </div>
      )}

      {/* 8. REVIEWS MODERATION */}
      {tab === "reviews" && (
        <AdminCard className="space-y-6 animate-in fade-in duration-200">
          <h3 className="font-serif text-xl">Product Reviews Moderation</h3>
          <div className="space-y-4">
            {Object.entries(state.productReviews).flatMap(([productId, list]) =>
              list.map(r => ({ ...r, productId }))
            ).map(r => (
              <div key={r.id} className="border-b border-border-subtle pb-4 last:border-0 flex justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm">{r.userName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{r.date}</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 fill-current ${i < r.rating ? "text-amber-400" : "text-zinc-600"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm italic">"{r.comment}"</p>
                  <div className="text-[10px] text-muted-foreground">Product Code: {r.productId}</div>
                </div>
                <div className="flex flex-col gap-2 justify-center shrink-0">
                  {r.status === "Approved" ? (
                    <button onClick={() => moderateReview(r.productId, r.id, "hide")} className="text-[10px] uppercase font-bold border border-rose-500/30 hover:border-rose-500 text-rose-400 px-3 py-1.5 flex items-center gap-1"><EyeOff className="w-3.5 h-3.5" /> Hide Review</button>
                  ) : (
                    <button onClick={() => moderateReview(r.productId, r.id, "approve")} className="text-[10px] uppercase font-bold border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 px-3 py-1.5 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Approve</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* 9. VENDORS DIRECTORY */}
      {tab === "vendors" && (
        <VendorDashboard />
      )}
    </div>
  );
}
