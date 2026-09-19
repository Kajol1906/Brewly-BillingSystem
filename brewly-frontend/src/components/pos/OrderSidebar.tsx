import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, Search, Plus, Minus, CreditCard, Percent, Receipt, Split, ShoppingBag } from 'lucide-react';
import type { Table } from './POSScreen';
import { getAvailableMenuItems, MenuItem } from '../../services/menuService';
import { API_BASE } from '../../config/api';
import { useWebSocket } from '../../services/useWebSocket';


interface OrderSidebarProps {
  table: Table | null;
  onClose: () => void;
}

export default function OrderSidebar({ table, onClose }: OrderSidebarProps) {
  const isTakeaway = table === null;
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [placedItems, setPlacedItems] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [dialogMsg, setDialogMsg] = useState<string | null>(null);
  const [dialogOnClose, setDialogOnClose] = useState<(() => void) | null>(null);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [customDiscount, setCustomDiscount] = useState('');
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [takeawayName, setTakeawayName] = useState('');
  const [showTakeawayPaymentModal, setShowTakeawayPaymentModal] = useState(false);

  useEffect(() => {
    if (isTakeaway) {
      setTakeawayName(`Takeaway-${Date.now()}`);
    } else {
      setTakeawayName('');
    }
  }, [table, isTakeaway]);

  const refreshMenuItems = () => {
    getAvailableMenuItems().then(items => {
      setMenuItems(items);
      const cats = [...new Set(items.map(item => item.category))].sort();
      setCategories(cats);
      setSelectedCategory(prev => {
        if (prev && cats.includes(prev)) return prev;
        return cats.length > 0 ? cats[0] : '';
      });
    });
  };

  useEffect(() => {
    refreshMenuItems();
  }, []);

  useWebSocket('/topic/menu', refreshMenuItems);

  useEffect(() => {
    if (!isTakeaway && table.status === 'occupied') {
      fetch(`${API_BASE}/api/pos/table/${table.id}/active`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
        .then(res => res.json())
        .then(data => setPlacedItems(data))
        .catch(err => console.error("Failed to fetch placed items:", err));
    } else {
      setPlacedItems([]);
    }
  }, [table, isTakeaway]);

  const filteredItems = menuItems.filter(
    item => item.category === selectedCategory && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    if (item.available === false) return; // Block out of stock items
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };


  // Silent helper — places all cart items, throws on any failure (no dialog, no close)
  const placeCartOrders = async () => {
    for (const item of cart) {
      const response = await fetch(`${API_BASE}/api/pos/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          menuItemId: item.id,
          quantity: item.quantity,
          tableId: isTakeaway ? null : table!.id,
          takeawayName: isTakeaway ? takeawayName : null,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Failed to place order for ${item.name}`);
      }
    }
  };

  // "Place Order" button handler
  const submitOrder = async () => {
    if (cart.length === 0) return;
    try {
      await placeCartOrders();
      if (isTakeaway) {
        setDialogMsg('Takeaway order sent to kitchen!');
        setDialogOnClose(() => () => { setCart([]); });
      } else {
        setDialogMsg('Order placed successfully! Table is now occupied.');
        setDialogOnClose(() => () => { setCart([]); onClose(); });
      }
    } catch (error: any) {
      setDialogMsg(`Order failed: ${error.message || "Unknown error"}`);
      console.error(error);
    }
  };


  const handleGenerateBill = async (paymentMethod: 'CASH' | 'UPI') => {
    try {
      // 1. If items in cart, place them silently first (no dialog)
      if (cart.length > 0) {
        await placeCartOrders();
      }

      // 2. Generate Bill and Clear Table
      const finalAmount = total;

      const response = await fetch(`${API_BASE}/api/billing/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tableId: isTakeaway ? null : table!.id,
          takeawayName: isTakeaway ? takeawayName : null,
          totalAmount: finalAmount,
          paymentMethod: paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate bill");
      }

      const successMsg = isTakeaway
        ? `Takeaway order completed! Payment via ${paymentMethod}.`
        : `Bill generated successfully via ${paymentMethod}! Table is now free.`;
      setDialogMsg(successMsg);
      setDialogOnClose(() => () => { setCart([]); onClose(); });
    } catch (error: any) {
      setDialogMsg(`Transaction failed: ${error.message || "Unknown error"}`);
      console.error(error);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const newSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const placedSubtotal = placedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = newSubtotal + placedSubtotal;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-[480px] bg-card shadow-2xl z-50 flex flex-col border-l border-border"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-card">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {isTakeaway ? 'Takeaway Order' : `Table ${table!.tableNumber}`}
            </h3>
            {isTakeaway ? (
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium mt-1 bg-amber-100 text-amber-700">
                <ShoppingBag className="w-3 h-3" />
                TAKEAWAY
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium mt-1 ${table!.status === 'occupied' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${table!.status === 'occupied' ? 'bg-red-500' : 'bg-green-500'}`} />
                {table!.status.toUpperCase()}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(category => (
              <motion.button
                key={category}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                    : 'bg-card text-muted-foreground hover:bg-muted border border-border'
                  }
                `}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredItems.length === 0 && (
            <p className="text-center text-gray-400 py-8">No items found</p>
          )}
          {filteredItems.map(item => {
            const isOutOfStock = item.available === false;
            return (
              <motion.button
                key={item.id}
                whileHover={isOutOfStock ? {} : { x: 4 }}
                whileTap={isOutOfStock ? {} : { scale: 0.98 }}
                onClick={() => addToCart(item)}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-between p-4 bg-card border rounded-xl transition-all ${
                  isOutOfStock 
                    ? 'opacity-55 cursor-not-allowed border-red-500/20 shadow-none' 
                    : 'border-border hover:shadow-md hover:border-primary/50'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground font-medium">₹{item.price}</p>
                    {isOutOfStock && (
                      <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Out of stock
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isOutOfStock 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'bg-gradient-to-br from-primary to-accent text-white'
                }`}>
                  {isOutOfStock ? (
                    <span className="text-xs font-bold font-sans">✕</span>
                  ) : (
                    <Plus className="w-4 h-4 text-white" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Cart Items */}
        {(cart.length > 0 || placedItems.length > 0) && (
          <div className="border-t border-border p-6 bg-background">
            <h4 className="mb-3 font-semibold text-foreground">Order Summary</h4>
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {/* Placed Items */}
              {placedItems.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Placed Items</h5>
                  <div className="space-y-2">
                    {placedItems.map(item => (
                      <div key={`placed-${item.id}`} className="flex items-center justify-between text-sm opacity-80">
                        <span className="text-foreground opacity-80">{item.name} <span className="text-muted-foreground ml-1">x{item.quantity}</span></span>
                        <div className="flex items-center gap-3">
                          <span className="w-16 text-right font-medium text-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Items */}
              {cart.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-primary uppercase mb-2">New Items</h5>
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={`new-${item.id}`} className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-md bg-muted hover:bg-muted/80 border border-border/50 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3 text-muted-foreground" />
                            </button>
                            <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-md bg-muted hover:bg-muted/80 border border-border/50 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                          <span className="w-16 text-right font-medium text-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing Bar */}
        <div className="border-t border-border p-6 bg-card">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">Discount ({discountPercent}%)</span>
                <span className="text-green-600 font-medium">- ₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-foreground text-lg">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              onClick={() => setShowDiscountModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 h-10 px-4 rounded-lg transition-colors ${discountPercent > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
            >
              <Percent className="w-4 h-4" />
              <span className="text-sm font-medium">{discountPercent > 0 ? `${discountPercent}% Off` : 'Discount'}</span>
            </motion.button>
            <motion.button
              onClick={() => setShowSplitModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-foreground"
            >
              <Split className="w-4 h-4" />
              <span className="text-sm font-medium">Split Bill</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <motion.button
              onClick={isTakeaway ? () => setShowTakeawayPaymentModal(true) : submitOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={cart.length === 0}
              className={`col-span-2 flex items-center justify-center gap-2 h-12 rounded-xl shadow-soft hover:shadow-hover transition-all ${
                cart.length === 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-primary to-accent text-white'
              }`}
            >
              {isTakeaway ? (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Place Order & Pay</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Place Order</span>
                </>
              )}
            </motion.button>
            {!isTakeaway && (
              <>
                <motion.button
                  onClick={() => handleGenerateBill('CASH')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-soft hover:shadow-hover transition-all"
                >
                  <Receipt className="w-5 h-5" />
                  <span>Generate Bill</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowUpiModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-soft hover:shadow-hover transition-all"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Pay via UPI</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {showUpiModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <style>{`
            @keyframes scan {
              0% { top: 10px; }
              50% { top: 210px; }
              100% { top: 10px; }
            }
          `}</style>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl border"
            style={{ backgroundColor: '#FAF6F0', borderColor: 'rgba(92,61,46,0.2)' }}
          >
            {/* Modal Header */}
            <div className="p-6 text-center border-b" style={{ backgroundColor: '#5C3D2E', borderColor: 'rgba(255,255,255,0.1)' }}>
              <h4 className="text-xl font-serif font-bold text-[#FAF6F0]">Scan & Pay via UPI</h4>
              <p className="text-xs text-[#FAF6F0]/80 mt-1">Brewly Contactless Bill Checkout</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col items-center">
              {/* Receipt info */}
              <div className="w-full bg-white/50 border border-[#5C3D2E]/10 rounded-xl p-4 mb-6 flex justify-between items-center text-sm">
                <div>
                  <span className="text-[#8C7B6B] block text-xs uppercase font-semibold">Amount to Pay</span>
                  <span className="text-2xl font-bold text-[#2C1810]">₹{total.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#8C7B6B] block text-xs uppercase font-semibold">Table Reference</span>
                  <span className="text-sm font-bold text-[#5C3D2E]">
                    {isTakeaway ? 'Takeaway Order' : `Table ${table!.tableNumber}`}
                  </span>
                </div>
              </div>

              {/* QR Container with scanning animation line */}
              <div className="relative p-4 bg-white rounded-2xl border border-[#5C3D2E]/15 shadow-md flex items-center justify-center overflow-hidden w-[220px] h-[220px] mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `upi://pay?pa=brewlycafe@oksbi&pn=Brewly%20Cafe&am=${total.toFixed(2)}&cu=INR`
                  )}`}
                  alt="UPI QR Code"
                  className="w-[180px] h-[180px]"
                />
                {/* Glowing scanning laser bar */}
                <div className="absolute left-0 right-0 h-1 bg-[#c8956c]/60 shadow-[0_0_10px_#c8956c] animate-[scan_2s_linear_infinite]" />
              </div>

              {/* Status info */}
              <div className="text-center text-xs text-[#8C7B6B] px-4 mb-6 leading-relaxed">
                Scan using standard UPI apps like <span className="font-semibold text-[#5C3D2E]">GPay, PhonePe, or Paytm</span> to complete.
              </div>

              {/* Actions */}
              <div className="w-full flex gap-3">
                <button
                  onClick={() => setShowUpiModal(false)}
                  className="flex-1 h-12 rounded-xl text-sm font-semibold border border-[#5C3D2E]/20 text-[#5C3D2E] hover:bg-[#5C3D2E]/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowUpiModal(false);
                    handleGenerateBill('UPI');
                  }}
                  className="flex-1 h-12 rounded-xl text-sm font-bold text-white shadow-soft hover:shadow-hover transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #5C3D2E, #2C1810)'
                  }}
                >
                  Confirm Paid
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {dialogMsg && createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '420px', padding: '36px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: '#1a1a1a', marginBottom: '28px', lineHeight: '1.5' }}>{dialogMsg}</p>
            <button
              onClick={() => {
                setDialogMsg(null);
                if (dialogOnClose) dialogOnClose();
                setDialogOnClose(null);
              }}
              style={{ padding: '10px 32px', borderRadius: '10px', border: 'none', backgroundColor: '#5C3D2E', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              OK
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Discount Modal */}
      {showDiscountModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[380px] rounded-3xl overflow-hidden shadow-2xl border"
            style={{ backgroundColor: '#FAF6F0', borderColor: 'rgba(92,61,46,0.2)' }}
          >
            <div className="p-6 text-center border-b" style={{ borderColor: 'rgba(92,61,46,0.1)' }}>
              <h4 className="text-xl font-serif font-bold text-[#2C1810]">Apply Discount</h4>
              <p className="text-xs text-[#8C7B6B] mt-1">Select a preset or enter custom percentage</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[5, 10, 15, 20].map(pct => (
                  <button
                    key={pct}
                    onClick={() => { setDiscountPercent(pct); setCustomDiscount(''); }}
                    className={`h-12 rounded-xl text-sm font-bold transition-all border ${
                      discountPercent === pct
                        ? 'bg-[#5C3D2E] text-white border-[#5C3D2E] shadow-md'
                        : 'bg-white text-[#2C1810] border-[#5C3D2E]/15 hover:border-[#5C3D2E]/40'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="mb-5">
                <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wide mb-2">Custom %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter custom discount %"
                  value={customDiscount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomDiscount(val);
                    const num = parseFloat(val);
                    if (!isNaN(num) && num >= 0 && num <= 100) {
                      setDiscountPercent(num);
                    }
                  }}
                  className="w-full h-11 px-4 text-sm rounded-xl border bg-white text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#5C3D2E]/30 font-medium"
                  style={{ borderColor: 'rgba(92,61,46,0.15)' }}
                />
              </div>
              {discountPercent > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-center">
                  <span className="text-green-700 font-bold text-sm">
                    Saving ₹{(subtotal * discountPercent / 100).toFixed(2)} ({discountPercent}% off)
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setDiscountPercent(0); setCustomDiscount(''); setShowDiscountModal(false); }}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold border border-[#5C3D2E]/20 text-[#5C3D2E] hover:bg-[#5C3D2E]/5 transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => setShowDiscountModal(false)}
                  className="flex-1 h-11 rounded-xl text-sm font-bold text-white shadow-soft transition-all"
                  style={{ background: 'linear-gradient(135deg, #5C3D2E, #2C1810)' }}
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Split Bill Modal */}
      {showSplitModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[380px] rounded-3xl overflow-hidden shadow-2xl border"
            style={{ backgroundColor: '#FAF6F0', borderColor: 'rgba(92,61,46,0.2)' }}
          >
            <div className="p-6 text-center border-b" style={{ borderColor: 'rgba(92,61,46,0.1)' }}>
              <h4 className="text-xl font-serif font-bold text-[#2C1810]">Split Bill</h4>
              <p className="text-xs text-[#8C7B6B] mt-1">Divide the total equally among guests</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-6 mb-6">
                <button
                  onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                  className="w-12 h-12 rounded-xl bg-white border border-[#5C3D2E]/15 flex items-center justify-center text-[#5C3D2E] font-bold text-xl hover:bg-[#5C3D2E]/5 transition-colors"
                >
                  −
                </button>
                <div className="text-center">
                  <span className="text-4xl font-bold text-[#2C1810]">{splitCount}</span>
                  <p className="text-xs text-[#8C7B6B] mt-1">people</p>
                </div>
                <button
                  onClick={() => setSplitCount(Math.min(20, splitCount + 1))}
                  className="w-12 h-12 rounded-xl bg-white border border-[#5C3D2E]/15 flex items-center justify-center text-[#5C3D2E] font-bold text-xl hover:bg-[#5C3D2E]/5 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="bg-[#5C3D2E]/5 rounded-2xl p-5 mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8C7B6B] font-medium">Total Bill</span>
                  <span className="font-bold text-[#2C1810]">₹{total.toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed border-[#5C3D2E]/15" />
                <div className="flex justify-between">
                  <span className="text-[#5C3D2E] font-semibold">Per Person</span>
                  <span className="text-2xl font-bold text-[#2C1810]">₹{(total / splitCount).toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => setShowSplitModal(false)}
                className="w-full h-11 rounded-xl text-sm font-bold text-white shadow-soft transition-all"
                style={{ background: 'linear-gradient(135deg, #5C3D2E, #2C1810)' }}
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {showTakeawayPaymentModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[400px] rounded-3xl overflow-hidden shadow-2xl border"
            style={{ backgroundColor: '#FAF6F0', borderColor: 'rgba(92,61,46,0.2)' }}
          >
            {/* Modal Header */}
            <div className="p-6 text-center border-b" style={{ backgroundColor: '#5C3D2E', borderColor: 'rgba(255,255,255,0.1)' }}>
              <h4 className="text-xl font-serif font-bold text-[#FAF6F0]">Generate Takeaway Bill</h4>
              <p className="text-xs text-[#FAF6F0]/80 mt-1">Select payment method to complete order</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col items-center">
              <div className="w-full bg-white/50 border border-[#5C3D2E]/10 rounded-xl p-4 mb-6 flex justify-between items-center text-sm">
                <div>
                  <span className="text-[#8C7B6B] block text-xs uppercase font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#2C1810]">₹{total.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#8C7B6B] block text-xs uppercase font-semibold">Order Type</span>
                  <span className="text-sm font-bold text-[#5C3D2E]">Takeaway</span>
                </div>
              </div>

              <div className="w-full space-y-3 mb-6">
                <button
                  onClick={() => {
                    setShowTakeawayPaymentModal(false);
                    handleGenerateBill('CASH');
                  }}
                  className="w-full h-12 rounded-xl text-sm font-bold border border-[#5C3D2E]/25 text-[#5C3D2E] bg-white hover:bg-[#5C3D2E]/5 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Receipt className="w-4 h-4" />
                  Pay via Cash & Generate Bill
                </button>
                <button
                  onClick={() => {
                    setShowTakeawayPaymentModal(false);
                    setShowUpiModal(true);
                  }}
                  className="w-full h-12 rounded-xl text-sm font-bold text-white shadow-soft hover:shadow-hover transition-all flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #5C3D2E, #2C1810)'
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  Pay via UPI (Scan QR)
                </button>
              </div>

              <button
                onClick={() => setShowTakeawayPaymentModal(false)}
                className="w-full h-10 rounded-xl text-xs font-semibold text-[#8C7B6B] hover:text-[#5C3D2E] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}



