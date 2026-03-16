import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, Search, Plus, Minus, CreditCard, Percent, Receipt, Split } from 'lucide-react';
import type { Table } from './POSScreen';
import { getAvailableMenuItems, getCategories, MenuItem } from '../../services/menuService';
import { API_BASE } from '../../config/api';


interface OrderSidebarProps {
  table: Table;
  onClose: () => void;
}

export default function OrderSidebar({ table, onClose }: OrderSidebarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [placedItems, setPlacedItems] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [dialogMsg, setDialogMsg] = useState<string | null>(null);
  const [dialogOnClose, setDialogOnClose] = useState<(() => void) | null>(null);

  useEffect(() => {
    getAvailableMenuItems().then(setMenuItems);
    getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) setSelectedCategory(cats[0]);
    });
  }, []);

  useEffect(() => {
    if (table.status === 'occupied') {
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
  }, [table]);

  const filteredItems = menuItems.filter(
    item => item.category === selectedCategory && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };


  // Helper to submit orders without closing UI
  const submitOrder = async () => {
    try {
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
            tableId: table.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to place order for ${item.name}`);
        }
      }
      setDialogMsg('Order placed successfully! Table is now occupied.');
      setDialogOnClose(() => () => { setCart([]); onClose(); });
    } catch (error: any) {
      setDialogMsg(`Order failed: ${error.message || "Unknown error"}`);
      console.error(error);
    }
  };


  const handleGenerateBill = async (paymentMethod: 'CASH' | 'UPI') => {
    try {
      // 1. If items in cart, place order first to update stock/revenue
      if (cart.length > 0) {
        await submitOrder();
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
          tableId: table.id,
          totalAmount: finalAmount,
          paymentMethod: paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate bill");
      }

      setDialogMsg(`Bill generated successfully via ${paymentMethod}! Table is now free.`);
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
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

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
        className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Table {table.tableNumber}</h3>
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium mt-1 ${table.status === 'occupied' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${table.status === 'occupied' ? 'bg-red-500' : 'bg-green-500'
                }`} />
              {table.status.toUpperCase()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
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
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
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
          {filteredItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(item)}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="text-left">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500 font-medium">₹{item.price}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Cart Items */}
        {(cart.length > 0 || placedItems.length > 0) && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h4 className="mb-3 font-semibold text-gray-900">Order Summary</h4>
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {/* Placed Items */}
              {placedItems.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Placed Items</h5>
                  <div className="space-y-2">
                    {placedItems.map(item => (
                      <div key={`placed-${item.id}`} className="flex items-center justify-between text-sm opacity-80">
                        <span className="text-gray-700">{item.name} <span className="text-gray-400 ml-1">x{item.quantity}</span></span>
                        <div className="flex items-center gap-3">
                          <span className="w-16 text-right font-medium text-gray-700">₹{item.price * item.quantity}</span>
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
                        <span className="text-gray-800 font-medium">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                          <span className="w-16 text-right font-medium text-gray-800">₹{item.price * item.quantity}</span>
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
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax (5%)</span>
              <span className="font-medium text-gray-800">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 text-lg">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
            >
              <Percent className="w-4 h-4" />
              <span className="text-sm font-medium">Discount</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
            >
              <Split className="w-4 h-4" />
              <span className="text-sm font-medium">Split Bill</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <motion.button
              onClick={submitOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-2 flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-danger to-[#FF8E8B] text-white rounded-xl shadow-soft hover:shadow-hover transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Place Order</span>
            </motion.button>
            <motion.button
              onClick={() => handleGenerateBill('CASH')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-secondary to-warning text-white rounded-xl shadow-soft hover:shadow-hover transition-all"
            >
              <Receipt className="w-5 h-5" />
              <span>Generate Bill</span>
            </motion.button>
            <motion.button
              onClick={() => handleGenerateBill('UPI')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-soft hover:shadow-hover transition-all"
            >
              <CreditCard className="w-5 h-5" />
              <span>Pay via UPI</span>
            </motion.button>

          </div>
        </div>
      </motion.div>

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
              style={{ padding: '10px 32px', borderRadius: '10px', border: 'none', backgroundColor: '#6C63FF', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              OK
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}



