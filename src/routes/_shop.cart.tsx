import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { usePortal } from "@/lib/portal-state";
import { BACKEND_URL } from "@/lib/config";
import { z } from "zod";
import {
  Trash2,
  Tag,
  MapPin,
  Plus,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Save,
  Undo,
  ShoppingCart,
  HelpCircle,
  CheckCircle2,
  CreditCard,
  Wallet,
  X,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";

const cartSearchSchema = z.object({
  buyNow: z.string().optional(),
  productId: z.string().optional(),
  size: z.string().optional(),
});

export const Route = createFileRoute("/_shop/cart")({
  validateSearch: (search) => cartSearchSchema.parse(search),
  component: ShopCart,
});

type CartItem = {
  productId: string;
  name: string;
  house: string;
  price: string;
  image: string;
  qty: number;
  selectedSize?: string;
};

export function ShopCart() {
  const {
    state,
    removeFromShopCart,
    clearShopCart,
    createOrder,
    addAddress,
    updateAddress,
    updateShopCartQty,
    updateShopCartSizeAndQty,
    restoreToShopCart,
    addWalletCredit
  } = usePortal();
  const navigate = useNavigate();

  const user = state.user;
  const cartItems = state.shopCart || [];

  const search = Route.useSearch();
  const isBuyNow = search.buyNow === "true";

  // Active steps: "cart" | "address" | "payment"
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "payment">(
    isBuyNow ? "address" : "cart"
  );

  // Selection states
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  // Undo Notification states
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);
  const [showUndoNotification, setShowUndoNotification] = useState(false);

  // Combined Size & Quantity Selection Modal state
  const [editItemModal, setEditItemModal] = useState<{
    item: CartItem;
    selectedSize: string;
    qty: number;
    customQtyInput: string;
    errorMsg: string | null;
    availableSizes: string[];
    stockPerSize: Record<string, number>;
    currentStock: number;
  } | null>(null);

  const handleOpenEditModal = (item: CartItem) => {
    const catalogProduct = state.products?.find((p) => p.id === item.productId);
    const stockPerSize: Record<string, number> = catalogProduct?.stockPerSize || {
      S: 25,
      M: 18,
      L: 74,
      XL: 53,
    };
    const availableSizes = catalogProduct?.sizes && catalogProduct.sizes.length > 0
      ? catalogProduct.sizes
      : Object.keys(stockPerSize).length > 0
      ? Object.keys(stockPerSize)
      : ["S", "M", "L", "XL"];

    const currentSize = item.selectedSize || "M";
    const currentStock = stockPerSize[currentSize] ?? 0;

    setEditItemModal({
      item,
      selectedSize: currentSize,
      qty: item.qty,
      customQtyInput: String(item.qty),
      errorMsg: null,
      availableSizes,
      stockPerSize,
      currentStock,
    });
  };

  const handleModalSelectSize = (newSize: string) => {
    if (!editItemModal) return;
    const newStock = editItemModal.stockPerSize[newSize] ?? 0;
    let errorMsg: string | null = null;

    if (editItemModal.qty > newStock) {
      errorMsg = `Only ${newStock} units are available for the selected size.`;
    }

    setEditItemModal({
      ...editItemModal,
      selectedSize: newSize,
      currentStock: newStock,
      errorMsg,
    });
  };

  const handleModalUpdateQty = (newQty: number) => {
    if (!editItemModal) return;
    let errorMsg: string | null = null;

    if (newQty > editItemModal.currentStock) {
      errorMsg = `Only ${editItemModal.currentStock} units are available for the selected size.`;
    } else if (newQty <= 0) {
      errorMsg = "Please enter a valid quantity.";
    }

    setEditItemModal({
      ...editItemModal,
      qty: newQty,
      customQtyInput: String(newQty),
      errorMsg,
    });
  };

  const handleModalCustomQtyInput = (valStr: string) => {
    if (!editItemModal) return;
    const num = parseInt(valStr, 10);
    let errorMsg: string | null = null;

    if (isNaN(num) || num <= 0) {
      errorMsg = "Please enter a valid quantity.";
    } else if (num > editItemModal.currentStock) {
      errorMsg = `Only ${editItemModal.currentStock} units are available for the selected size.`;
    }

    setEditItemModal({
      ...editItemModal,
      customQtyInput: valStr,
      qty: isNaN(num) ? 0 : num,
      errorMsg,
    });
  };

  const handleModalSave = () => {
    if (!editItemModal || editItemModal.errorMsg || editItemModal.qty <= 0) return;
    
    const { item, selectedSize, qty } = editItemModal;
    const oldSize = item.selectedSize || "M";

    updateShopCartSizeAndQty(item.productId, oldSize, selectedSize, qty);

    if (oldSize !== selectedSize) {
      const oldKey = `${item.productId}-${oldSize}`;
      const newKey = `${item.productId}-${selectedSize}`;
      setSelectedKeys((prev) =>
        prev.map((k) => (k === oldKey ? newKey : k))
      );
    }

    setEditItemModal(null);
    toast.success(`Updated ${item.name} (Size: ${selectedSize}, Qty: ${qty})`);
  };

  const handleSingleBuyNow = (item: CartItem) => {
    if (!user) {
      toast.error("Please sign in to complete your purchase.");
      navigate({ to: "/login" });
      return;
    }
    const catalogProduct = state.products?.find((p) => p.id === item.productId);
    const sizeStock = catalogProduct?.stockPerSize?.[item.selectedSize || "M"] ?? 10;

    if (sizeStock === 0) {
      toast.error(`Size ${item.selectedSize || "M"} is currently out of stock.`);
      return;
    }

    setCheckoutItems([item]);
    setCheckoutStep("address");
    toast.success(`Proceeding to checkout with ${item.name}`);
  };

  // Address Carousel States
  const [activeAddressIdx, setActiveAddressIdx] = useState(0);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editName, setEditName] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newState, setNewState] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Map and Geolocation states
  const [mapCenter, setMapCenter] = useState<[number, number]>([77.5946, 12.9716]); // Bangalore default
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Fetch new pin code details when pin code reaches 6 digits
  useEffect(() => {
    if (newPincode.trim().length === 6 && /^\d+$/.test(newPincode.trim())) {
      fetch(`https://api.postalpincode.in/pincode/${newPincode.trim()}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
            const office = data[0].PostOffice[0];
            setNewCity(office.Name || office.Block || "");
            setNewDistrict(office.District || "");
            setNewState(office.State || "");
            toast.success("India Pincode details retrieved!");
            
            // Auto geocode
            const query = `${office.Name || ""}, ${office.District || ""}, ${office.State || ""} - ${newPincode.trim()}`;
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
              headers: { "User-Agent": "ReeVibes-Shop-Portal" }
            })
              .then(res => res.json())
              .then(d => {
                if (d && d[0]) {
                  const lngNum = parseFloat(d[0].lon);
                  const latNum = parseFloat(d[0].lat);
                  setMapCenter([lngNum, latNum]);
                  setMarkerPos([lngNum, latNum]);
                }
              });
          }
        })
        .catch(console.error);
    }
  }, [newPincode]);

  // Fetch edit pin code details when pin code reaches 6 digits
  useEffect(() => {
    if (editPincode.trim().length === 6 && /^\d+$/.test(editPincode.trim())) {
      fetch(`https://api.postalpincode.in/pincode/${editPincode.trim()}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
            const office = data[0].PostOffice[0];
            setEditCity(office.Name || office.Block || "");
            setEditDistrict(office.District || "");
            setEditState(office.State || "");
            toast.success("India Pincode details retrieved!");
            
            // Auto geocode
            const query = `${office.Name || ""}, ${office.District || ""}, ${office.State || ""} - ${editPincode.trim()}`;
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
              headers: { "User-Agent": "ReeVibes-Shop-Portal" }
            })
              .then(res => res.json())
              .then(d => {
                if (d && d[0]) {
                  const lngNum = parseFloat(d[0].lon);
                  const latNum = parseFloat(d[0].lat);
                  setMapCenter([lngNum, latNum]);
                  setMarkerPos([lngNum, latNum]);
                }
              });
          }
        })
        .catch(console.error);
    }
  }, [editPincode]);

  // Reverse Geocoding
  const handleReverseGeocode = async (lng: number, lat: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      });
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.suburb || addr.neighbourhood || addr.amenity || addr.industrial || "";
        const city = addr.city || addr.town || addr.village || addr.municipality || "";
        const district = addr.county || addr.district || "";
        const stateVal = addr.state || "";
        const pincode = addr.postcode || "";

        if (isEditingAddress) {
          setEditStreet(street);
          setEditCity(city);
          setEditDistrict(district);
          setEditState(stateVal);
          setEditPincode(pincode ? pincode.replace(/\D/g, "").slice(0, 6) : "");
        } else {
          setNewStreet(street);
          setNewCity(city);
          setNewDistrict(district);
          setNewState(stateVal);
          setNewPincode(pincode ? pincode.replace(/\D/g, "").slice(0, 6) : "");
        }
        toast.success("Location address resolved!");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  // Detect location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setMapCenter([longitude, latitude]);
        setMarkerPos([longitude, latitude]);
        setIsLocating(false);
        handleReverseGeocode(longitude, latitude);
      },
      (error) => {
        setIsLocating(false);
        toast.error("Failed to detect location. Please search or point manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Forward Geocoding
  const handleGeocodeActiveAddress = async () => {
    const street = isEditingAddress ? editStreet : newStreet;
    const city = isEditingAddress ? editCity : newCity;
    const district = isEditingAddress ? editDistrict : newDistrict;
    const stateVal = isEditingAddress ? editState : newState;
    const pincode = isEditingAddress ? editPincode : newPincode;

    const query = [street, city, district, stateVal, pincode].filter(Boolean).join(", ");
    if (!query) {
      toast.error("Please enter some address details first.");
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      });
      const data = await res.json();
      if (data && data[0]) {
        const { lon, lat } = data[0];
        const lngNum = parseFloat(lon);
        const latNum = parseFloat(lat);
        setMapCenter([lngNum, latNum]);
        setMarkerPos([lngNum, latNum]);
        toast.success("Address located on map!");
      } else {
        toast.error("Entered location is invalid!");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      toast.error("Entered location is invalid!");
    }
  };

  // Payment simulated state
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "card" | "wallet">("razorpay");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<any | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState("");


  // Stock check dialog state
  const [stockCheckDialog, setStockCheckDialog] = useState<{
    open: boolean;
    inStockItems: Array<{ item: CartItem; maxAvailable: number }>;
    outOfStockItems: Array<{ item: CartItem; maxAvailable: number; reason: string }>;
  } | null>(null);

  // Automatically select all items on load or when new items are added
  useEffect(() => {
    if (isBuyNow && search.productId && search.size) {
      const key = `${search.productId}-${search.size}`;
      setSelectedKeys([key]);
      const matched = cartItems.filter(
        (item) => item.productId === search.productId && item.selectedSize === search.size
      );
      if (matched.length > 0) {
        setCheckoutItems(matched);
      }
    } else if (cartItems.length > 0 && selectedKeys.length === 0) {
      setSelectedKeys(cartItems.map(item => `${item.productId}-${item.selectedSize || "M"}`));
    }
  }, [cartItems, isBuyNow, search.productId, search.size]);

  // Keep only active/valid cart item keys
  const validSelectedKeys = selectedKeys.filter((k) =>
    cartItems.some((item) => `${item.productId}-${item.selectedSize || "M"}` === k)
  );

  const selectedItems = cartItems.filter((item) =>
    validSelectedKeys.includes(`${item.productId}-${item.selectedSize || "M"}`)
  );

  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + Number(String(item.price).replace(/[^0-9.]/g, "")) * item.qty,
    0
  );
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.qty, 0);

  const discountPercent = activeCoupon ? activeCoupon.discount : 0;
  const discountAmount = Math.round((selectedTotal * discountPercent) / 100);
  const finalTotal = Math.max(0, selectedTotal - discountAmount);

  // Address parsing helper
  const getParsedAddresses = () => {
    const rawList = user ? state.addresses[user.id] || [] : [];
    return rawList.map(addrStr => {
      try {
        if (addrStr.trim().startsWith("{")) {
          return JSON.parse(addrStr);
        }
      } catch (e) { /* ignore */ }
      return {
        name: user ? `${user.firstName} ${user.lastName}` : "Customer Name",
        address: addrStr,
        phone: user?.phone || ""
      };
    });
  };

  const parsedAddresses = getParsedAddresses();

  const handleToggleSelectAll = () => {
    if (validSelectedKeys.length === cartItems.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(cartItems.map(item => `${item.productId}-${item.selectedSize || "M"}`));
    }
  };

  const handleToggleSelectItem = (key: string) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  // Remove item with undo notifications
  const handleRemoveItem = (item: CartItem) => {
    setLastRemovedItem(item);
    setShowUndoNotification(true);
    removeFromShopCart(item.productId, item.selectedSize);

    // Auto hide notification after 8 seconds
    setTimeout(() => {
      setLastRemovedItem(prev => {
        if (prev?.productId === item.productId && prev?.selectedSize === item.selectedSize) {
          setShowUndoNotification(false);
        }
        return prev;
      });
    }, 8000);
  };

  const handleUndoRemove = () => {
    if (lastRemovedItem) {
      restoreToShopCart(lastRemovedItem);
      setShowUndoNotification(false);
      setLastRemovedItem(null);
      toast.success(`Restored ${lastRemovedItem.name} to cart!`);
    }
  };

  // Edit Address implementation
  const handleStartEditAddress = (idx: number) => {
    const addr = parsedAddresses[idx];
    setEditName(addr.name);
    setEditPhone(addr.phone);
    setIsEditingAddress(true);

    const parts = addr.address.split(", ");
    let street = "";
    let city = "";
    let district = "";
    let stateVal = "";
    let pincode = "";

    if (parts.length >= 4) {
      street = parts[0];
      city = parts[1];
      if (parts.length === 5) {
        district = parts[2];
        const stateAndPin = parts[3].split(" - ");
        stateVal = stateAndPin[0] || "";
        pincode = stateAndPin[1] || "";
      } else {
        district = "";
        const stateAndPin = parts[2].split(" - ");
        stateVal = stateAndPin[0] || "";
        pincode = stateAndPin[1] || "";
      }
    } else {
      street = addr.address;
    }

    setEditStreet(street);
    setEditCity(city);
    setEditDistrict(district);
    setEditState(stateVal);
    setEditPincode(pincode);

    // Geocode the address to show it on map
    const query = [street, city, district, stateVal, pincode].filter(Boolean).join(", ");
    if (query) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data[0]) {
            const lngNum = parseFloat(data[0].lon);
            const latNum = parseFloat(data[0].lat);
            setMapCenter([lngNum, latNum]);
            setMarkerPos([lngNum, latNum]);
          }
        })
        .catch(console.error);
    }
  };

  const handleSaveEditedAddress = () => {
    if (!user || !editName.trim() || !editStreet.trim() || !editCity.trim() || !editState.trim() || !editPincode.trim() || !editPhone.trim()) {
      toast.error("Please fill in all address details.");
      return;
    }
    const fullAddressText = `${editStreet.trim()}, ${editCity.trim()}, ${editDistrict.trim() ? editDistrict.trim() + ", " : ""}${editState.trim()} - ${editPincode.trim()}`;
    const updatedStr = JSON.stringify({
      name: editName.trim(),
      address: fullAddressText.trim(),
      phone: editPhone.trim()
    });
    updateAddress(user.id, activeAddressIdx, updatedStr);
    setIsEditingAddress(false);
    setMarkerPos(null);
    toast.success("Address updated successfully.");
  };

  // Add Address implementation
  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim() || !newStreet.trim() || !newCity.trim() || !newState.trim() || !newPincode.trim() || !newPhone.trim()) {
      toast.error("Please fill in all details for the new address.");
      return;
    }
    const fullAddressText = `${newStreet.trim()}, ${newCity.trim()}, ${newDistrict.trim() ? newDistrict.trim() + ", " : ""}${newState.trim()} - ${newPincode.trim()}`;
    const newStr = JSON.stringify({
      name: newName.trim(),
      address: fullAddressText.trim(),
      phone: newPhone.trim()
    });
    addAddress(user.id, newStr);
    setNewName("");
    setNewStreet("");
    setNewCity("");
    setNewDistrict("");
    setNewState("");
    setNewPincode("");
    setNewPhone("");
    setIsAddingNewAddress(false);
    setMarkerPos(null);
    setActiveAddressIdx(parsedAddresses.length); // switch to the newly created address
    toast.success("New shipping address added!");
  };

  // Apply Coupon Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon = state.coupons.find(
      (c) => c.code === couponCode.trim().toUpperCase() && c.active
    );
    if (!coupon) {
      toast.error("Invalid coupon code.");
      return;
    }

    if (coupon.expiryDate && coupon.expiryDate !== "unlimited") {
      const todayStr = new Date().toISOString().slice(0, 10);
      if (todayStr > coupon.expiryDate) {
        toast.error("This coupon has expired.");
        return;
      }
    }

    if (coupon.usageLimit !== undefined && coupon.usageLimit !== -1) {
      if ((coupon.usedCount || 0) >= coupon.usageLimit) {
        toast.error("Coupon usage limit has been reached.");
        return;
      }
    }

    setActiveCoupon(coupon);
    setAppliedCoupon(coupon.code);
    const initialDiscount = Math.round((selectedTotal * coupon.discount) / 100);
    toast.success(`Coupon applied: ₹${initialDiscount.toLocaleString()} OFF`);
  };

  // Initial Order placement trigger - Stock Verification
  const handleStartPlaceOrder = () => {
    if (!user) {
      toast.error("Please sign in to place an order.");
      navigate({ to: "/login" });
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to purchase.");
      return;
    }

    // Run stock verification
    const inStockItems: Array<{ item: CartItem; maxAvailable: number }> = [];
    const outOfStockItems: Array<{ item: CartItem; maxAvailable: number; reason: string }> = [];

    selectedItems.forEach((item) => {
      const catalogProduct = state.products?.find((p) => p.id === item.productId);
      if (!catalogProduct) {
        outOfStockItems.push({
          item,
          maxAvailable: 0,
          reason: "Product is no longer available in the catalog."
        });
        return;
      }

      const sizeStock = catalogProduct.stockPerSize?.[item.selectedSize || "M"] ?? 0;
      if (sizeStock === 0) {
        outOfStockItems.push({
          item,
          maxAvailable: 0,
          reason: `Size ${item.selectedSize || "M"} is completely out of stock.`
        });
      } else if (sizeStock < item.qty) {
        outOfStockItems.push({
          item,
          maxAvailable: sizeStock,
          reason: `Requested quantity is ${item.qty}, but only ${sizeStock} pieces are left.`
        });
        // Partially available, so we add the available quantity to inStock list
        inStockItems.push({
          item,
          maxAvailable: sizeStock
        });
      } else {
        inStockItems.push({
          item,
          maxAvailable: sizeStock
        });
      }
    });

    if (outOfStockItems.length > 0) {
      // Trigger out of stock notification dialog
      setStockCheckDialog({
        open: true,
        inStockItems,
        outOfStockItems
      });
    } else {
      // All items in stock, proceed directly to address step
      setCheckoutItems(selectedItems);
      setCheckoutStep("address");
    }
  };

  const handleConfirmStockAdjustment = () => {
    if (!stockCheckDialog) return;

    // Adjust quantities for partially in-stock items
    stockCheckDialog.inStockItems.forEach(({ item, maxAvailable }) => {
      if (item.qty > maxAvailable) {
        updateShopCartQty(item.productId, item.selectedSize || "M", maxAvailable);
      }
    });

    // Remove completely out of stock items
    stockCheckDialog.outOfStockItems.forEach(({ item, maxAvailable }) => {
      if (maxAvailable === 0) {
        removeFromShopCart(item.productId, item.selectedSize);
      }
    });

    const finalCheckoutItems = stockCheckDialog.inStockItems
      .map(({ item, maxAvailable }) => ({
        ...item,
        qty: Math.min(item.qty, maxAvailable)
      }))
      .filter((item) => item.qty > 0);

    if (finalCheckoutItems.length === 0) {
      toast.error("No items are available in stock. Order cannot be placed.");
      setStockCheckDialog(null);
      return;
    }

    setCheckoutItems(finalCheckoutItems);
    setStockCheckDialog(null);
    setCheckoutStep("address");
    toast.success("Proceeding with only available in-stock items.");
  };

  // Address completion -> Go to payment session
  const handleProceedToPayment = () => {
    if (parsedAddresses.length === 0) {
      toast.error("Please add a shipping address first.");
      return;
    }
    setCheckoutStep("payment");
  };

  // Place order final checkout
  const handleFinalOrderSubmit = () => {
    if (!user) return;
    const selectedAddressText = parsedAddresses[activeAddressIdx]
      ? `${parsedAddresses[activeAddressIdx].name}, ${parsedAddresses[activeAddressIdx].address}, Phone: ${parsedAddresses[activeAddressIdx].phone}`
      : "";

    if (!selectedAddressText) {
      toast.error("Please select a shipping address.");
      setCheckoutStep("address");
      return;
    }

    // If paying via wallet, verify balance
    if (paymentMethod === "wallet") {
      const balance = state.wallets[user.id] ?? 0;
      if (balance < finalTotal) {
        toast.error("Insufficient wallet balance. Please choose another payment method.");
        return;
      }
      // Deduct wallet balance (adding negative credit)
      addWalletCredit(user.id, -finalTotal);

      createOrder(user.id, {
        items: checkoutItems,
        total: finalTotal,
        address: selectedAddressText,
        appliedCoupon: appliedCoupon || undefined,
        paymentStatus: "Paid"
      });

      toast.success("Thank you! Your order has been placed successfully.");
      navigate({ to: "/account", search: { tab: "orders" } as any });
      return;
    }

    // Razorpay Integration Flow
    const loadingToast = toast.loading("Initializing payment gateway...");
    const backendUrl = BACKEND_URL;

    fetch(`${backendUrl}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(finalTotal * 100), // paise
        currency: "INR"
      })
    })
      .then(async (res) => {
        toast.dismiss(loadingToast);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to initialize payment.");
        }
        return res.json();
      })
      .then((data) => {
        const isProdDomain = typeof window !== "undefined" && 
          (window.location.hostname === "reevibes.com" || 
           window.location.hostname === "www.reevibes.com" || 
           window.location.hostname === "shop.reevibes.com");
           
        const keyId = import.meta.env.VITE_VITE_RAZORPAY_KEY_ID || 
                      import.meta.env.VITE_RAZORPAY_KEY_ID || 
                      (isProdDomain ? "rzp_live_TD6rmV4Xstddju" : "rzp_test_TD5IJ7If16ZHbr");
        
        const options = {
          key: keyId,
          amount: data.amount,
          currency: data.currency,
          name: "ReeVibes",
          description: "Curated Fashion Statement Pieces",
          image: "https://reevibes.com/favicon.png",
          order_id: data.order_id,
          handler: function (response: any) {
            const verifyingToast = toast.loading("Verifying payment transaction...");
            fetch(`${backendUrl}/api/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            })
              .then(async (verifyRes) => {
                toast.dismiss(verifyingToast);
                if (!verifyRes.ok) {
                  throw new Error("Payment signature verification failed.");
                }
                return verifyRes.json();
              })
              .then(() => {
                createOrder(user.id, {
                  items: checkoutItems,
                  total: finalTotal,
                  address: selectedAddressText,
                  appliedCoupon: appliedCoupon || undefined,
                  paymentStatus: "Paid",
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature
                });
                toast.success("Payment verified! Your order has been placed successfully.");
                navigate({ to: "/account", search: { tab: "orders" } as any });
              })
              .catch((err) => {
                toast.error(`Verification Failed: ${err.message}`);
              });
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: user.phone || ""
          },
          theme: {
            color: "#D4AF37"
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment checkout window cancelled.");
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(`Payment Failed: ${response.error.description}`);
        });
        rzp.open();
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        toast.error(`Checkout Error: ${err.message}`);
      });
  };

  if (cartItems.length === 0 && checkoutStep === "cart") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-white/5 dark:bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner backdrop-blur-md">
          <ShoppingBag className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="font-serif text-3xl">Your Cart is Empty</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Explore our curated collections to discover statement pieces tailored for you.
          </p>
        </div>
        <Link
          to="/"
          className="bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const isAllSelected = validSelectedKeys.length === cartItems.length;
  const isSomeSelected = validSelectedKeys.length > 0 && validSelectedKeys.length < cartItems.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 md:py-12 space-y-8 relative">
      
      {/* Checkout step visual indicators */}
      <div className="flex justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest pb-4 border-b border-white/10">
        <button
          onClick={() => setCheckoutStep("cart")}
          className={`pb-1 ${checkoutStep === "cart" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"}`}
        >
          1. Shopping Cart
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <button
          disabled={checkoutStep === "cart"}
          onClick={() => setCheckoutStep("address")}
          className={`pb-1 ${checkoutStep === "address" ? "text-accent border-b-2 border-accent" : "text-muted-foreground disabled:opacity-50"}`}
        >
          2. Delivery Address
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <button
          disabled={checkoutStep !== "payment"}
          className={`pb-1 ${checkoutStep === "payment" ? "text-accent border-b-2 border-accent" : "text-muted-foreground disabled:opacity-50"}`}
        >
          3. Secure Payment
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left main area depending on checkout step */}
        <div className="lg:col-span-8 space-y-6">
          
          {checkoutStep === "cart" && (
            <>
              <h1 className="font-serif text-3xl md:text-5xl">Your Shopping Cart</h1>
              {/* Select All Toggle Bar */}
              <div className="liquid-glass p-4 px-6 flex items-center justify-between rounded-3xl border border-white/10">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent focus:ring-offset-background accent-accent cursor-pointer"
                  />
                  Select All ({cartItems.length} items)
                </label>
                {validSelectedKeys.length > 0 && (
                  <span className="text-xs font-semibold text-accent animate-pulse">
                    {validSelectedKeys.length} selected
                  </span>
                )}
              </div>

              {/* Cart List */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const itemKey = `${item.productId}-${item.selectedSize || "M"}`;
                  const isSelected = validSelectedKeys.includes(itemKey);

                  const priceVal = Number(String(item.price).replace(/[^0-9.]/g, ""));
                  const catalogProd = state.products?.find((p) => p.id === item.productId);
                  const origPriceVal = catalogProd?.originalPrice
                    ? Number(String(catalogProd.originalPrice).replace(/[^0-9.]/g, ""))
                    : (catalogProd?.price && Number(String(catalogProd.price).replace(/[^0-9.]/g, "")) > priceVal
                    ? Number(String(catalogProd.price).replace(/[^0-9.]/g, ""))
                    : Math.round(priceVal * 1.25));
                  const hasDiscount = origPriceVal > priceVal;
                  const discountPct = catalogProd?.discount || (hasDiscount ? Math.round(((origPriceVal - priceVal) / origPriceVal) * 100) : 0);

                  return (
                    <div
                      key={itemKey}
                      className={`liquid-glass relative p-4 sm:p-5 rounded-3xl border border-white/10 flex flex-row gap-3 sm:gap-5 items-start transition-all duration-300 ${
                        isSelected ? "bg-white/[0.04] ring-1 ring-accent/30" : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="flex items-center pt-1 shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectItem(itemKey)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent focus:ring-offset-background accent-accent cursor-pointer"
                        />
                      </div>

                      {/* Delete Icon - Top Right Corner */}
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => handleRemoveItem(item)}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-rose-400/80 hover:text-rose-400 p-2 rounded-full hover:bg-rose-500/10 border border-transparent transition-all cursor-pointer z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Product Thumbnail */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 sm:w-28 aspect-[3/4] object-cover rounded-2xl border border-white/10 shadow-md shrink-0"
                      />

                      {/* Right Details */}
                      <div className="flex-1 min-w-0 pr-8 space-y-2">
                        {item.house && (
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                            {item.house}
                          </div>
                        )}
                        <h3 className="font-serif text-base sm:text-lg text-foreground hover:text-accent font-semibold leading-snug line-clamp-2">
                          <Link to="/product/$productId" params={{ productId: item.productId }}>
                            {item.name}
                          </Link>
                        </h3>

                        {/* Pricing Section */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-base sm:text-lg font-bold text-foreground">
                            ₹{(priceVal * item.qty).toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <>
                              <span className="text-xs text-muted-foreground line-through font-mono">
                                ₹{(origPriceVal * item.qty).toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                {discountPct}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* Size, Quantity, Edit Icon & Buy Now Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          {/* Left: Size, Qty & Single Edit Icon */}
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-foreground">
                              <span className="text-muted-foreground">Size:</span>
                              <span className="font-bold text-accent uppercase">{item.selectedSize || "M"}</span>
                            </span>

                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-foreground">
                              <span className="text-muted-foreground">Qty:</span>
                              <span className="font-bold text-accent">{item.qty}</span>
                            </span>

                            {/* Single Edit Icon to right of Quantity */}
                            <button
                              type="button"
                              aria-label="Edit size and quantity"
                              title="Edit Size & Quantity"
                              onClick={() => handleOpenEditModal(item)}
                              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/40 text-accent rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Far Right: Buy Now Button */}
                          <button
                            type="button"
                            onClick={() => handleSingleBuyNow(item)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-accent via-gold to-accent-rose text-obsidian text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all cursor-pointer active:scale-95 ml-auto"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {checkoutStep === "address" && (
            <div className="liquid-glass p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h3 className="font-serif text-xl">Verify Shipping Address</h3>
                </div>
                <button
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs uppercase tracking-widest font-bold text-accent hover:text-accent/80 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {isAddingNewAddress ? "View Addresses" : "Add Address"}
                </button>
              </div>

              {isAddingNewAddress || parsedAddresses.length === 0 ? (
                /* Add New Address Form */
                <form onSubmit={handleAddNewAddressSubmit} className="space-y-4 pt-2">
                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left: Map */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Pin Location on Map</span>
                        <span className="text-accent/80 font-mono text-[9px]">Drag pin to refine</span>
                      </span>
                      <div className="relative h-[250px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_4px_24px_rgba(212,175,55,0.05)] bg-white/5 backdrop-blur-md">
                        <Map center={mapCenter} zoom={14}>
                          {markerPos && (
                            <MapMarker
                              draggable
                              longitude={markerPos[0]}
                              latitude={markerPos[1]}
                              onDrag={(lngLat) => {
                                setMarkerPos([lngLat.lng, lngLat.lat]);
                                handleReverseGeocode(lngLat.lng, lngLat.lat);
                              }}
                            >
                              <MarkerContent>
                                <div className="relative flex items-center justify-center">
                                  <div className="absolute w-8 h-8 rounded-full bg-accent/20 border border-accent animate-ping" />
                                  <div className="relative w-5 h-5 rounded-full bg-accent border-2 border-white shadow-[0_0_10px_rgba(212,175,55,0.8)] flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  </div>
                                </div>
                              </MarkerContent>
                            </MapMarker>
                          )}
                        </Map>
                      </div>

                      {/* Use my current location button below map */}
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-accent border border-white/10 px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce text-accent' : 'text-accent'}`} />
                        {isLocating ? "Locating..." : "Use my current location"}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleGeocodeActiveAddress}
                        className="w-full bg-white/5 hover:bg-white/10 text-accent border border-accent/20 hover:border-accent/40 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                      >
                        Locate Entered Address on Map
                      </button>
                    </div>

                    {/* Right: Form inputs */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Recipient Name</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Léa Dubois"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Contact Phone Number</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. +91 98765 43210"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent"
                            value={newPhone}
                            onChange={e => setNewPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">India Pin Code</label>
                          <input
                            required
                            type="text"
                            maxLength={6}
                            placeholder="e.g. 560038"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent"
                            value={newPincode}
                            onChange={e => setNewPincode(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">City / Town</label>
                          <input
                            required
                            type="text"
                            placeholder="City Name"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent"
                            value={newCity}
                            onChange={e => setNewCity(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">District</label>
                          <input
                            type="text"
                            placeholder="District"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent"
                            value={newDistrict}
                            onChange={e => setNewDistrict(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">State</label>
                          <input
                            required
                            type="text"
                            placeholder="State Name"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent"
                            value={newState}
                            onChange={e => setNewState(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Street / Detailed Address</label>
                        <input
                          required
                          type="text"
                          placeholder="Apartment/Flat No, Area, Street Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent"
                          value={newStreet}
                          onChange={e => setNewStreet(e.target.value)}
                        />
                      </div>

                      {/* Save & Select / Cancel options below street address */}
                      <div className="flex gap-2 pt-4">
                        <button
                          type="submit"
                          className="bg-accent text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-all cursor-pointer"
                        >
                          Save & Select Address
                        </button>
                        {parsedAddresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNewAddress(false);
                              setMarkerPos(null);
                            }}
                            className="border border-white/10 hover:bg-white/10 text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                /* Address Carousel with Left/Right Arrows Shifting */
                <div className="space-y-6">
                  {parsedAddresses.length > 0 ? (
                    <div className="space-y-6">
                      <p className="text-xs text-muted-foreground text-center">
                        Shift between your saved delivery endpoints using the arrows below.
                      </p>
                      
                      {/* Carousel Widget */}
                      <div className="relative flex items-center justify-between py-6 px-12 md:px-16 bg-white/[0.02] border border-white/5 rounded-3xl">
                        {parsedAddresses.length > 1 && (
                          <button
                            onClick={() => {
                              setIsEditingAddress(false);
                              setMarkerPos(null);
                              setActiveAddressIdx(prev => (prev === 0 ? parsedAddresses.length - 1 : prev - 1));
                            }}
                            className="absolute left-4 p-2.5 rounded-full bg-white/5 border border-white/10 text-accent hover:bg-accent hover:text-white transition-all duration-300 z-10 cursor-pointer"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        )}

                        <div className="w-full max-w-md mx-auto liquid-glass border border-accent/20 bg-gradient-to-b from-accent/5 to-black/35 p-6 rounded-3xl relative overflow-hidden shadow-xl space-y-4">
                          {isEditingAddress ? (
                            <div className="space-y-3">
                              <h4 className="text-xs uppercase tracking-widest text-accent font-bold">Edit Current Address</h4>
                              
                              {/* Map for editing */}
                              <div className="relative h-[160px] w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                <Map center={mapCenter} zoom={14}>
                                  {markerPos && (
                                    <MapMarker
                                      draggable
                                      longitude={markerPos[0]}
                                      latitude={markerPos[1]}
                                      onDrag={(lngLat) => {
                                        setMarkerPos([lngLat.lng, lngLat.lat]);
                                        handleReverseGeocode(lngLat.lng, lngLat.lat);
                                      }}
                                    >
                                      <MarkerContent>
                                        <div className="relative flex items-center justify-center">
                                          <div className="absolute w-6 h-6 rounded-full bg-accent/20 border border-accent animate-ping" />
                                          <div className="relative w-4 h-4 rounded-full bg-accent border-2 border-white shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                                        </div>
                                      </MarkerContent>
                                    </MapMarker>
                                  )}
                                </Map>
                                
                                <button
                                  type="button"
                                  onClick={handleDetectLocation}
                                  disabled={isLocating}
                                  className="absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-black/70 hover:bg-black/90 text-accent border border-accent/30 px-2 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold backdrop-blur-md transition-all cursor-pointer shadow-lg"
                                >
                                  <MapPin className="w-2.5 h-2.5" />
                                  Detect
                                </button>
                              </div>

                              <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent"
                                placeholder="Recipient Name"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                              />

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  maxLength={6}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent"
                                  placeholder="Pin Code"
                                  value={editPincode}
                                  onChange={e => setEditPincode(e.target.value.replace(/\D/g, ''))}
                                />
                                <input
                                  type="text"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent"
                                  placeholder="City"
                                  value={editCity}
                                  onChange={e => setEditCity(e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent"
                                  placeholder="District"
                                  value={editDistrict}
                                  onChange={e => setEditDistrict(e.target.value)}
                                />
                                <input
                                  type="text"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent"
                                  placeholder="State"
                                  value={editState}
                                  onChange={e => setEditState(e.target.value)}
                                />
                              </div>

                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 pr-12 text-xs text-foreground outline-none focus:border-accent"
                                  placeholder="Street / Detailed Address"
                                  value={editStreet}
                                  onChange={e => setEditStreet(e.target.value)}
                                />
                                <button
                                  type="button"
                                  onClick={handleGeocodeActiveAddress}
                                  className="absolute right-2 top-1.5 text-[9px] uppercase tracking-wider text-accent font-bold hover:underline bg-black/40 px-2 py-1 rounded border border-accent/20 cursor-pointer"
                                >
                                  Locate
                                </button>
                              </div>

                              <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent"
                                placeholder="Phone Number"
                                value={editPhone}
                                onChange={e => setEditPhone(e.target.value)}
                              />
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={handleSaveEditedAddress}
                                  className="bg-accent text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-accent/90 cursor-pointer"
                                >
                                  <Save className="w-3.5 h-3.5" /> Save Changes
                                </button>
                                <button
                                  onClick={() => {
                                    setIsEditingAddress(false);
                                    setMarkerPos(null);
                                  }}
                                  className="bg-white/10 text-foreground px-4 py-2 rounded-full text-xs cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] uppercase tracking-widest text-accent font-bold">Address {activeAddressIdx + 1} of {parsedAddresses.length}</span>
                                <button
                                  onClick={() => handleStartEditAddress(activeAddressIdx)}
                                  className="text-[10px] uppercase tracking-wider text-accent hover:underline flex items-center gap-1 font-bold"
                                >
                                  <Edit2 className="w-3 h-3" /> Edit Card
                                </button>
                              </div>
                              <div className="font-serif text-lg text-white font-semibold">
                                {parsedAddresses[activeAddressIdx]?.name}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {parsedAddresses[activeAddressIdx]?.address}
                              </p>
                              <div className="text-xs text-accent font-mono">
                                Phone: {parsedAddresses[activeAddressIdx]?.phone}
                              </div>
                            </div>
                          )}
                        </div>

                        {parsedAddresses.length > 1 && (
                          <button
                            onClick={() => {
                              setIsEditingAddress(false);
                              setActiveAddressIdx(prev => (prev === parsedAddresses.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-4 p-2.5 rounded-full bg-white/5 border border-white/10 text-accent hover:bg-accent hover:text-white transition-all duration-300 z-10 cursor-pointer"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          onClick={() => setCheckoutStep("cart")}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-xs text-foreground transition-colors"
                        >
                          Back to Cart
                        </button>
                        <button
                          onClick={handleProceedToPayment}
                          className="bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                        >
                          Proceed to Payment <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground italic">No addresses saved. Please click "Add Address" above to enter shipping details.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {checkoutStep === "payment" && (
            <div className="liquid-glass p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <CreditCard className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-xl">Select Secure Payment Method</h3>
              </div>

              {/* Payment Methods Options */}
              <div className="grid gap-4 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-5 border rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 self-end -mr-2 -mt-2 ${paymentMethod === "razorpay" ? "text-accent" : "text-transparent"}`} />
                  <ShoppingBag className="w-6 h-6 text-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider">Razorpay Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-5 border rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                    paymentMethod === "card"
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 self-end -mr-2 -mt-2 ${paymentMethod === "card" ? "text-accent" : "text-transparent"}`} />
                  <CreditCard className="w-6 h-6 text-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider">Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-5 border rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                    paymentMethod === "wallet"
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 self-end -mr-2 -mt-2 ${paymentMethod === "wallet" ? "text-accent" : "text-transparent"}`} />
                  <Wallet className="w-6 h-6 text-accent" />
                  <div className="text-center">
                    <span className="text-xs font-bold uppercase tracking-wider block">Wallet Balance</span>
                    <span className="text-[10px] font-mono text-accent mt-1 block">₹{(state.wallets[user?.id || ""] ?? 0).toLocaleString()}</span>
                  </div>
                </button>
              </div>

              {/* Wallet Pay Insufficient Funds Info */}
              {paymentMethod === "wallet" && (state.wallets[user?.id || ""] ?? 0) < finalTotal && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 space-y-2">
                  <p>⚠️ Your wallet balance is insufficient to complete this transaction (Missing ₹{(finalTotal - (state.wallets[user?.id || ""] ?? 0)).toLocaleString()}).</p>
                  <button
                    onClick={() => {
                      if (user) {
                        addWalletCredit(user.id, finalTotal);
                        toast.success("Wallet credited with sufficient funds for demo purposes!");
                      }
                    }}
                    className="text-xs text-accent font-bold underline block"
                  >
                    Quick Add Demo Funds
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setCheckoutStep("address")}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-xs text-foreground transition-colors"
                >
                  Back to Address
                </button>
                <button
                  onClick={handleFinalOrderSubmit}
                  disabled={paymentMethod === "wallet" && (state.wallets[user?.id || ""] ?? 0) < finalTotal}
                  className="bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  Confirm Payment & Place Order
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Checkout Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="liquid-glass p-6 space-y-6 shadow-xl">
            <h3 className="font-serif text-2xl border-b border-white/10 pb-4">Checkout Summary</h3>

            {/* Coupons Box */}
            {checkoutStep === "cart" && (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                  Promo Coupon
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3.5 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="FESTIVE20"
                      className="w-full bg-white/5 dark:bg-white/5 border border-white/10 pl-10 pr-3 py-2.5 text-xs outline-none uppercase rounded-full focus:border-accent transition-colors"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white/10 hover:bg-white/20 border border-white/15 px-5 text-xs font-semibold uppercase tracking-widest rounded-full text-foreground transition-all"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">
                    Applied Code: {appliedCoupon}
                  </div>
                )}
              </form>
            )}

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Subtotal ({checkoutStep === "cart" ? selectedCount : checkoutItems.reduce((s, c) => s + c.qty, 0)} items)</span>
                <span className="font-serif">₹{selectedTotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span className="font-serif">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                  FREE
                </span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between text-base font-bold">
                <span>Estimated Total</span>
                <span className="font-serif text-accent text-lg">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {checkoutStep === "cart" && (
              <button
                onClick={handleStartPlaceOrder}
                disabled={selectedItems.length === 0}
                className="w-full bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Place Order <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Undo Notification */}
      {showUndoNotification && lastRemovedItem && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300 w-[90%] max-w-sm">
          <div className="liquid-glass border border-accent/30 bg-black/90 text-white px-6 py-4 rounded-full flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <span className="text-xs font-semibold truncate">Removed {lastRemovedItem.name} ({lastRemovedItem.selectedSize})</span>
            <button
              onClick={handleUndoRemove}
              className="text-xs text-accent hover:text-accent-rose font-bold uppercase tracking-wider underline cursor-pointer shrink-0 ml-3"
            >
              Undo
            </button>
          </div>
        </div>
      )}

      {/* Stock Check Modal / Dialog */}
      {stockCheckDialog?.open && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in duration-300">
          <div className="liquid-glass border border-accent/20 max-w-xl w-full bg-zinc-950 p-6 rounded-3xl space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <h3 className="font-serif text-2xl text-white">Stock Availability Notice</h3>
              <p className="text-xs text-muted-foreground">Some products in your selection have stock limitations or are unavailable.</p>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {/* Out of Stock / Partially Out of Stock Items */}
              {stockCheckDialog.outOfStockItems.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs uppercase tracking-widest text-rose-400 font-bold">Out of Stock / Insufficient Quantities</h4>
                  <div className="space-y-2">
                    {stockCheckDialog.outOfStockItems.map(({ item, maxAvailable, reason }) => (
                      <div key={`${item.productId}-${item.selectedSize}`} className="p-3 bg-rose-950/10 border border-rose-500/10 rounded-2xl flex items-center gap-3">
                        <img src={item.image} className="w-10 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{item.name} ({item.selectedSize})</div>
                          <div className="text-[10px] text-rose-400 font-medium mt-0.5">{reason}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fully In Stock Items */}
              {stockCheckDialog.inStockItems.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">In Stock & Ready for Delivery</h4>
                  <div className="space-y-2">
                    {stockCheckDialog.inStockItems.map(({ item, maxAvailable }) => (
                      <div key={`${item.productId}-${item.selectedSize}`} className="p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                        <img src={item.image} className="w-10 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{item.name} ({item.selectedSize})</div>
                          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">Quantity: {Math.min(item.qty, maxAvailable)} pieces fully available</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setStockCheckDialog(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all"
              >
                Cancel Order
              </button>
              <button
                onClick={handleConfirmStockAdjustment}
                className="flex-1 bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all"
              >
                Yes, Continue with Available Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Combined Size & Quantity Selection Modal */}
      {editItemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="liquid-glass relative w-full max-w-md p-6 rounded-3xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-6 text-foreground">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <img
                  src={editItemModal.item.image}
                  alt={editItemModal.item.name}
                  className="w-12 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-bold truncate">{editItemModal.item.name}</h3>
                  {editItemModal.item.house && (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{editItemModal.item.house}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditItemModal(null)}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Size Selection Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-accent">Select Size</label>
                <span className="text-[11px] text-muted-foreground">
                  Available Stock: <span className="font-bold text-accent font-mono">{editItemModal.currentStock} units</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {editItemModal.availableSizes.map((sz) => {
                  const stock = editItemModal.stockPerSize[sz] ?? 0;
                  const isSelected = editItemModal.selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleModalSelectSize(sz)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-accent/15 border-accent text-accent shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                          : stock > 0
                          ? "bg-white/5 border-white/10 hover:border-white/25 text-foreground"
                          : "bg-white/[0.02] border-white/5 text-muted-foreground/40 cursor-not-allowed"
                      }`}
                    >
                      <span className="font-bold text-sm uppercase">{sz}</span>
                      <span className="font-mono text-[11px] opacity-85">
                        {stock > 0 ? `${stock}` : "Out of stock"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selection Section */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-accent">Select Quantity</label>

              <div className="flex items-center gap-3">
                {/* Dropdown (1-10) */}
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground block mb-1 font-semibold uppercase tracking-wider">Quick Selection</label>
                  <select
                    value={editItemModal.qty <= 10 ? editItemModal.qty : ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleModalUpdateQty(parseInt(e.target.value, 10));
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-semibold text-foreground outline-none focus:border-accent"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-zinc-950 text-white">
                        {i + 1}
                      </option>
                    ))}
                    {editItemModal.qty > 10 && (
                      <option value={editItemModal.qty} className="bg-zinc-950 text-white">
                        {editItemModal.qty} (Custom)
                      </option>
                    )}
                  </select>
                </div>

                {/* Custom Input */}
                <div className="w-32">
                  <label className="text-[10px] text-muted-foreground block mb-1 font-semibold uppercase tracking-wider">Custom Qty</label>
                  <input
                    type="number"
                    min="1"
                    max={editItemModal.currentStock}
                    value={editItemModal.customQtyInput}
                    onChange={(e) => handleModalCustomQtyInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent font-mono font-bold"
                  />
                </div>
              </div>

              {/* Stock Validation Alert */}
              {editItemModal.errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editItemModal.errorMsg}</span>
                </div>
              )}
            </div>

            {/* Footer Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditItemModal(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={Boolean(editItemModal.errorMsg) || editItemModal.qty <= 0}
                onClick={handleModalSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-rose text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save / Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
