import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, Plus, Minus, CreditCard, Percent, Receipt, Split } from 'lucide-react';
import type { Table } from './POSScreen';

interface OrderSidebarProps {
  table: Table;
  onClose: () => void;
}

const categories = ['Coffee', 'Snacks', 'Beverages', 'Desserts'];

const menuItems = [
  { id: 1, name: 'Cappuccino', price: 120, category: 'Coffee' },
  { id: 2, name: 'Latte', price: 130, category: 'Coffee' },
  { id: 3, name: 'Espresso', price: 90, category: 'Coffee' },
  { id: 4, name: 'Croissant', price: 80, category: 'Snacks' },
  { id: 5, name: 'Sandwich', price: 150, category: 'Snacks' },
  { id: 6, name: 'Cake Slice', price: 110, category: 'Desserts' },
  { id: 7, name: 'Ice Tea', price: 70, category: 'Beverages' },
  { id: 8, name: 'Fresh Juice', price: 100, category: 'Beverages' },
];

export default function OrderSidebar({ table, onClose }: OrderSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState('Coffee');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(
    item => item.category === selectedCategory && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: typeof menuItems[0]) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
        className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Table {table.number}</h3>
              <p className="text-sm text-muted-foreground">
                {table.seats} seats · {table.status}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted/50 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <motion.button
                key={category}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap transition-all
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white shadow-soft'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
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
          {filteredItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(item)}
              className="w-full flex items-center justify-between p-4 bg-white border border-border rounded-xl hover:shadow-soft transition-all"
            >
              <div className="text-left">
                <p>{item.name}</p>
                <p className="text-sm text-muted-foreground">₹{item.price}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#93E5AB] flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Cart Items */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 bg-muted/20">
            <h4 className="mb-3">Order Summary</h4>
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-md bg-muted hover:bg-muted-foreground/20 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-md bg-muted hover:bg-muted-foreground/20 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="w-16 text-right">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing Bar */}
        <div className="border-t border-border p-6 bg-white">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <Percent className="w-4 h-4" />
              <span className="text-sm">Discount</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <Split className="w-4 h-4" />
              <span className="text-sm">Split Bill</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-[#FFC8A2] to-[#FFD66C] text-white rounded-xl shadow-soft hover:shadow-hover transition-all"
            >
              <Receipt className="w-5 h-5" />
              <span>Generate Bill</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl shadow-soft hover:shadow-hover transition-all"
            >
              <CreditCard className="w-5 h-5" />
              <span>Pay via UPI</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
