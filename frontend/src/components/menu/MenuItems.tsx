import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Grid, List } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
  imageColor: string;
}

const mockItems: MenuItem[] = [
  { id: 1, name: 'Cappuccino', price: 120, category: 'Coffee', available: true, imageColor: 'from-[#6C63FF] to-[#93E5AB]' },
  { id: 2, name: 'Latte', price: 130, category: 'Coffee', available: true, imageColor: 'from-[#FFC8A2] to-[#FFD66C]' },
  { id: 3, name: 'Espresso', price: 90, category: 'Coffee', available: true, imageColor: 'from-[#93E5AB] to-[#6C63FF]' },
  { id: 4, name: 'Croissant', price: 80, category: 'Snacks', available: false, imageColor: 'from-[#FFD66C] to-[#FFC8A2]' },
  { id: 5, name: 'Sandwich', price: 150, category: 'Snacks', available: true, imageColor: 'from-[#6C63FF] to-[#FFC8A2]' },
  { id: 6, name: 'Cake Slice', price: 110, category: 'Desserts', available: true, imageColor: 'from-[#FFB3D9] to-[#FFD66C]' },
];

export default function MenuItems() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<MenuItem[]>(mockItems);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Coffee', 'Snacks', 'Beverages', 'Desserts'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 transition-all shadow-soft-sm"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`
              w-12 h-12 rounded-xl border border-border flex items-center justify-center transition-all
              ${viewMode === 'grid' ? 'bg-[#6C63FF] text-white' : 'bg-white hover:bg-muted/50'}
            `}
          >
            <Grid className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`
              w-12 h-12 rounded-xl border border-border flex items-center justify-center transition-all
              ${viewMode === 'list' ? 'bg-[#6C63FF] text-white' : 'bg-white hover:bg-muted/50'}
            `}
          >
            <List className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Add Item Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-12 px-6 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl flex items-center gap-2 shadow-soft hover:shadow-hover transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </motion.button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-lg whitespace-nowrap transition-all
              ${selectedCategory === category
                ? 'bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white shadow-soft'
                : 'bg-white border border-border hover:border-[#6C63FF]/30'
              }
            `}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Items Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-hover transition-all"
            >
              {/* Image Placeholder */}
              <div className={`h-40 bg-gradient-to-br ${item.imageColor} flex items-center justify-center relative`}>
                <span className="text-white text-4xl">☕</span>
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm px-3 py-1 bg-red-500 rounded-full">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4>{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <p className="text-[#6C63FF]">₹{item.price}</p>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`
                      relative w-12 h-6 rounded-full transition-all
                      ${item.available ? 'bg-[#4CAF50]' : 'bg-muted'}
                    `}
                  >
                    <motion.div
                      animate={{ x: item.available ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-soft"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Available</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-border hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">{item.name}</td>
                  <td className="p-4 text-muted-foreground">{item.category}</td>
                  <td className="p-4 text-[#6C63FF]">₹{item.price}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`
                        relative w-12 h-6 rounded-full transition-all
                        ${item.available ? 'bg-[#4CAF50]' : 'bg-muted'}
                      `}
                    >
                      <motion.div
                        animate={{ x: item.available ? 24 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-soft"
                      />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
