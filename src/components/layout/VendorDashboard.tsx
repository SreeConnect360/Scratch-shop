import { useState, useEffect } from "react";
import {
  ShoppingBag, Truck, RefreshCw, Users, Ticket, Star, Store, BarChart3,
  Sparkles, LayoutGrid, Plus, Edit2, Trash2, Check, X, ShieldAlert,
  ArrowUpRight, IndianRupee, Search, Shield, Eye, EyeOff, PlusCircle,
  Settings as SettingsIcon, History, ListFilter, Tag, BarChart2, Undo, CheckSquare,
  Square, ArrowUpDown, Layers3, ChevronRight, Info, AlertTriangle
} from "lucide-react";
import { AdminCard, AdminButton, StatusChip } from "./AdminCommon";
import * as vendorApi from "@/lib/vendor-api";
import { usePortal } from "@/lib/portal-state";
import { toast } from "sonner";

export default function VendorDashboard() {
  const { state, reloadProducts } = usePortal();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendorForm, setNewVendorForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    logoUrl: "https://res.cloudinary.com/ihbgxvyo/image/upload/f_auto,q_auto/favicon_turcbu"
  });

  // Selected Vendor & Details state
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<string>("overview"); // overview, catalog, categories, brands, analytics, logs, settings
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);

  // Product Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Product Editor Modal
  const [catalogTab, setCatalogTab] = useState<"all" | "published">("all");
  const [tagInput, setTagInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [productForm, setProductForm] = useState<any>({
    name: "", description: "", price: "", originalPrice: "", discount: 0, category: "", brand: "", house: "",
    material: "", fabric: "", color: "", gender: "Unisex", sku: "", status: "DRAFT", visibility: "VISIBLE",
    seoTitle: "", seoDescription: "", seoKeywords: "", images: [], image: "", sizes: ["S", "M", "L"], stockPerSize: { S: 10, M: 10, L: 10 },
    tag: "", tags: [], discountLimitBuyers: undefined, discountExpiryDate: "", discountBuyersCount: 0
  });
  const [productVersions, setProductVersions] = useState<any[]>([]);

  // Category merge/rename form states
  const [categoryMergeForm, setCategoryMergeForm] = useState({ source: "", target: "" });
  const [categoryRenameForm, setCategoryRenameForm] = useState({ oldName: "", newName: "" });

  // Settings tab form state
  const [connectionForm, setConnectionForm] = useState({
    syncUrl: "",
    syncFrequency: "DAILY",
    apiKey: ""
  });

  // Fetch initial vendors
  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorApi.fetchVendors();
      setVendors(data);
      setIsOffline(false);
    } catch (err: any) {
      console.warn("Backend offline, loading mock/local storage vendors:", err);
      setIsOffline(true);
      
      const fallback = (state.vendors || []).filter((v: any) => v.id === "blankapparel").map((v: any) => {
        const localProds = (state.products as any[] || []).filter((p: any) => p.vendorId === v.id || p.brand === v.companyName);
        return {
          ...v,
          totalProducts: localProds.length,
          activeProducts: localProds.filter((p: any) => p.status === "PUBLISHED" || !p.status).length,
          hiddenProducts: localProds.filter((p: any) => p.status === "HIDDEN").length,
          draftProducts: localProds.filter((p: any) => p.status === "DRAFT").length,
          connectionStatus: v.id === "blankapparel" || v.id === "vn1" || v.id === "vn2" ? "CONNECTED" : "DISCONNECTED",
          lastSyncTime: new Date().toISOString(),
          syncFrequency: "DAILY",
          syncUrl: v.id === "blankapparel" ? "https://www.blankapparel.in/products.json" : ""
        };
      });
      setVendors(fallback);
      toast.info("Boutique Running in Offline Demo Mode.", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  // When active vendor or active sub-tab changes
  useEffect(() => {
    if (!selectedVendor) return;

    const loadVendorDetails = async () => {
      setLoadingProducts(true);
      try {
        if (isOffline) {
          const allProds = state.products as any[] || [];
          const matched = allProds.filter((p: any) => p.vendorId === selectedVendor.id || p.brand === selectedVendor.companyName);
          setProducts(matched);
          setSyncLogs([
            { status: "SUCCESS", runTime: new Date().toISOString(), logMessage: "Offline sandbox sync succeeded.", productsAdded: 0, productsUpdated: 0, productsRemoved: 0, durationMs: 450 }
          ]);
          setAnalytics({
            totalProducts: matched.length,
            publishedProducts: matched.filter((p: any) => p.status === "PUBLISHED" || !p.status).length,
            lowStockCount: matched.filter((p: any) => p.totalStock < 5).length,
            averagePrice: matched.length > 0 ? (matched.reduce((sum, p) => sum + Number(p.price.toString().replace(/[^0-9.]/g, "")), 0) / matched.length).toFixed(2) : "0"
          });
          setConnectionForm({
            syncUrl: selectedVendor.id === "blankapparel" ? "https://www.blankapparel.in/products.json" : "",
            syncFrequency: "DAILY",
            apiKey: ""
          });
          setLoadingProducts(false);
          return;
        }

        if (activeSubTab === "catalog" || activeSubTab === "overview") {
          if (selectedVendor.id === "blankapparel") {
            try {
              await vendorApi.triggerSync(selectedVendor.id);
            } catch (err) {
              console.error("Auto sync failed:", err);
            }
          }
          const prodData = await vendorApi.fetchProducts({ vendorId: selectedVendor.id, inCatalog: false });
          setProducts(prodData);
        }
        if (activeSubTab === "logs" || activeSubTab === "overview") {
          const logsData = await vendorApi.fetchSyncHistory(selectedVendor.id);
          setSyncLogs(logsData);
        }
        if (activeSubTab === "analytics") {
          const stats = await vendorApi.fetchVendorAnalytics();
          setAnalytics(stats);
        }
        if (activeSubTab === "settings") {
          const conn = await vendorApi.fetchConnection(selectedVendor.id);
          setConnectionForm({
            syncUrl: conn.syncUrl || "",
            syncFrequency: conn.syncFrequency || "DAILY",
            apiKey: conn.apiKey || ""
          });
        }
      } catch (err: any) {
        console.error("Failed to load online details, using mock data:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadVendorDetails();
  }, [selectedVendor, activeSubTab, isOffline]);

  // Handle register vendor
  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vendorApi.createVendor(newVendorForm as any);
      toast.success("Vendor account registered successfully");
      setIsAddingVendor(false);
      setNewVendorForm({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        logoUrl: "https://res.cloudinary.com/ihbgxvyo/image/upload/f_auto,q_auto/favicon_turcbu"
      });
      loadVendors();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Trigger manual sync
  const handleSyncVendor = async (vendorId: string) => {
    const toastId = toast.loading("Initiating vendor catalog synchronization...");
    try {
      const result = await vendorApi.triggerSync(vendorId);
      if (result.status === "SUCCESS") {
        toast.success(`Sync Succeeded: Added ${result.productsAdded}, Updated ${result.productsUpdated} products.`, { id: toastId });
      } else {
        toast.error("Sync Completed with issues. Check logs.", { id: toastId });
      }
      loadVendors();
      if (selectedVendor && selectedVendor.id === vendorId) {
        const prodData = await vendorApi.fetchProducts({ vendorId, inCatalog: false });
        setProducts(prodData);
        const logsData = await vendorApi.fetchSyncHistory(vendorId);
        setSyncLogs(logsData);
      }
    } catch (err: any) {
      toast.error("Sync failed: " + err.message, { id: toastId });
    }
  };

  // Import selected products to ReeVibes Catalog
  const handleSendToCatalog = async () => {
    if (selectedProductIds.length === 0) return;
    const toastId = toast.loading(`Importing ${selectedProductIds.length} products to ReeVibes Catalog...`);
    try {
      await vendorApi.importProductsToCatalog(selectedProductIds);
      toast.success(`Successfully imported ${selectedProductIds.length} products to catalog!`, { id: toastId });
      setSelectedProductIds([]);
      // Reload products
      const prodData = await vendorApi.fetchProducts({ vendorId: selectedVendor.id, inCatalog: false });
      setProducts(prodData);
      if (reloadProducts) {
        await reloadProducts();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to import products to catalog", { id: toastId });
    }
  };

  // Delete vendor
  const handleDeleteVendor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor connection? All synced catalog products will be removed.")) return;
    try {
      await vendorApi.deleteVendor(id);
      toast.success("Vendor connection deleted");
      loadVendors();
      if (selectedVendor?.id === id) setSelectedVendor(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vendorApi.saveConnection(selectedVendor.id, connectionForm);
      toast.success("Connection parameters saved successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Open Product Editor
  const handleEditProduct = async (p: any) => {
    try {
      const detail = await vendorApi.fetchProductDetail(p.id);
      setEditingProduct(detail);
      const sizes = detail.sizes || Object.keys(detail.stockPerSize || {});
      const tagList = detail.tag ? detail.tag.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
      setProductForm({
        name: detail.name,
        description: detail.description || "",
        price: String(detail.price || ""),
        originalPrice: String(detail.originalPrice || detail.price || ""),
        discount: detail.discount || 0,
        category: detail.category || "",
        brand: detail.brand || "",
        house: detail.brand || "",
        material: detail.material || "",
        fabric: detail.fabric || "",
        color: detail.color || "",
        gender: detail.gender || "Unisex",
        sku: detail.sku || "",
        status: detail.status || "DRAFT",
        visibility: detail.visibility || "VISIBLE",
        seoTitle: detail.seoTitle || "",
        seoDescription: detail.seoDescription || "",
        seoKeywords: detail.seoKeywords || "",
        images: detail.images || [],
        image: detail.image || (detail.images && detail.images[0]) || "",
        sizes: sizes.length > 0 ? sizes : ["S", "M", "L"],
        stockPerSize: detail.stockPerSize || { S: 10, M: 10, L: 10 },
        tag: detail.tag || "",
        tags: detail.tags || tagList,
        discountLimitBuyers: detail.discountLimitBuyers,
        discountExpiryDate: detail.discountExpiryDate || "",
        discountBuyersCount: detail.discountBuyersCount || 0
      });
      setProductVersions(detail.versions || []);
    } catch (err: any) {
      toast.error("Failed to load product: " + err.message);
    }
  };

  // Save Product Details
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const actual = parseFloat(String(productForm.originalPrice || "").replace(/[^0-9.]/g, ""));
      const disc = parseFloat(String(productForm.price || "").replace(/[^0-9.]/g, ""));
      const discountPct = (actual && disc && actual > disc) ? Math.round(((actual - disc) / actual) * 100) : 0;
      
      // Clean stock values
      const cleanStock = { ...(productForm.stockPerSize || {}) };
      Object.keys(cleanStock).forEach(k => {
        if (cleanStock[k] === "" || cleanStock[k] === undefined) {
          cleanStock[k] = 0;
        }
      });

      const finalForm = {
        ...productForm,
        price: disc,
        originalPrice: actual,
        discount: discountPct,
        brand: productForm.house || productForm.brand,
        images: productForm.images || [],
        image: productForm.image || (productForm.images && productForm.images[0]) || "",
        stockPerSize: cleanStock
      };

      await vendorApi.updateProductDetail(editingProduct.id, finalForm);
      toast.success("Product details updated successfully");
      setEditingProduct(null);
      setViewOnly(false);
      // Reload products
      const prodData = await vendorApi.fetchProducts({ vendorId: selectedVendor.id });
      setProducts(prodData);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Restore Version
  const handleRestoreVersion = async (versionId: number) => {
    if (!confirm("Are you sure you want to restore the product to this version?")) return;
    try {
      await vendorApi.restoreProductVersion(editingProduct.id, versionId);
      toast.success("Product version restored successfully");
      // Reload details
      handleEditProduct(editingProduct);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Category merge/rename submit
  const handleMergeCategories = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryMergeForm.source || !categoryMergeForm.target) return;
    try {
      await vendorApi.mergeCategories(categoryMergeForm.source, categoryMergeForm.target);
      toast.success("Categories merged successfully");
      setCategoryMergeForm({ source: "", target: "" });
      const prodData = await vendorApi.fetchProducts({ vendorId: selectedVendor.id });
      setProducts(prodData);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRenameCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryRenameForm.oldName || !categoryRenameForm.newName) return;
    try {
      await vendorApi.renameCategory(categoryRenameForm.oldName, categoryRenameForm.newName);
      toast.success("Category renamed successfully");
      setCategoryRenameForm({ oldName: "", newName: "" });
      const prodData = await vendorApi.fetchProducts({ vendorId: selectedVendor.id });
      setProducts(prodData);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Bulk actions handler
  const handleBulkAction = async (action: string, value?: string) => {
    if (selectedProductIds.length === 0) {
      toast.warning("Please select at least one product.");
      return;
    }
    try {
      await vendorApi.bulkProductsAction(selectedProductIds, action, value);
      toast.success(`Bulk action '${action}' completed successfully.`);
      setSelectedProductIds([]);
      const prodData = await vendorApi.fetchProducts({ vendorId: selectedVendor.id });
      setProducts(prodData);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "" || p.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesCategory = categoryFilter === "" || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Unique categories list for filters
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  // If loading vendors
  if (loading && vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm text-muted-foreground">Connecting to ReeVibes PostgreSQL Catalog Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. VENDOR LISTING GRID */}
      {!selectedVendor ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-2xl text-foreground">Authorized Vendor Connections</h3>
              <p className="text-xs text-muted-foreground mt-1">Manage external Shopify integrations, cron schedules, and sync queues</p>
            </div>
            <button
              onClick={() => setIsAddingVendor(!isAddingVendor)}
              className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2 rounded-full cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Connect Catalog Source
            </button>
          </div>

          {isAddingVendor && (
            <AdminCard className="space-y-6 animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h4 className="font-serif text-lg text-amber-200">Register Partner Catalog Source</h4>
                <button onClick={() => setIsAddingVendor(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddVendor} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Vendor Company Name</label>
                  <input
                    required
                    placeholder="e.g. Blank Apparel India"
                    className="w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none"
                    value={newVendorForm.companyName}
                    onChange={e => setNewVendorForm({ ...newVendorForm, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contact Liaison</label>
                  <input
                    required
                    placeholder="e.g. Prakash Kumar"
                    className="w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none"
                    value={newVendorForm.contactPerson}
                    onChange={e => setNewVendorForm({ ...newVendorForm, contactPerson: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Liaison Email</label>
                  <input
                    required
                    type="email"
                    placeholder="wholesale@blankapparel.in"
                    className="w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none"
                    value={newVendorForm.email}
                    onChange={e => setNewVendorForm({ ...newVendorForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Phone / WhatsApp Line</label>
                  <input
                    required
                    placeholder="+91 9999911111"
                    className="w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none"
                    value={newVendorForm.phone}
                    onChange={e => setNewVendorForm({ ...newVendorForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Vendor Logo URL</label>
                  <input
                    placeholder="Logo URL"
                    className="w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none"
                    value={newVendorForm.logoUrl}
                    onChange={e => setNewVendorForm({ ...newVendorForm, logoUrl: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-white/5">
                  <AdminButton type="button" variant="outline" onClick={() => setIsAddingVendor(false)}>Cancel</AdminButton>
                  <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer">
                    Register Vendor Account
                  </button>
                </div>
              </form>
            </AdminCard>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {vendors.map(v => {
              const statusColor = v.connectionStatus === "CONNECTED" ? "success" : v.connectionStatus === "ERROR" ? "danger" : "neutral";
              return (
                <div
                  key={v.id}
                  className="liquid-glass relative rounded-3xl overflow-hidden border border-white/10 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col group p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {v.logoUrl ? (
                          <img src={v.logoUrl} alt={v.companyName} className="w-full h-full object-contain" />
                        ) : (
                          <Store className="w-6 h-6 text-accent" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif text-xl text-foreground font-bold tracking-tight">{v.companyName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusChip status={v.connectionStatus || "DISCONNECTED"} tone={statusColor} />
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Sync: {v.syncFrequency || "MANUAL"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteVendor(v.id)}
                        className="text-muted-foreground/30 hover:text-rose-400 p-1.5 transition-colors"
                        title="Delete connection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-y border-white/5 py-4 my-2 text-center text-xs">
                    <div>
                      <div className="text-muted-foreground text-[10px] uppercase font-mono tracking-wider">Total Synced</div>
                      <div className="font-serif text-lg text-white mt-1">{v.totalProducts || 0}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] uppercase font-mono tracking-wider">Published</div>
                      <div className="font-serif text-lg text-emerald-400 mt-1">{v.activeProducts || 0}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] uppercase font-mono tracking-wider">In Queue / Draft</div>
                      <div className="font-serif text-lg text-amber-300 mt-1">{v.draftProducts || 0}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                    <span className="truncate">Last synced: {v.lastSyncTime ? new Date(v.lastSyncTime).toLocaleString() : "Never"}</span>
                  </div>

                  <div className="flex gap-2.5 pt-4">
                    <button
                      onClick={() => handleSyncVendor(v.id)}
                      className="flex-1 bg-white/5 hover:bg-white/15 border border-white/10 text-white py-2 text-[10px] uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Sync Catalog
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVendor(v);
                        setActiveSubTab("overview");
                      }}
                      className="flex-1 bg-accent text-white hover:bg-accent/90 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      Manage Catalog <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. VENDOR DETAILS VIEW (TABS INCLUDED) */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-2 border border-white/10 p-5 rounded-3xl liquid-glass">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedVendor(null)}
                className="p-2 border border-white/10 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-semibold font-mono">Vendor Dashboard</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{selectedVendor.id}</span>
                </div>
                <h3 className="font-serif text-2xl text-foreground font-bold mt-0.5">{selectedVendor.companyName}</h3>
              </div>
            </div>
            <div className="flex gap-2">
              {selectedProductIds.length > 0 && (
                <button
                  onClick={handleSendToCatalog}
                  className="bg-accent text-white hover:bg-accent/90 border border-accent/20 px-5 py-2 text-[11px] uppercase tracking-widest font-bold rounded-full flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-accent/20 animate-in zoom-in-95 duration-200"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Send to Product Catalog ({selectedProductIds.length})
                </button>
              )}
              <button
                onClick={() => handleSyncVendor(selectedVendor.id)}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-full flex items-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Trigger Manual Sync
              </button>
              <button
                onClick={() => {
                  setActiveSubTab("settings");
                }}
                className="bg-surface-3 hover:bg-surface-4 text-white border border-white/10 px-4 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-full flex items-center gap-2 cursor-pointer transition-all"
              >
                <SettingsIcon className="w-3.5 h-3.5" /> Connection Settings
              </button>
            </div>
          </div>

          {/* Sub-Navigation */}
          <div className="flex gap-1 border-b border-white/10 overflow-x-auto pb-px">
            {[
              { id: "overview", label: "Overview", icon: LayoutGrid },
              { id: "catalog", label: "Products Catalog", icon: ShoppingBag },
              { id: "logs", label: "Sync Logs", icon: History }
            ].map(tabItem => {
              const active = activeSubTab === tabItem.id;
              const Icon = tabItem.icon;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveSubTab(tabItem.id)}
                  className={`flex items-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                    active
                      ? "text-accent border-accent bg-accent/5 font-bold"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tabItem.label}
                </button>
              );
            })}
          </div>

          {loadingProducts && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <RefreshCw className="w-6 h-6 text-accent animate-spin" />
              <p className="text-xs text-muted-foreground">Retrieving catalog records from database...</p>
            </div>
          )}

          {!loadingProducts && (
            <div className="space-y-6">
              {/* DETAIL TAB 1: OVERVIEW */}
              {activeSubTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      ["Total Synced Products", products.length, "Catalog total"],
                      ["Published Products", products.filter(p => p.status?.toUpperCase() === "PUBLISHED").length, "Live on shop"],
                      ["Pending Queue", products.filter(p => p.status?.toUpperCase() === "DRAFT").length, "Requires review"],
                      ["Hidden / Disabled", products.filter(p => p.status?.toUpperCase() === "HIDDEN").length, "Remains in DB"]
                    ].map(([k, v, d]) => (
                      <AdminCard key={k as string}>
                        <div className="editorial-label text-muted-foreground">{k as string}</div>
                        <div className="font-serif text-3xl mt-3">{v as number}</div>
                        <div className="text-[10px] text-accent mt-2 uppercase font-mono tracking-wider">{d as string}</div>
                      </AdminCard>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <AdminCard className="lg:col-span-2 space-y-4">
                      <h4 className="font-serif text-lg font-bold border-b border-white/5 pb-2">Recent Synchronizations</h4>
                      {syncLogs.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic py-6 text-center">No logs recorded yet. Run a manual sync.</p>
                      ) : (
                        <div className="space-y-3.5 max-h-80 overflow-y-auto pr-2">
                          {syncLogs.slice(0, 5).map((logItem, idx) => (
                            <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <StatusChip status={logItem.status} tone={logItem.status === "SUCCESS" ? "success" : "danger"} />
                                  <span className="text-[11px] font-mono text-muted-foreground">
                                    {new Date(logItem.runTime).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-xs text-white/80 line-clamp-1 font-mono">{logItem.logMessage?.split("\n").pop()}</p>
                              </div>
                              <div className="text-right text-[10px] text-muted-foreground font-mono">
                                <div>Added: {logItem.productsAdded} | Updated: {logItem.productsUpdated}</div>
                                <div>Duration: {(logItem.durationMs / 1000).toFixed(1)}s</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </AdminCard>

                    <AdminCard className="space-y-4">
                      <h4 className="font-serif text-lg font-bold border-b border-white/5 pb-2">Liaison Contact Cards</h4>
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-3 pb-2 border-b border-white/5"><span className="text-muted-foreground">Email:</span><span className="col-span-2 text-white font-mono">{selectedVendor.email}</span></div>
                        <div className="grid grid-cols-3 pb-2 border-b border-white/5"><span className="text-muted-foreground">Liaison:</span><span className="col-span-2 text-white font-bold">{selectedVendor.contactPerson}</span></div>
                        <div className="grid grid-cols-3 pb-2 border-b border-white/5"><span className="text-muted-foreground">Phone:</span><span className="col-span-2 text-white font-mono">{selectedVendor.phone}</span></div>
                        <div className="grid grid-cols-3 pb-2 border-b border-white/5"><span className="text-muted-foreground">API Sync URL:</span><span className="col-span-2 text-accent truncate block" title={selectedVendor.syncUrl}>{selectedVendor.syncUrl || "None"}</span></div>
                      </div>
                    </AdminCard>
                  </div>
                </div>
              )}

              {/* DETAIL TAB 2: PRODUCTS CATALOG (GRID, FILTERS, BULK ACTIONS, PRODUCT EDITOR) */}
              {activeSubTab === "catalog" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Tabs for All vs Published */}
                  <div className="flex border-b border-white/10 gap-6 text-xs font-bold uppercase tracking-wider mb-4">
                    <button
                      onClick={() => {
                        setCatalogTab("all");
                        setSelectedProductIds([]);
                      }}
                      className={`pb-2.5 transition-colors cursor-pointer ${catalogTab === "all" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      All Products ({products.length})
                    </button>
                    <button
                      onClick={() => {
                        setCatalogTab("published");
                        setSelectedProductIds([]);
                      }}
                      className={`pb-2.5 transition-colors cursor-pointer ${catalogTab === "published" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Published ({products.filter(p => p.status === "PUBLISHED" || !p.status).length})
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="flex flex-wrap gap-2 items-center flex-1 w-full">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search catalog products name, SKU..."
                          className="w-full bg-surface border border-white/10 pl-10 pr-4 py-2 text-xs outline-none text-foreground rounded-lg"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-surface border border-white/10 p-2 text-xs text-foreground outline-none rounded-lg cursor-pointer"
                      >
                        <option value="">All Review Statuses</option>
                        <option value="DRAFT">Queue (Draft)</option>
                        <option value="PUBLISHED">Published (Live)</option>
                        <option value="HIDDEN">Hidden</option>
                        <option value="ARCHIVED">Archived (Removed)</option>
                      </select>

                      <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="bg-surface border border-white/10 p-2 text-xs text-foreground outline-none rounded-lg cursor-pointer"
                      >
                        <option value="">All Categories</option>
                        {uniqueCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bulk Actions Drawer */}
                  {(() => {
                    const filtered = products
                      .filter(p => {
                        if (catalogTab === "published") {
                          return p.status === "PUBLISHED" || !p.status;
                        }
                        return true;
                      })
                      .filter(p => {
                        if (statusFilter && p.status !== statusFilter) return false;
                        if (categoryFilter && p.category !== categoryFilter) return false;
                        if (searchTerm) {
                          const term = searchTerm.toLowerCase();
                          return p.name.toLowerCase().includes(term) || (p.sku && p.sku.toLowerCase().includes(term));
                        }
                        return true;
                      });

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
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleBulkAction("PUBLISH")}
                                className="bg-accent text-white px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-accent/90 transition-all cursor-pointer shadow-lg shadow-accent/20"
                              >
                                Publish Selected
                              </button>
                              <button
                                onClick={() => handleBulkAction("HIDE")}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-full border border-white/10 cursor-pointer"
                              >
                                Hide Selected
                              </button>
                              <button
                                onClick={() => {
                                  const newCat = prompt("Enter the category to move these products to:");
                                  if (newCat) handleBulkAction("CATEGORY", newCat);
                                }}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-full border border-white/10 cursor-pointer"
                              >
                                Move Category
                              </button>
                              <button
                                onClick={() => {
                                  const discInput = prompt("Enter discount percentage (0 to 100):");
                                  if (discInput !== null) handleBulkAction("DISCOUNT", discInput);
                                }}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-full border border-white/10 cursor-pointer"
                              >
                                Apply Discount
                              </button>
                              <button
                                onClick={() => handleBulkAction("DELETE")}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-full cursor-pointer"
                              >
                                Delete Selected
                              </button>
                              <button
                                onClick={() => setSelectedProductIds([])}
                                className="bg-transparent text-muted-foreground hover:text-white text-[10px] uppercase font-bold py-1.5 px-3 rounded-full cursor-pointer"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </div>

                        {filtered.length === 0 ? (
                          <div className="py-20 border-2 border-dashed border-white/10 rounded-3xl text-center">
                            <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No catalog products match current search or filters.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filtered.map(p => {
                              const isChecked = selectedProductIds.includes(String(p.id));
                              const discountPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
                              const isComplete = !!p.name && !!p.description && !!p.category && !!p.gender && 
                                (!!p.tag || (p.tags && p.tags.length > 0)) && !!p.color && 
                                (!!p.material || !!p.fabric) && !!p.house && !!p.originalPrice && 
                                !!p.price && p.sizes && p.sizes.length > 0 && 
                                ((p.images && p.images.length > 0) || !!p.image) && !!p.sku;

                              return (
                                <div
                                  key={p.id}
                                  className={`liquid-glass relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col group ${
                                    isChecked ? "border-accent bg-accent/5" : "border-white/10 hover:border-white/20"
                                  }`}
                                >
                                  {/* Checkbox */}
                                  <button
                                    onClick={() => {
                                      if (isChecked) {
                                        setSelectedProductIds(selectedProductIds.filter(id => id !== String(p.id)));
                                      } else {
                                        setSelectedProductIds([...selectedProductIds, String(p.id)]);
                                      }
                                    }}
                                    className="absolute top-2.5 left-2.5 z-10 p-1.5 bg-black/60 rounded-full hover:bg-black text-white hover:text-accent transition-colors"
                                  >
                                    {isChecked ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4 text-white/50" />}
                                  </button>

                                  {/* Yellow (incomplete) / Blue (complete) Glowing Indicator */}
                                  <div 
                                    title={isComplete ? "Product information fully complete" : "Product information incomplete"}
                                    className={`absolute top-3 right-3 w-3 h-3 rounded-full border border-white/20 z-10 shadow-lg ${isComplete ? "bg-blue-500 shadow-blue-500/80 animate-pulse" : "bg-yellow-500 shadow-yellow-500/80 animate-pulse"}`}
                                  />

                                  {/* Image aspect */}
                                  <div className="aspect-[3/4] bg-zinc-950 overflow-hidden relative">
                                    {p.image ? (
                                      <img src={p.image} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><ShoppingBag className="w-8 h-8" /></div>
                                    )}
                                    <span className="absolute bottom-2.5 left-2.5 bg-black/65 px-2.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                                      {p.category}
                                    </span>
                                    <span className="absolute bottom-2.5 right-2.5">
                                      <StatusChip
                                        status={p.status}
                                        tone={
                                          p.status === "PUBLISHED" ? "success" : p.status === "HIDDEN" ? "neutral" : p.status === "DRAFT" ? "warn" : "danger"
                                        }
                                      />
                                    </span>
                                  </div>

                                  {/* Content */}
                                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2 text-xs">
                                    <div>
                                      <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-mono">
                                        <span>{p.brand}</span>
                                        <span className="text-accent">{p.type || p.category || "Apparel"}</span>
                                      </div>
                                      <h5 className="font-serif text-sm font-bold text-white truncate mt-0.5" title={p.name}>{p.name}</h5>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        {p.discount > 0 ? (
                                          <>
                                            <span className="font-serif font-bold text-accent">₹{discountPrice.toLocaleString()}</span>
                                            <span className="line-through text-muted-foreground text-[10px]">₹{p.price.toLocaleString()}</span>
                                          </>
                                        ) : (
                                          <span className="font-serif font-bold text-white">₹{p.price.toLocaleString()}</span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground mt-1.5 font-mono space-y-0.5">
                                        <div>Sizes: <span className="text-white">{p.sizes && p.sizes.length > 0 ? p.sizes.join(", ") : "—"}</span></div>
                                        <div className="flex justify-between items-center mt-1">
                                          <span>Stock: {p.totalStock ?? 0} units</span>
                                          <span className={`font-bold ${p.totalStock > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                            {p.totalStock > 0 ? "In Stock" : "Out of Stock"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => {
                                        setViewOnly(true);
                                        handleEditProduct(p);
                                      }}
                                      className="w-full border border-white/10 hover:border-accent hover:text-accent bg-transparent py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <Eye className="w-3.5 h-3.5" /> View Details
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* DETAIL TAB 3: CATEGORY MAPPING (MERGE & RENAME) */}
              {activeSubTab === "categories" && (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                  <AdminCard className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <Layers3 className="w-5 h-5 text-accent" />
                      <h4 className="font-serif text-lg font-bold">Merge Catalog Categories</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      Combine all product catalog items currently listed under the Source Category into the Target Category. This helps clean up crawled taxonomy.
                    </p>
                    <form onSubmit={handleMergeCategories} className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground">Source Category</label>
                        <select
                          required
                          value={categoryMergeForm.source}
                          onChange={e => setCategoryMergeForm({ ...categoryMergeForm, source: e.target.value })}
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer"
                        >
                          <option value="">-- Select Source --</option>
                          {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground">Target Category</label>
                        <input
                          required
                          placeholder="e.g. Tops & Corsets"
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none"
                          value={categoryMergeForm.target}
                          onChange={e => setCategoryMergeForm({ ...categoryMergeForm, target: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer text-xs">
                        Merge Categories
                      </button>
                    </form>
                  </AdminCard>

                  <AdminCard className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <Edit2 className="w-5 h-5 text-accent" />
                      <h4 className="font-serif text-lg font-bold">Rename Category</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      Rename a specific category globally. All products under the old category will immediately transition to the new name.
                    </p>
                    <form onSubmit={handleRenameCategory} className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground">Old Name</label>
                        <select
                          required
                          value={categoryRenameForm.oldName}
                          onChange={e => setCategoryRenameForm({ ...categoryRenameForm, oldName: e.target.value })}
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer"
                        >
                          <option value="">-- Select Category --</option>
                          {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground">New Category Name</label>
                        <input
                          required
                          placeholder="New Category Name"
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none"
                          value={categoryRenameForm.newName}
                          onChange={e => setCategoryRenameForm({ ...categoryRenameForm, newName: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer text-xs">
                        Rename Category
                      </button>
                    </form>
                  </AdminCard>
                </div>
              )}

              {/* DETAIL TAB 4: BRAND INDEX */}
              {activeSubTab === "brands" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
                  {uniqueBrands.map(brand => {
                    const count = products.filter(p => p.brand === brand).length;
                    return (
                      <AdminCard key={brand} className="flex justify-between items-center p-4">
                        <div>
                          <div className="text-[10px] uppercase font-mono text-accent">Authorized Brand</div>
                          <h5 className="font-serif text-base font-bold text-white mt-0.5">{brand}</h5>
                        </div>
                        <span className="bg-white/5 border border-white/10 text-white font-mono text-xs px-3 py-1.5 rounded-full">
                          {count} Products
                        </span>
                      </AdminCard>
                    );
                  })}
                </div>
              )}

              {/* DETAIL TAB 5: DASHBOARD ANALYTICS */}
              {activeSubTab === "analytics" && analytics && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminCard>
                      <div className="editorial-label text-muted-foreground">Total Scraped Products</div>
                      <div className="font-serif text-3xl mt-3">{analytics.totalProducts}</div>
                    </AdminCard>
                    <AdminCard>
                      <div className="editorial-label text-muted-foreground">Published Products</div>
                      <div className="font-serif text-3xl mt-3 text-emerald-400">{analytics.publishedProducts}</div>
                    </AdminCard>
                    <AdminCard>
                      <div className="editorial-label text-muted-foreground">Out / Low Stock Warnings</div>
                      <div className="font-serif text-3xl mt-3 text-rose-400">{analytics.lowStockCount}</div>
                    </AdminCard>
                    <AdminCard>
                      <div className="editorial-label text-muted-foreground">Average Catalog Price</div>
                      <div className="font-serif text-3xl mt-3 text-accent">₹{analytics.averagePrice}</div>
                    </AdminCard>
                  </div>

                  <AdminCard className="space-y-6">
                    <h4 className="font-serif text-xl font-bold border-b border-white/5 pb-2">Catalog Health Indicators</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Publish Rate</h5>
                        <div className="h-4 bg-zinc-900 border border-white/5 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_#d4af37] transition-all duration-500"
                            style={{ width: `${(analytics.publishedProducts / (analytics.totalProducts || 1)) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{((analytics.publishedProducts / (analytics.totalProducts || 1)) * 100).toFixed(1)}% Published</span>
                          <span>{analytics.totalProducts - analytics.publishedProducts} Awaiting Review</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Stock Coverage</h5>
                        <div className="h-4 bg-zinc-900 border border-white/5 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-500"
                            style={{ width: `${((analytics.totalProducts - analytics.lowStockCount) / (analytics.totalProducts || 1)) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{((analytics.totalProducts - analytics.lowStockCount) / (analytics.totalProducts || 1)).toFixed(1)}% Healthy Coverage</span>
                          <span>{analytics.lowStockCount} Low stock items</span>
                        </div>
                      </div>
                    </div>
                  </AdminCard>
                </div>
              )}

              {/* DETAIL TAB 6: SYNC LOGS */}
              {activeSubTab === "logs" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <AdminCard className="space-y-4">
                    <h4 className="font-serif text-lg font-bold border-b border-white/5 pb-2">Full Integration History</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-muted-foreground font-semibold">
                            <th className="py-2.5">Sync Time</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Added</th>
                            <th>Updated</th>
                            <th>Removed</th>
                            <th>Logs</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {syncLogs.map((logItem, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 font-mono">{new Date(logItem.runTime).toLocaleString()}</td>
                              <td><StatusChip status={logItem.status} tone={logItem.status === "SUCCESS" ? "success" : "danger"} /></td>
                              <td className="font-mono">{(logItem.durationMs / 1000).toFixed(1)}s</td>
                              <td className="font-mono text-emerald-400 font-bold">+{logItem.productsAdded}</td>
                              <td className="font-mono text-blue-400">~{logItem.productsUpdated}</td>
                              <td className="font-mono text-rose-400">-{logItem.productsRemoved}</td>
                              <td>
                                <button
                                  onClick={() => alert(logItem.logMessage)}
                                  className="text-accent hover:underline cursor-pointer"
                                >
                                  View Output
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AdminCard>
                </div>
              )}

              {/* SETTINGS SUBTAB */}
              {activeSubTab === "settings" && (
                <AdminCard className="space-y-4 animate-in fade-in duration-300">
                  <h4 className="font-serif text-lg font-bold border-b border-white/5 pb-2">Shopify Connection Parameters</h4>
                  <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Shopify Products Feed URL</label>
                      <input
                        required
                        className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none font-mono"
                        value={connectionForm.syncUrl}
                        onChange={e => setConnectionForm({ ...connectionForm, syncUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Auto-Sync Cycle</label>
                      <select
                        value={connectionForm.syncFrequency}
                        onChange={e => setConnectionForm({ ...connectionForm, syncFrequency: e.target.value })}
                        className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground outline-none rounded-lg cursor-pointer"
                      >
                        <option value="MANUAL">Manual Trigger Only</option>
                        <option value="HOURLY">Hourly Chrono Sync</option>
                        <option value="DAILY">Daily at 2:00 AM</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">API Passphrase Key (Optional)</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••"
                        className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none font-mono"
                        value={connectionForm.apiKey}
                        onChange={e => setConnectionForm({ ...connectionForm, apiKey: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer text-xs">
                      Save Credentials
                    </button>
                  </form>
                </AdminCard>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. PRODUCT EDITOR & VERSION HISTORY RESTORE MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass max-w-5xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                {viewOnly ? (
                  <Eye className="w-5 h-5 text-accent" />
                ) : (
                  <Edit2 className="w-5 h-5 text-accent animate-pulse" />
                )}
                <div>
                  <h3 className="font-serif text-2xl font-bold">
                    {viewOnly ? "Catalog Product Viewer" : "Catalog Product Editor"}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {editingProduct.id}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (viewOnly) {
                    setEditingProduct(null);
                    setViewOnly(false);
                  } else {
                    setShowCloseConfirm(true);
                  }
                }} 
                className="text-muted-foreground hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Product Info Form */}
              <form onSubmit={handleSaveProduct} className="lg:col-span-2 space-y-6">
                <fieldset disabled={viewOnly} className="space-y-6 border-0 p-0 m-0">
                <div className="grid md:grid-cols-2 gap-6 text-xs">
                  {/* Left Column: Basic Details & Classification */}
                  <div className="space-y-4">
                    {/* 1. Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Product Name</label>
                      <input
                        required
                        className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                        value={productForm.name}
                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      />
                    </div>

                    {/* 2. Description */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Description</label>
                      <textarea
                        rows={4}
                        className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent resize-none leading-relaxed"
                        value={productForm.description}
                        onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                      />
                    </div>

                    {/* 3. Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Category</label>
                        <select
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer focus:border-accent"
                          value={["Tops", "Bottoms", "Couture", "Accessories", "Shirts", "T-Shirts"].includes(productForm.category) ? productForm.category : "Other"}
                          onChange={e => {
                            const val = e.target.value;
                            if (val === "Other") {
                              setProductForm({ ...productForm, category: "" });
                            } else {
                              setProductForm({ ...productForm, category: val });
                            }
                          }}
                        >
                          <option value="Tops">Tops</option>
                          <option value="Bottoms">Bottoms</option>
                          <option value="Couture">Couture</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Shirts">Shirts</option>
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Other">Other (Type custom)...</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Gender</label>
                        <select
                          value={productForm.gender}
                          onChange={e => setProductForm({ ...productForm, gender: e.target.value })}
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer focus:border-accent"
                        >
                          <option value="Women">Women</option>
                          <option value="Men">Men</option>
                          <option value="Unisex">Unisex</option>
                        </select>
                      </div>
                    </div>

                    {/* Custom Category Input */}
                    {!["Tops", "Bottoms", "Couture", "Accessories", "Shirts", "T-Shirts"].includes(productForm.category) && (
                      <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-accent">Custom Category Name</label>
                        <input
                          required
                          placeholder="Enter new category..."
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                          value={productForm.category}
                          onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                        />
                      </div>
                    )}

                    {/* 4. Tag Builder & Color */}
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Product Tags</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type a tag (e.g. Hoodies, Cargos, Summer) and press Enter"
                            className="flex-1 bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = tagInput.trim();
                                if (val && !(productForm.tags || []).includes(val)) {
                                  const updated = [...(productForm.tags || []), val];
                                  setProductForm({ ...productForm, tags: updated, tag: updated.join(", ") });
                                  setTagInput("");
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const val = tagInput.trim();
                              if (val && !(productForm.tags || []).includes(val)) {
                                const updated = [...(productForm.tags || []), val];
                                setProductForm({ ...productForm, tags: updated, tag: updated.join(", ") });
                                setTagInput("");
                              }
                            }}
                            className="bg-accent/20 border border-accent/30 text-accent px-4 text-xs font-bold rounded-lg hover:bg-accent/30 transition-colors cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                        
                        {/* Tags list with remove buttons */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(productForm.tags || []).length === 0 ? (
                            <span className="text-[10px] text-muted-foreground italic">No tags added yet.</span>
                          ) : (
                            (productForm.tags || []).map((t: string) => (
                              <span key={t} className="inline-flex items-center gap-1 bg-accent/10 border border-accent/25 text-accent text-[10px] px-2.5 py-1 rounded-full font-semibold">
                                {t}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (productForm.tags || []).filter((x: string) => x !== t);
                                    setProductForm({ ...productForm, tags: updated, tag: updated.join(", ") });
                                  }}
                                  className="text-accent hover:text-rose-400 font-bold ml-1 transition-colors"
                                >
                                  ✕
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Colour</label>
                        <input
                          placeholder="e.g. Noir, Beige, Emerald"
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                          value={productForm.color || ""}
                          onChange={e => setProductForm({ ...productForm, color: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* 5. Fabric Material & Brand/House */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Fabric Material</label>
                        <input
                          placeholder="e.g. 100% Silk, Cotton"
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                          value={productForm.material || ""}
                          onChange={e => setProductForm({ ...productForm, material: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Brand / House</label>
                        <input
                          required
                          className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                          value={productForm.house || productForm.brand || ""}
                          onChange={e => setProductForm({ ...productForm, house: e.target.value, brand: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* 6. Review Queue Status */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Review Queue Status</label>
                      <select
                        value={productForm.status}
                        onChange={e => setProductForm({ ...productForm, status: e.target.value })}
                        className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer focus:border-accent"
                      >
                        <option value="DRAFT">Queue (Draft)</option>
                        <option value="PUBLISHED">Published (Live)</option>
                        <option value="HIDDEN">Hidden</option>
                        <option value="ARCHIVED">Archived (Removed)</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column: Pricing, Inventory, Media & Assets */}
                  <div className="space-y-4">
                    {/* Pricing Fields */}
                    <div className="p-4 border border-white/10 rounded-2xl bg-white/5 space-y-4">
                      <h4 className="text-[10px] uppercase tracking-wider text-accent font-bold">Pricing, Discount & Expiry Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Actual Price (INR)</label>
                          <input
                            required
                            placeholder="e.g. ₹1,25,000 or 125000"
                            className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                            value={productForm.originalPrice || ""}
                            onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Discounted Price (INR)</label>
                          <input
                            required
                            placeholder="e.g. ₹85,000 or 85000"
                            className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent"
                            value={productForm.price || ""}
                            onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      {/* Discount Expiry Options */}
                      {parseFloat(String(productForm.price || "").replace(/[^0-9.]/g, "")) < parseFloat(String(productForm.originalPrice || "").replace(/[^0-9.]/g, "")) && (
                        <div className="border-t border-white/5 pt-3 space-y-3 animate-in fade-in duration-200">
                          <div className="text-[10px] uppercase font-bold text-accent">Discount Reversion Rules</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-muted-foreground">Revert after N sales</label>
                              <input
                                type="number"
                                placeholder="e.g. 50"
                                className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                                value={productForm.discountLimitBuyers || ""}
                                onChange={e => setProductForm({ ...productForm, discountLimitBuyers: e.target.value ? parseInt(e.target.value) : undefined })}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-muted-foreground">Revert on Date</label>
                              <input
                                type="date"
                                className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                                value={productForm.discountExpiryDate || ""}
                                onChange={e => setProductForm({ ...productForm, discountExpiryDate: e.target.value })}
                              />
                            </div>
                          </div>
                          {productForm.discountBuyersCount > 0 && (
                            <div className="text-[10px] text-muted-foreground italic">
                              Current buyers at discount: <span className="text-white font-bold">{productForm.discountBuyersCount}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Discount Percentage Display */}
                      {(() => {
                        const actual = parseFloat(String(productForm.originalPrice || "").replace(/[^0-9.]/g, ""));
                        const disc = parseFloat(String(productForm.price || "").replace(/[^0-9.]/g, ""));
                        const pct = (actual && disc && actual > disc) ? Math.round(((actual - disc) / actual) * 100) : 0;
                        return (
                          <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                            <span className="text-muted-foreground font-semibold">Calculated Discount:</span>
                            <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded-full ${pct > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                              {pct > 0 ? `${pct}% Off` : "0% (No Discount)"}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Sizes & Quantity variant boxes */}
                    <div className="p-4 border border-white/10 rounded-2xl bg-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] uppercase tracking-wider text-accent font-bold">Sizes & Stock Levels</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const currentSizes = productForm.sizes || [];
                            // Add a new empty size at the end
                            setProductForm({
                              ...productForm,
                              sizes: [...currentSizes, ""],
                              stockPerSize: { ...(productForm.stockPerSize || {}), "": 10 } as any
                            });
                          }}
                          className="text-[9px] bg-accent text-white py-1 px-3 rounded-full font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors cursor-pointer"
                        >
                          + Add Size
                        </button>
                      </div>

                      {(productForm.sizes || []).length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-2">No sizes defined. Add at least one size.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                          {(productForm.sizes || []).map((size: string, idx: number) => (
                            <div key={idx} className="p-3 border border-white/10 rounded-xl bg-zinc-950/80 flex flex-col gap-2 relative">
                              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                                <span>Size Variant #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedSizes = (productForm.sizes || []).filter((_: string, i: number) => i !== idx);
                                    const updatedStock = { ...(productForm.stockPerSize || {}) };
                                    delete updatedStock[size];
                                    setProductForm({
                                      ...productForm,
                                      sizes: updatedSizes,
                                      stockPerSize: updatedStock
                                    });
                                  }}
                                  className="text-rose-400 hover:text-rose-500 cursor-pointer text-xs"
                                  title="Delete size variant"
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] text-muted-foreground uppercase font-bold">Size Name</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. S, XL, 32"
                                    className="w-full bg-surface border border-white/10 p-1.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono text-center"
                                    value={size}
                                    onChange={e => {
                                      const newSizeName = e.target.value;
                                      const oldSizeName = productForm.sizes[idx];
                                      const updatedSizes = [...productForm.sizes];
                                      updatedSizes[idx] = newSizeName;

                                      const updatedStock = { ...productForm.stockPerSize };
                                      const qty = updatedStock[oldSizeName] !== undefined ? updatedStock[oldSizeName] : 10;
                                      delete updatedStock[oldSizeName];
                                      if (newSizeName) {
                                        updatedStock[newSizeName] = qty;
                                      }

                                      setProductForm({
                                        ...productForm,
                                        sizes: updatedSizes,
                                        stockPerSize: updatedStock
                                      });
                                    }}
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] text-muted-foreground uppercase font-bold">Stock Qty</label>
                                  <input
                                    type="text"
                                    placeholder="Qty"
                                    className="w-full bg-surface border border-white/10 p-1.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono text-center"
                                    value={(productForm.stockPerSize || {})[size] !== undefined ? String(productForm.stockPerSize[size]) : ""}
                                    onChange={e => {
                                      const val = e.target.value;
                                      if (val === "" || /^\d+$/.test(val)) {
                                        setProductForm({
                                          ...productForm,
                                          stockPerSize: {
                                            ...(productForm.stockPerSize || {}),
                                            [size]: val === "" ? "" : parseInt(val)
                                          } as any
                                        });
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Multi-Image URL Manager */}
                    <div className="p-4 border border-white/10 rounded-2xl bg-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] uppercase tracking-wider text-accent font-bold font-serif">Product Images ({productForm.images ? productForm.images.length : 0})</h4>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-muted-foreground">Add Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                            value={imageUrlInput}
                            onChange={e => setImageUrlInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = imageUrlInput.trim();
                                if (val && !(productForm.images || []).includes(val)) {
                                  const updated = [...(productForm.images || []), val];
                                  setProductForm({ 
                                    ...productForm, 
                                    images: updated,
                                    image: productForm.image || val
                                  });
                                  setImageUrlInput("");
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const val = imageUrlInput.trim();
                              if (val && !(productForm.images || []).includes(val)) {
                                const updated = [...(productForm.images || []), val];
                                setProductForm({ 
                                  ...productForm, 
                                  images: updated,
                                  image: productForm.image || val
                                });
                                setImageUrlInput("");
                              }
                            }}
                            className="bg-accent/20 border border-accent/30 text-accent px-4 text-xs font-bold rounded-lg hover:bg-accent/30 transition-colors cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Image List with Previews & Reordering */}
                      {(productForm.images || []).length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-2">No images added. Please add at least one image URL.</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                          {(productForm.images || []).map((img: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 p-2 border border-white/10 rounded-xl bg-zinc-950/80 backdrop-blur">
                              <img src={img} className="w-10 h-14 object-cover rounded-lg border border-white/10" onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200"; }} />
                              
                              {/* Star button to set as primary thumbnail */}
                              <button
                                type="button"
                                onClick={() => {
                                  setProductForm({ ...productForm, image: img });
                                }}
                                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                title="Set as product thumbnail"
                              >
                                {productForm.image === img ? (
                                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                ) : (
                                  <Star className="w-4 h-4 text-white/40 hover:text-amber-400" />
                                )}
                              </button>

                              <span className="flex-1 text-[9px] font-mono text-muted-foreground truncate">{img}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const next = [...(productForm.images || [])];
                                    [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
                                    setProductForm({ ...productForm, images: next, image: next[0] });
                                  }}
                                  className="p-1 hover:text-accent disabled:opacity-30 text-xs cursor-pointer"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (productForm.images || []).length - 1}
                                  onClick={() => {
                                    const next = [...(productForm.images || [])];
                                    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                                    setProductForm({ ...productForm, images: next, image: next[0] });
                                  }}
                                  className="p-1 hover:text-accent disabled:opacity-30 text-xs cursor-pointer"
                                >
                                  ▼
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (productForm.images || []).filter((_: string, i: number) => i !== idx);
                                    setProductForm({ ...productForm, images: next, image: next[0] || "" });
                                  }}
                                  className="p-1 text-rose-400 hover:text-rose-500 text-xs ml-1 cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SKU Code */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">SKU Code</label>
                      <input
                        required
                        className="w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono"
                        value={productForm.sku}
                        onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  {viewOnly ? (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingProduct(null);
                        setViewOnly(false);
                      }}
                      className="border border-white/10 text-foreground px-6 py-2.5 rounded-full hover:bg-white/5 font-semibold text-xs cursor-pointer"
                    >
                      Close
                    </button>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        onClick={() => setShowCloseConfirm(true)}
                        className="border border-white/10 text-foreground px-5 py-2.5 rounded-full hover:bg-white/5 font-semibold text-xs cursor-pointer"
                      >
                        Discard
                      </button>
                      <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer">
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </form>

              {/* Version History Sidebar */}
              <div className="space-y-4 border-l border-white/10 pl-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <History className="w-5 h-5 text-accent" />
                  <h4 className="font-serif text-lg font-bold">Version Audit History</h4>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Every synchronization change detects and backs up variations. Restore past pricing or descriptions instantly.
                </p>

                {productVersions.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground italic text-xs">
                    No modifications logged yet. Current version is initial sync state.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 font-sans">
                    {productVersions.map((vNode: any, idx: number) => (
                      <div key={idx} className="border border-white/10 rounded-2xl p-3.5 bg-white/5 text-xs space-y-2 relative">
                        <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {new Date(vNode.versionTimestamp).toLocaleString()}
                          </span>
                          {!viewOnly && (
                            <button
                              onClick={() => handleRestoreVersion(vNode.id)}
                              className="text-accent hover:underline font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <Undo className="w-3 h-3" /> Restore
                            </button>
                          )}
                        </div>
                        <div className="space-y-1 font-mono text-[10px] text-muted-foreground">
                          <div className="flex justify-between"><span>Price:</span><span className="text-white">₹{vNode.price}</span></div>
                          <div className="flex justify-between"><span>Category:</span><span className="text-white">{vNode.category}</span></div>
                          <div className="flex justify-between"><span>Brand:</span><span className="text-white">{vNode.brand}</span></div>
                          <div className="flex justify-between"><span>Stock Summary:</span><span className="text-amber-200">{vNode.stockSummary}</span></div>
                        </div>
                        {vNode.description && (
                          <p className="text-[10px] text-muted-foreground italic line-clamp-2 mt-2 leading-relaxed">
                            "{vNode.description}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Unsaved Changes Confirmation Modal */}
            {showCloseConfirm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-zinc-950 border border-amber-500/20 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
                  <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold text-white">Unsaved Changes</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You have unsaved changes in this product catalog entry. Do you want to save them before closing?
                  </p>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCloseConfirm(false);
                        document.querySelector("form")?.requestSubmit();
                      }}
                      className="bg-accent text-white py-2 px-4 rounded-xl text-xs font-bold hover:bg-accent/90 cursor-pointer"
                    >
                      Save & Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCloseConfirm(false);
                        setEditingProduct(null);
                        setViewOnly(false);
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCloseConfirm(false)}
                      className="bg-white/10 hover:bg-white/20 text-foreground py-2 px-4 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Keep Editing
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
