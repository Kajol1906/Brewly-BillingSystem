import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Search, Plus, Grid, List, Settings, Pencil, Upload, X, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { addMenuItem, getCategories, getCategoryCounts, deleteCategory, reassignCategory, updateMenuItem, bulkImportMenuItems } from "../services/menuService";


import {
    getAllMenuItems,
    getMenuByCategory,
    searchMenuItems,
    toggleMenuAvailability,
} from "../services/menuService";

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    available: boolean;
    imageColor?: string; // UI-only
}

export default function MenuItems() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [deleteAction, setDeleteAction] = useState<'delete' | 'move'>('delete');
    const [moveTarget, setMoveTarget] = useState('');

    const [editItem, setEditItem] = useState<MenuItem | null>(null);
    const [editForm, setEditForm] = useState({ name: '', price: 0, category: '', imageUrl: '' });

    // Excel import state
    const [showImportModal, setShowImportModal] = useState(false);
    const [importItems, setImportItems] = useState<{ name: string; price: number; category: string; valid: boolean; error?: string }[]>([]);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ imported: number; skipped: number; total: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newItem, setNewItem] = useState({
        name: "",
        price: 0,
        category: "COFFEE",
        imageUrl: "",
    });

    const [categories, setCategories] = useState<string[]>(['All', 'COFFEE', 'TEA', 'SNACKS', 'DESSERT', 'BEVERAGES']);

    /* ================= LOAD MENU ================= */
    useEffect(() => {
        fetchMenu();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const [cats, counts] = await Promise.all([getCategories(), getCategoryCounts()]);
            setCategories(['All', ...cats]);
            setCategoryCounts(counts);
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const data = await getAllMenuItems();
            setItems(data);
        } catch (err) {
            console.error("Failed to load menu", err);
        } finally {
            setLoading(false);
        }
    };


    /* ================= CATEGORY FILTER ================= */
    const handleCategoryChange = async (category: string) => {
        try {
            setSelectedCategory(category);
            setSearchQuery('');

            if (category === 'All') {
                await fetchMenu();
            } else {
                const data = await getMenuByCategory(category);
                setItems(data);
            }
        } catch (err) {
            console.error("Category fetch failed", err);
            setItems([]);
        }
    };


    /* ================= SEARCH ================= */
    const handleSearch = async (value: string) => {
        try {
            setSearchQuery(value);

            if (!value.trim()) {
                await fetchMenu();
            } else {
                const data = await searchMenuItems(value);
                setItems(data);
            }
        } catch (err) {
            console.error("Search failed", err);
        }
    };


    /* ================= TOGGLE AVAILABILITY ================= */
    const toggleAvailability = async (id: number) => {
        await toggleMenuAvailability(id);
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, available: !item.available } : item
        ));
    };


    const handleAddMenuItem = async () => {
        try {
            await addMenuItem(newItem);
            setShowAddModal(false);

            // reset form
            setNewItem({
                name: "",
                price: 0,
                category: "COFFEE",
                imageUrl: "",
            });

            fetchMenu(); // refresh list
            fetchCategories(); // refresh categories in case new one was used
        } catch (err) {
            console.error("Failed to add menu item", err);
            alert("Failed to add menu item");
        }
    };

    const handleAddCategory = () => {
        const name = newCategoryName.trim().toUpperCase();
        if (!name) return;
        if (categories.includes(name)) {
            setNewCategoryName('');
            return;
        }
        setCategories(prev => [...prev, name]);
        setCategoryCounts(prev => ({ ...prev, [name]: 0 }));
        setNewCategoryName('');
    };

    const handleDeleteCategory = async () => {
        if (!deleteTarget) return;
        try {
            if (deleteAction === 'move' && moveTarget) {
                await reassignCategory(deleteTarget, moveTarget);
            } else {
                await deleteCategory(deleteTarget);
            }
            setDeleteTarget(null);
            setDeleteAction('delete');
            setMoveTarget('');
            if (selectedCategory === deleteTarget) setSelectedCategory('All');
            await fetchMenu();
            await fetchCategories();
        } catch (err) {
            console.error("Failed to delete category", err);
        }
    };

    const openManageModal = async () => {
        await fetchCategories();
        setShowManageModal(true);
    };

    const openEditModal = (item: MenuItem) => {
        setEditItem(item);
        setEditForm({ name: item.name, price: item.price, category: item.category, imageUrl: '' });
    };

    const handleEditMenuItem = async () => {
        if (!editItem) return;
        try {
            const updated = await updateMenuItem(editItem.id, editForm);
            setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, name: updated.name, price: updated.price, category: updated.category } : i));
            setEditItem(null);
            fetchCategories();
        } catch (err) {
            console.error("Failed to edit menu item", err);
        }
    };

    /* ================= EXCEL IMPORT ================= */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

            const parsed = rows.map((row) => {
                const nameRaw = row['Name'] || row['name'] || row['ITEM'] || row['item'] || row['Item'] || row['Item Name'] || row['item name'] || '';
                const priceRaw = row['Price'] || row['price'] || row['PRICE'] || row['Rate'] || row['rate'] || 0;
                const catRaw = row['Category'] || row['category'] || row['CATEGORY'] || row['Type'] || row['type'] || '';

                const name = String(nameRaw).trim();
                const price = Number(priceRaw);
                const category = String(catRaw).trim().toUpperCase() || 'UNCATEGORIZED';

                let valid = true;
                let error = '';
                if (!name) { valid = false; error = 'Missing name'; }
                else if (!price || price <= 0 || isNaN(price)) { valid = false; error = 'Invalid price'; }

                return { name, price, category, valid, error };
            });

            setImportItems(parsed);
            setImportResult(null);
            setShowImportModal(true);
        };
        reader.readAsBinaryString(file);
    };

    const handleBulkImport = async () => {
        const validItems = importItems.filter(i => i.valid).map(({ name, price, category }) => ({ name, price, category }));
        if (validItems.length === 0) return;

        setImporting(true);
        try {
            const result = await bulkImportMenuItems(validItems);
            setImportResult(result);
            fetchMenu();
            fetchCategories();
        } catch (err) {
            console.error('Bulk import failed', err);
            alert('Import failed. Please try again.');
        } finally {
            setImporting(false);
        }
    };

    const removeImportItem = (index: number) => {
        setImportItems(prev => prev.filter((_, i) => i !== index));
    };


    /* ================= UI ================= */
    return (
        <div className="p-8 space-y-6">

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative" style={{ maxWidth: '300px', flex: '1 1 auto' }}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 shadow-soft-sm"
                    />
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center ${viewMode === 'grid' ? 'bg-[#6C63FF] text-white' : 'bg-card'
                            }`}
                    >
                        <Grid />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center ${viewMode === 'list' ? 'bg-[#6C63FF] text-white' : 'bg-card'
                            }`}
                    >
                        <List />
                    </button>
                </div>

                {/* Add Item */}
                <motion.button
                    onClick={() => setShowAddModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 px-6 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl flex items-center gap-2 shadow-soft"
                >
                    <Plus className="w-5 h-5" />
                    Add Menu Item
                </motion.button>

                {/* Manage Categories */}
                <motion.button
                    onClick={openManageModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 px-6 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl flex items-center gap-2 shadow-soft"
                >
                    <Settings className="w-5 h-5" />
                    Manage Categories
                </motion.button>

                {/* Import from Excel */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
                <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 px-6 rounded-xl flex items-center gap-2 shadow-soft"
                    style={{ background: 'linear-gradient(to right, #E67E22, #D35400)', color: '#ffffff', fontWeight: 600, fontSize: '14px' }}
                >
                    <Upload className="w-5 h-5" style={{ color: '#ffffff' }} />
                    <span style={{ color: '#ffffff' }}>Import Excel</span>
                </motion.button>

            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === cat
                            ? 'bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white'
                            : 'bg-card border'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && <p className="text-muted-foreground">Loading menu...</p>}

            {/* GRID VIEW */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div key={item.id} className="bg-card rounded-xl border shadow-soft">
                            <div className="p-4">
                                <h4>{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                <p className="text-[#6C63FF] mt-1">₹{item.price}</p>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${item.available ? 'text-green-600' : 'text-red-500'}`}>
                                            {item.available ? 'Available' : 'Unavailable'}
                                        </span>
                                        <button
                                            onClick={() => openEditModal(item)}
                                            style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Pencil style={{ width: '14px', height: '14px', color: '#6C63FF' }} />
                                        </button>
                                    </div>
                                    <div
                                        onClick={() => toggleAvailability(item.id)}
                                        style={{
                                            width: '44px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            backgroundColor: item.available ? '#22c55e' : '#d1d5db',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'background-color 0.2s',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                backgroundColor: '#fff',
                                                position: 'absolute',
                                                top: '3px',
                                                left: item.available ? '23px' : '3px',
                                                transition: 'left 0.2s',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* LIST VIEW */}
            {viewMode === 'list' && (
                <div className="bg-card rounded-xl border shadow-soft">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/30">
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4 text-left">Price</th>
                                <th className="p-4 text-left">Available</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-4">{item.name}</td>
                                    <td className="p-4">{item.category}</td>
                                    <td className="p-4">₹{item.price}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => toggleAvailability(item.id)}
                                                style={{
                                                    width: '44px',
                                                    height: '24px',
                                                    borderRadius: '12px',
                                                    backgroundColor: item.available ? '#22c55e' : '#d1d5db',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'background-color 0.2s',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#fff',
                                                        position: 'absolute',
                                                        top: '3px',
                                                        left: item.available ? '23px' : '3px',
                                                        transition: 'left 0.2s',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                            </div>
                                            <span className={`text-sm ${item.available ? 'text-green-600' : 'text-red-500'}`}>
                                                {item.available ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Pencil style={{ width: '15px', height: '15px', color: '#6C63FF' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAddModal && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '460px', padding: '36px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>Add Menu Item</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Item Name</label>
                                <input
                                    placeholder="e.g. Cappuccino"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 120"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Category</label>
                                <select
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Image URL</label>
                                <input
                                    placeholder="Optional"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={newItem.imageUrl}
                                    onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMenuItem}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#6C63FF', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showManageModal && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '480px', maxHeight: '80vh', padding: '36px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>Manage Categories</h2>

                        {/* Category list */}
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                            {categories.filter(c => c !== 'All').map(cat => (
                                <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', border: '1px solid #eee', marginBottom: '8px' }}>
                                    <div>
                                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>{cat}</span>
                                        <span style={{ fontSize: '13px', color: '#888', marginLeft: '10px' }}>
                                            {categoryCounts[cat] ?? 0} item{(categoryCounts[cat] ?? 0) !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => { setDeleteTarget(cat); setDeleteAction('delete'); setMoveTarget(''); }}
                                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add new category */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <input
                                placeholder="New category name..."
                                style={{ flex: 1, border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                            />
                            <button
                                onClick={handleAddCategory}
                                style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#6C63FF', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                                + Add
                            </button>
                        </div>

                        {/* Close */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setShowManageModal(false); setNewCategoryName(''); }}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Edit Menu Item dialog */}
            {editItem && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '460px', padding: '36px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>Edit Menu Item</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Item Name</label>
                                <input
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Price (₹)</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={editForm.price}
                                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Category</label>
                                <select
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                >
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                            <button
                                onClick={() => setEditItem(null)}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditMenuItem}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#6C63FF', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete confirmation sub-dialog */}
            {deleteTarget && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '420px', padding: '36px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1a1a1a' }}>
                            Delete "{deleteTarget}"?
                        </h2>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                            This category has <strong>{categoryCounts[deleteTarget] ?? 0}</strong> item{(categoryCounts[deleteTarget] ?? 0) !== 1 ? 's' : ''}. What would you like to do?
                        </p>

                        {/* Radio options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
                                <input
                                    type="radio"
                                    name="deleteAction"
                                    checked={deleteAction === 'delete'}
                                    onChange={() => setDeleteAction('delete')}
                                    style={{ accentColor: '#ef4444' }}
                                />
                                Delete all items in this category
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
                                <input
                                    type="radio"
                                    name="deleteAction"
                                    checked={deleteAction === 'move'}
                                    onChange={() => setDeleteAction('move')}
                                    style={{ accentColor: '#6C63FF' }}
                                />
                                Move items to another category
                            </label>

                            {deleteAction === 'move' && (
                                <select
                                    style={{ marginLeft: '28px', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
                                    value={moveTarget}
                                    onChange={(e) => setMoveTarget(e.target.value)}
                                >
                                    <option value="">Select category...</option>
                                    {categories.filter(c => c !== 'All' && c !== deleteTarget).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={() => { setDeleteTarget(null); setDeleteAction('delete'); setMoveTarget(''); }}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCategory}
                                disabled={deleteAction === 'move' && !moveTarget}
                                style={{
                                    padding: '10px 24px', borderRadius: '10px', border: 'none',
                                    backgroundColor: deleteAction === 'delete' ? '#ef4444' : '#6C63FF',
                                    color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                    opacity: (deleteAction === 'move' && !moveTarget) ? 0.5 : 1,
                                }}
                            >
                                {deleteAction === 'delete' ? 'Delete All' : 'Move & Remove'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Import Excel Preview Modal */}
            {showImportModal && createPortal(
                <div
                    onClick={() => { if (!importing) { setShowImportModal(false); setImportItems([]); setImportResult(null); } }}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#fff', borderRadius: '16px', width: '680px', maxHeight: '85vh', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FileSpreadsheet style={{ width: '24px', height: '24px', color: '#FF8C42' }} />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>
                                        {importResult ? 'Import Complete' : 'Preview Import'}
                                    </h3>
                                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6b7280' }}>
                                        {importResult
                                            ? `${importResult.imported} imported, ${importResult.skipped} skipped`
                                            : `${importItems.filter(i => i.valid).length} valid, ${importItems.filter(i => !i.valid).length} errors — ${importItems.length} total rows`
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setShowImportModal(false); setImportItems([]); setImportResult(null); }}
                                style={{ width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Import result success message */}
                        {importResult && (
                            <div style={{ padding: '16px 28px', backgroundColor: '#f0fdf4', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                                <span style={{ fontSize: '14px', color: '#15803d', fontWeight: 500 }}>
                                    Successfully imported {importResult.imported} item{importResult.imported !== 1 ? 's' : ''}!
                                    {importResult.skipped > 0 && ` (${importResult.skipped} skipped)`}
                                </span>
                            </div>
                        )}

                        {/* Table */}
                        {!importResult && (
                            <div style={{ overflow: 'auto', flex: 1, padding: '0' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>#</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Price</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Category</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {importItems.map((item, idx) => (
                                            <tr key={idx} style={{ backgroundColor: item.valid ? '#fff' : '#fef2f2', borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '10px 16px', fontSize: '13px', color: '#9ca3af' }}>{idx + 1}</td>
                                                <td style={{ padding: '10px 16px', fontSize: '14px', color: '#374151', fontWeight: 500 }}>{item.name || '—'}</td>
                                                <td style={{ padding: '10px 16px', fontSize: '14px', color: '#374151' }}>{item.price > 0 ? `₹${item.price}` : '—'}</td>
                                                <td style={{ padding: '10px 16px', fontSize: '13px', color: '#6b7280' }}>{item.category}</td>
                                                <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                                    {item.valid ? (
                                                        <CheckCircle2 style={{ width: '18px', height: '18px', color: '#16a34a', display: 'inline' }} />
                                                    ) : (
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#dc2626' }}>
                                                            <AlertCircle style={{ width: '14px', height: '14px' }} />
                                                            {item.error}
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => removeImportItem(idx)}
                                                        style={{ width: '24px', height: '24px', border: 'none', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#ef4444', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {importItems.length === 0 && (
                                            <tr>
                                                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No items found in file</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', borderTop: '1px solid #e5e7eb' }}>
                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                                Expected columns: Name, Price, Category (optional)
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => { setShowImportModal(false); setImportItems([]); setImportResult(null); }}
                                    style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    {importResult ? 'Close' : 'Cancel'}
                                </button>
                                {!importResult && (
                                    <button
                                        onClick={handleBulkImport}
                                        disabled={importing || importItems.filter(i => i.valid).length === 0}
                                        style={{
                                            padding: '10px 24px', borderRadius: '10px', border: 'none',
                                            background: 'linear-gradient(to right, #FF8C42, #FFD166)',
                                            color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                            opacity: (importing || importItems.filter(i => i.valid).length === 0) ? 0.5 : 1,
                                        }}
                                    >
                                        {importing ? 'Importing...' : `Import ${importItems.filter(i => i.valid).length} Items`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
}



