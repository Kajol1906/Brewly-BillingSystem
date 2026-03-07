import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Camera, Music, Cake, Palette, Star, Phone, CheckCircle, Clock, X } from 'lucide-react';
import { getAllVendors, createVendor, updateVendorStatus, Vendor } from '../../services/vendorService';

const categoryIcons = {
  photographer: Camera,
  dj: Music,
  cake: Cake,
  decorator: Palette,
};

const categoryColors = {
  photographer: 'from-[#6C63FF] to-[#93E5AB]',
  dj: 'from-[#FFC8A2] to-[#FFD66C]',
  cake: 'from-[#FFB3D9] to-[#FFD66C]',
  decorator: 'from-[#C9B3FF] to-[#93E5AB]',
};

export default function VendorManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'photographer',
    phone: '',
    price: '',
  });

  const categories = [
    { id: 'all', label: 'All Vendors' },
    { id: 'photographer', label: 'Photographers' },
    { id: 'dj', label: 'DJs' },
    { id: 'cake', label: 'Cake Suppliers' },
    { id: 'decorator', label: 'Decorators' },
  ];

  /* ================= LOAD VENDORS ================= */
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await getAllVendors();
      setVendors(data);
    } catch (err) {
      console.error("Failed to load vendors", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */
  const handleAddVendor = async () => {
    if (!newVendor.name || !newVendor.phone) {
      alert("Name and phone are required");
      return;
    }

    const created = await createVendor(newVendor as any);
    if (created) {
      setVendors([...vendors, created]);
      setShowAddModal(false);
      setNewVendor({ name: '', category: 'photographer', phone: '', price: '' });
    } else {
      alert("Failed to create vendor");
    }
  };

  const handleAssign = async (id: number) => {
    await updateVendorStatus(id, 'booked');
    fetchVendors(); // Refresh to show update
  };

  const handleFree = async (id: number) => {
    await updateVendorStatus(id, 'available');
    fetchVendors(); // Refresh to show update
  };


  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-xs">Available</span>
          </div>
        );
      case 'busy':
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-[#FFD66C]/20 text-[#FFD66C] rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-xs">Busy</span>
          </div>
        );
      case 'booked':
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-full">
            <span className="text-xs">Booked</span>
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1>Vendor Management</h1>
        <p className="text-muted-foreground mt-1">
          Connect with trusted event vendors
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 transition-all shadow-soft-sm"
          />
        </div>

        {/* Add Vendor */}
        <motion.button
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-12 px-6 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl flex items-center gap-2 shadow-soft hover:shadow-hover transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Vendor</span>
        </motion.button>
      </div>

      {/* Category Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2 mb-8"
      >
        {categories.map(category => (
          <motion.button
            key={category.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-4 py-2 rounded-lg whitespace-nowrap transition-all
              ${selectedCategory === category.id
                ? 'bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white shadow-soft'
                : 'bg-card border border-border hover:border-[#6C63FF]/30'
              }
            `}
          >
            {category.label}
          </motion.button>
        ))}
      </motion.div>

      {loading && <p>Loading vendors...</p>}

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVendors.map((vendor, index) => {
          const Icon = categoryIcons[vendor.category] || Star;
          const colorGradient = categoryColors[vendor.category] || 'from-gray-400 to-gray-500';

          return (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-hover transition-all"
            >
              {/* Category Header */}
              <div className={`h-24 bg-gradient-to-br ${colorGradient} flex items-center justify-center relative`}>
                <Icon className="w-12 h-12 text-white" />
                <div className="absolute top-3 right-3">
                  {getAvailabilityBadge(vendor.availability)}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="mb-2">{vendor.name}</h4>
                <p className="text-sm text-muted-foreground capitalize mb-3">
                  {vendor.category}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(vendor.rating)
                            ? 'fill-[#FFD66C] text-[#FFD66C]'
                            : 'text-muted'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{vendor.rating}</span>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Price info </span>
                    <span className="text-[#6C63FF]">{vendor.price}</span>
                  </div>
                </div>

                {/* Action Button */}
                {vendor.availability === 'booked' ? (
                  <motion.button
                    onClick={() => handleFree(vendor.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-10 rounded-xl transition-all bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-500"
                  >
                    Mark Available
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => handleAssign(vendor.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                        w-full h-10 rounded-xl transition-all
                        bg-gradient-to-r ${colorGradient} text-white shadow-soft hover:shadow-hover
                      `}
                  >
                    Assign to Event
                  </motion.button>
                )}

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl w-[400px] space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add New Vendor</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <input
              placeholder="Vendor Name"
              className="w-full border p-2 rounded-lg"
              value={newVendor.name}
              onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
            />

            <select
              className="w-full border p-2 rounded-lg"
              value={newVendor.category}
              onChange={e => setNewVendor({ ...newVendor, category: e.target.value as any })}
            >
              <option value="photographer">Photographer</option>
              <option value="dj">DJ</option>
              <option value="cake">Cake Supplier</option>
              <option value="decorator">Decorator</option>
            </select>

            <input
              placeholder="Phone Number"
              className="w-full border p-2 rounded-lg"
              value={newVendor.phone}
              onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
            />

            <input
              placeholder="Price (e.g. ₹15,000)"
              className="w-full border p-2 rounded-lg"
              value={newVendor.price}
              onChange={e => setNewVendor({ ...newVendor, price: e.target.value })}
            />

            <button
              onClick={handleAddVendor}
              className="w-full bg-[#6C63FF] text-white py-2 rounded-lg hover:bg-[#5a52d5]"
            >
              Save Vendor
            </button>
          </div>
        </div>
      )}

    </div>
  );
}



