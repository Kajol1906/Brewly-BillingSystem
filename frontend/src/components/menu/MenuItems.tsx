import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Grid, List } from 'lucide-react';

import{
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

    const categories = ['All', 'Coffee', 'Snacks', 'Desserts'];

    /* ================= LOAD MENU ================= */
    useEffect(() => {
        fetchMenu();
    }, []);

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
        fetchMenu(); // refresh list
    };

    /* ================= UI ================= */
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
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 shadow-soft-sm"
                    />
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`w-12 h-12 rounded-xl border ${
                            viewMode === 'grid' ? 'bg-[#6C63FF] text-white' : 'bg-white'
                        }`}
                    >
                        <Grid />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`w-12 h-12 rounded-xl border ${
                            viewMode === 'list' ? 'bg-[#6C63FF] text-white' : 'bg-white'
                        }`}
                    >
                        <List />
                    </button>
                </div>

                {/* Add Item (next phase) */}
                <button className="h-12 px-6 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl flex items-center gap-2">
                    <Plus /> Add Item
                </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-2 rounded-lg ${
                            selectedCategory === cat
                                ? 'bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white'
                                : 'bg-white border'
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
                        <div key={item.id} className="bg-white rounded-xl border shadow-soft">
                            <div className="p-4">
                                <h4>{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                <p className="text-[#6C63FF] mt-1">₹{item.price}</p>

                                <div className="flex justify-between items-center mt-4">
                                    <span>Available</span>
                                    <button
                                        onClick={() => toggleAvailability(item.id)}
                                        className={`w-12 h-6 rounded-full ${
                                            item.available ? 'bg-green-500' : 'bg-muted'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* LIST VIEW */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-xl border shadow-soft">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-muted/30">
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Available</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-t">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4">{item.category}</td>
                                <td className="p-4">₹{item.price}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleAvailability(item.id)}
                                        className={`w-12 h-6 rounded-full ${
                                            item.available ? 'bg-green-500' : 'bg-muted'
                                        }`}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
