import { useState, useEffect } from "react";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import {
  ShoppingBag, Truck, RefreshCw, Users, Ticket, Star, Store, BarChart3,
  Sparkles, LayoutGrid, Plus, Edit2, Trash2, Check, X, ShieldAlert,
  ArrowUpRight, IndianRupee, Search, Shield, Eye, EyeOff, PlusCircle
} from "lucide-react";
import { AdminCard, AdminButton, StatusChip } from "./AdminLayout";
import { PRODUCTS } from "@/lib/data";

export function ShopAdminPortal({ tab }: { tab: string }) {
  const { state, createProduct, updateProduct, deleteProduct, updateOrderStatus, approveReturn, rejectReturn, suspendCustomer, reactivateCustomer, addCoupon, removeCoupon, moderateReview, createVendor, deleteVendor, addWalletCredit } = usePortal();

  // Dynamic products list from state
  const productsList = state.products || [];
  const ordersList = Object.entries(state.orders).flatMap(([userId, list]) =>
    list.map(o => ({ ...o, userId, customerName: state.users.find(u => u.id === userId)?.firstName + " " + (state.users.find(u => u.id === userId)?.lastName || "") }))
  );
  const returnsList = state.returns || [];
  const customersList = state.users || [];
  const couponsList = state.coupons || [];
  const vendorsList = state.vendors || [];

  // Local UI States
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<any | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string;
    house: string;
    price: string;
    image: string;
    tag: string;
    gender: string;
    category: string;
    sizes: string[];
    stockPerSize: Record<string, number>;
    sku: string;
    originalPrice: string;
  }>({
    name: "", house: "", price: "", image: "", tag: "", gender: "Women", category: "Tops",
    sizes: ["S", "M", "L"], stockPerSize: { S: 10, M: 10, L: 10 }, sku: "", originalPrice: ""
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [couponForm, setCouponForm] = useState({
    code: "", discount: 10, type: "percentage", expiryDate: "2026-12-31", usageLimit: 100, userEligibility: "All"
  });
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);

  const [vendorForm, setVendorForm] = useState({
    companyName: "", contactPerson: "", email: "", phone: ""
  });
  const [isAddingVendor, setIsAddingVendor] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Liquid UI Modal state
  const [modal, setModal] = useState<{ type: string; title: string; desc: string; action: () => void } | null>(null);

  const triggerModal = (type: "success" | "warning" | "danger", title: string, desc: string, action: () => void) => {
    setModal({ type, title, desc, action });
  };

  // --- Handlers ---
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm as any);
      setEditingProduct(null);
      setIsAddingProduct(false);
      triggerModal("success", "Product Updated", "The product has been successfully updated in the catalog.", () => {});
    } else {
      createProduct(productForm as any);
      setIsAddingProduct(false);
      triggerModal("success", "Product Created", "The product has been added and published in the store.", () => {});
    }
    setProductForm({
      name: "", house: "", price: "", image: "", tag: "", gender: "Women", category: "Tops",
      sizes: ["S", "M", "L"], stockPerSize: { S: 10, M: 10, L: 10 }, sku: "", originalPrice: ""
    });
  };

  const handleEditProduct = (p: any) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      house: p.house,
      price: p.price,
      image: p.image,
      tag: p.tag || "",
      gender: p.gender || "Women",
      category: p.category || "Tops",
      sizes: p.sizes || ["S", "M", "L"],
      stockPerSize: p.stockPerSize || { S: 10, M: 10, L: 10 },
      sku: p.sku || `SKU-${Math.floor(10000 + Math.random()*90000)}`,
      originalPrice: p.originalPrice || p.price
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (id: string) => {
    triggerModal("danger", "Delete Product", "Are you sure you want to permanently delete this product? This action cannot be undone.", () => {
      deleteProduct(id);
    });
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm as any);
    setIsAddingCoupon(false);
    setCouponForm({ code: "", discount: 10, type: "percentage", expiryDate: "2026-12-31", usageLimit: 100, userEligibility: "All" });
    triggerModal("success", "Coupon Created", "New coupon successfully generated and active.", () => {});
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVendor(vendorForm);
    setIsAddingVendor(false);
    setVendorForm({ companyName: "", contactPerson: "", email: "", phone: "" });
    triggerModal("success", "Vendor Registered", "New vendor added to the portal.", () => {});
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

      {/* Selected Customer Details Modal */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="liquid-glass max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-2xl">Customer Curation Dossier</h3>
              </div>
              <button onClick={() => setSelectedCustomerDetails(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Account Identity</h4>
                <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">ID:</span><span className="col-span-2 font-mono">{selectedCustomerDetails.id}</span></div>
                <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Name:</span><span className="col-span-2 font-semibold">{selectedCustomerDetails.firstName} {selectedCustomerDetails.lastName}</span></div>
                <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Email:</span><span className="col-span-2">{selectedCustomerDetails.email}</span></div>
                <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Phone:</span><span className="col-span-2">{selectedCustomerDetails.phone || "—"}</span></div>
                <div className="grid grid-cols-3 border-b border-white/5 pb-2"><span className="text-muted-foreground">Registered:</span><span className="col-span-2">{selectedCustomerDetails.registeredAt}</span></div>
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

            {/* Orders Summary */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Order History</h4>
              {(state.orders[selectedCustomerDetails.id] ?? []).length === 0 ? (
                <p className="text-muted-foreground italic">No orders placed yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 divide-y divide-white/5">
                  {(state.orders[selectedCustomerDetails.id] ?? []).map((ord: any) => (
                    <div key={ord.id} className="pt-2 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold font-mono">{ord.id} · {ord.date}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {ord.items.map((it: any) => `${it.name} (${it.selectedSize}) x${it.qty}`).join(", ")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent">₹{ord.total.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">{ord.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <AdminButton variant="outline" onClick={() => setSelectedCustomerDetails(null)}>Close dossier</AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* 1. OVERVIEW & ANALYTICS */}
      {tab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ["Live Users", "148", "Active right now"],
              ["Active Sessions", "3,489", "Today's traffic"],
              ["Orders Today", ordersList.filter(o => o.date === new Date().toISOString().slice(0, 10)).length.toString(), "Real-time updates"],
              ["Revenue Today", "₹" + ordersList.filter(o => o.date === new Date().toISOString().slice(0, 10)).reduce((sum, o) => sum + o.total, 0).toLocaleString(), "Paid orders"],
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

      {/* 2. HOMEPAGE LAYOUT */}
      {tab === "homepage" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <AdminCard className="space-y-6">
            <div className="flex justify-between items-center border-b border-border-subtle pb-4">
              <div>
                <h3 className="font-serif text-xl">Hero & Promotional Banners</h3>
                <p className="text-xs text-muted-foreground mt-1">Configure luxury slideshows and offer banners</p>
              </div>
              <span className="text-[10px] uppercase bg-accent/20 text-accent px-2.5 py-1 tracking-widest">Live Preview Enabled</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {state.homepageLayout.heroBanners.map(b => (
                <div key={b.id} className="border border-border-subtle p-4 rounded bg-surface-2 space-y-3">
                  <img src={b.image} className="w-full h-36 object-cover rounded" />
                  <div className="text-sm font-serif">{b.title}</div>
                  <div className="text-xs text-muted-foreground">{b.subtitle}</div>
                  <div className="flex justify-end gap-2">
                    <AdminButton variant="outline" className="text-xs py-1 px-3">Edit Frame</AdminButton>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      )}

      {/* 3. PRODUCTS CATALOG */}
      {tab === "products" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search catalog by name, brand, SKU…"
                className="w-full bg-surface border border-border-subtle pl-10 pr-4 py-2.5 text-xs outline-none focus:border-accent"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: "", house: "", price: "", image: "", tag: "", gender: "Women", category: "Tops",
                  sizes: ["S", "M", "L"], stockPerSize: { S: 10, M: 10, L: 10 }, sku: `SKU-${Math.floor(10000 + Math.random()*90000)}`, originalPrice: ""
                });
                setIsAddingProduct(!isAddingProduct);
              }}
              className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> {isAddingProduct ? "Collapse Form" : "Create Product"}
            </button>
          </div>

          {isAddingProduct && (
            <AdminCard className="space-y-6 animate-in slide-in-from-top-4 duration-200">
              <h3 className="font-serif text-xl">{editingProduct ? "Edit Product" : "Publish New Product"}</h3>
              <form onSubmit={handleProductSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Product Name</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">House / Brand</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={productForm.house} onChange={e => setProductForm({...productForm, house: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">SKU Code</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={productForm.sku} onChange={e => setProductForm({...productForm, sku: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Price (INR with ₹)</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" placeholder="₹12,500" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Image URL</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Tag (Optional)</label>
                  <input className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" placeholder="New, Limited, Classic" value={productForm.tag} onChange={e => setProductForm({...productForm, tag: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Gender Designation</label>
                  <select className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={productForm.gender} onChange={e => setProductForm({...productForm, gender: e.target.value})}>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">Category</label>
                  <select className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value as any})}>
                    <option value="Shirts">Shirts</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Couture">Couture</option>
                  </select>
                </div>

                {/* Sizing Stock Box Manager */}
                <div className="md:col-span-2 p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider">Inventory Variants (Sizes & Stocks)</span>
                    <button
                      type="button"
                      onClick={() => {
                        const s = prompt("Enter new size/pant waist code (e.g. XS, M, 30, 32):");
                        if (s && !productForm.sizes.includes(s)) {
                          setProductForm({
                            ...productForm,
                            sizes: [...productForm.sizes, s],
                            stockPerSize: { ...productForm.stockPerSize, [s]: 10 }
                          });
                        }
                      }}
                      className="text-xs bg-accent text-white py-1 px-3 rounded-full font-bold uppercase tracking-wider"
                    >
                      + Add Size Box
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {productForm.sizes.map(size => (
                      <div key={size} className="p-3 border border-white/10 rounded-xl bg-zinc-950 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold">Size: {size}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setProductForm({
                                ...productForm,
                                sizes: productForm.sizes.filter(x => x !== size),
                                stockPerSize: Object.fromEntries(Object.entries(productForm.stockPerSize).filter(([k]) => k !== size))
                              });
                            }}
                            className="text-rose-400 hover:text-rose-500"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="number"
                          placeholder="Stock qty"
                          className="bg-transparent border-b border-white/20 text-xs py-1 outline-none text-foreground"
                          value={(productForm.stockPerSize as any)[size] ?? 0}
                          onChange={e => {
                            setProductForm({
                              ...productForm,
                              stockPerSize: {
                                ...productForm.stockPerSize,
                                [size]: Number(e.target.value)
                              }
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-border-subtle">
                  <AdminButton type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>Cancel</AdminButton>
                  <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90">{editingProduct ? "Save Changes" : "Publish Product"}</button>
                </div>
              </form>
            </AdminCard>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.house.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))).map(p => (
              <div key={p.id} className="liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden bg-zinc-950 relative">
                  <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {p.tag && <span className="absolute top-3 left-3 bg-accent/95 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5">{p.tag}</span>}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="editorial-label text-muted-foreground text-[10px]">{p.house} · {p.category}</div>
                    <h4 className="font-serif text-lg mt-1 text-foreground">{p.name}</h4>
                    <div className="text-accent text-sm font-semibold mt-2">{p.price}</div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border-subtle">
                    <button onClick={() => handleEditProduct(p)} className="flex-1 border border-foreground/30 hover:border-foreground py-2 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"><Edit2 className="w-3 h-3" /> Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="border border-rose-500/30 hover:border-rose-500 text-rose-400 py-2 px-3 text-[10px] flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ORDERS LIFE CYCLE */}
      {tab === "orders" && (
        <AdminCard className="space-y-6 animate-in fade-in duration-200">
          <h3 className="font-serif text-xl">Orders Lifecycle Tracker</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total (INR)</th>
                  <th className="pb-3">Delivery Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {ordersList.map(o => (
                  <tr key={o.id} className="hover:bg-surface-2/40">
                    <td className="py-4 font-mono text-xs">{o.id}</td>
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
          <h3 className="font-serif text-xl">Returns Queue & Razorpay Auto-Refund</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest">
                  <th className="pb-3">Return ID</th>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Item</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Refund Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {returnsList.map(r => (
                  <tr key={r.id} className="hover:bg-surface-2/40">
                    <td className="py-4 font-mono text-xs">{r.id}</td>
                    <td className="py-4 font-mono text-xs">{r.orderId}</td>
                    <td className="py-4">{r.productName}</td>
                    <td className="py-4">{r.customerName}</td>
                    <td className="py-4">
                      <div className="font-semibold">{r.reason}</div>
                      <div className="text-xs text-muted-foreground">{r.comment}</div>
                    </td>
                    <td className="py-4 font-serif">₹{r.refundAmount.toLocaleString()}</td>
                    <td className="py-4">
                      <StatusChip
                        status={r.status}
                        tone={r.status === "Approved" ? "success" : r.status === "Pending" ? "warn" : "neutral"}
                      />
                    </td>
                    <td className="py-4 text-right whitespace-nowrap">
                      {r.status === "Pending" ? (
                        <div className="space-x-1">
                          <button
                            onClick={() => triggerModal("success", "Approve Return & Refund", `Approve return and issue payout of ₹${r.refundAmount.toLocaleString()} via Razorpay? This will instantly credit the customer wallet.`, () => approveReturn(r.id))}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectReturn(r.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded"
                          >
                            Reject
                          </button>
                        </div>
                      ) : r.status === "Approved" ? (
                        <div className="text-right text-[10px] text-emerald-400 font-mono">
                          Razorpay ID: {r.refundTransactionId?.slice(0, 15)}...
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
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
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Administrative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {customersList.map(c => {
                  const bal = state.wallets[c.id] ?? 0;
                  return (
                    <tr key={c.id} className="hover:bg-surface-2/40">
                      <td className="py-4">
                        <button
                          onClick={() => setSelectedCustomerDetails(c)}
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
                      <td className="py-4">
                        <StatusChip
                          status={c.status}
                          tone={c.status === "Active" ? "success" : "danger"}
                        />
                      </td>
                      <td className="py-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const amt = prompt("Enter wallet credit amount (₹):", "5000");
                            if (amt && !isNaN(Number(amt))) {
                              addWalletCredit(c.id, Number(amt));
                            }
                          }}
                          className="bg-accent/20 hover:bg-accent text-accent hover:text-white text-[10px] font-bold px-2.5 py-1"
                        >
                          Credit Wallet
                        </button>
                        {c.status === "Active" ? (
                          <button
                            onClick={() => suspendCustomer(c.id)}
                            className="border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white text-[10px] font-bold px-2 py-1"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => reactivateCustomer(c.id)}
                            className="border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold px-2 py-1"
                          >
                            Reactivate
                          </button>
                        )}
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
                  <label className="text-xs text-muted-foreground">Coupon Code</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" placeholder="DIWALI30" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Discount Value</label>
                  <input required type="number" className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" value={couponForm.discount} onChange={e => setCouponForm({...couponForm, discount: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Coupon Type</label>
                  <select className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground" value={couponForm.type} onChange={e => setCouponForm({...couponForm, type: e.target.value})}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="wallet">Wallet Cashback</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-border-subtle">
                  <AdminButton type="button" variant="outline" onClick={() => setIsAddingCoupon(false)}>Cancel</AdminButton>
                  <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90">Add Coupon</button>
                </div>
              </form>
            </AdminCard>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {couponsList.map(c => (
              <AdminCard key={c.code} className="relative overflow-hidden flex flex-col justify-between h-36">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-8 -mt-8" />
                <div>
                  <div className="font-mono text-xl font-bold tracking-widest text-accent">{c.code}</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{c.type} discount</div>
                </div>
                  <div className="flex justify-between items-end">
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
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl">Vendors & Catalog Directory</h3>
            <button
              onClick={() => setIsAddingVendor(!isAddingVendor)}
              className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Vendor Account
            </button>
          </div>

          {isAddingVendor && (
            <AdminCard className="space-y-6 animate-in slide-in-from-top-4 duration-200">
              <h4 className="font-serif text-lg">Register Vendor Account</h4>
              <form onSubmit={handleVendorSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Company Name</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" value={vendorForm.companyName} onChange={e => setVendorForm({...vendorForm, companyName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Contact Person</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" value={vendorForm.contactPerson} onChange={e => setVendorForm({...vendorForm, contactPerson: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Business Email</label>
                  <input required type="email" className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" value={vendorForm.email} onChange={e => setVendorForm({...vendorForm, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Phone Number</label>
                  <input required className="w-full bg-surface border border-border-subtle p-2 text-sm outline-none" value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value})} />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-border-subtle">
                  <AdminButton type="button" variant="outline" onClick={() => setIsAddingVendor(false)}>Cancel</AdminButton>
                  <button type="submit" className="editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90">Register Vendor</button>
                </div>
              </form>
            </AdminCard>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {vendorsList.map(v => (
              <AdminCard key={v.id} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif text-lg text-foreground">{v.companyName}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Contact: {v.contactPerson}</p>
                  </div>
                  <button onClick={() => deleteVendor(v.id)} className="text-xs text-rose-400 hover:text-rose-500 uppercase font-semibold">Delete</button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-border-subtle pt-3 text-muted-foreground">
                  <div>Email: <span className="text-foreground">{v.email}</span></div>
                  <div>Phone: <span className="text-foreground">{v.phone}</span></div>
                  <div>Products Registered: <span className="text-accent font-bold">{v.products?.length || 0}</span></div>
                  <div>Sales Revenue: <span className="text-emerald-400 font-bold">₹{(v.revenue || 0).toLocaleString()}</span></div>
                </div>
              </AdminCard>
            ))}
          </div>

          {/* Vendor Catalog Portal simulation */}
          <AdminCard className="mt-8 space-y-6">
            <h3 className="font-serif text-xl border-b border-border-subtle pb-3">Simulated Vendor Portal</h3>
            <p className="text-xs text-muted-foreground">Log in as a vendor to register catalog items and view statistics.</p>
            <div className="flex gap-4">
              <select className="bg-surface border border-border-subtle p-2 text-xs text-foreground outline-none">
                {vendorsList.map(v => (
                  <option key={v.id} value={v.id}>{v.companyName}</option>
                ))}
              </select>
              <AdminButton variant="accent">Launch Vendor Session</AdminButton>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
}
