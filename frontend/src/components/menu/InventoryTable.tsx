import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Plus, Package, AlertTriangle, CheckCircle, Pencil } from 'lucide-react';

// 🔹 Backend service imports
import {
    getAllIngredients,
    updateIngredientStock,
    addIngredient,
    editIngredient,
} from '../services/inventoryService';

interface InventoryItem {
    id: number;
    name: string;
    unit: string;
    stockQty: number;
    minStock: number;
    status: 'low' | 'normal' | 'good';
}

export default function InventoryTable() {
    /* ===================== STATE ===================== */
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Add Ingredient modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        unit: '',
        quantity: 0,
        minThreshold: 0,
    });

    // 🔹 Add Stock dialog state
    const [showStockDialog, setShowStockDialog] = useState(false);
    const [stockItemId, setStockItemId] = useState<number | null>(null);
    const [stockQtyInput, setStockQtyInput] = useState('');

    // 🔹 Edit Ingredient dialog state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem] = useState<{ id: number; name: string; unit: string; quantity: number; minThreshold: number } | null>(null);

    /* ===================== FETCH INVENTORY ===================== */
    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);

        const data = await getAllIngredients();

        const mapped: InventoryItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            unit: item.unit,
            stockQty: item.quantity,
            minStock: item.minThreshold ?? 0,
            status:
                item.quantity < (item.minThreshold ?? 0)
                    ? 'low'
                    : item.quantity === (item.minThreshold ?? 0)
                        ? 'normal'
                        : 'good',
        }));

        setInventory(mapped);
        setLoading(false);
    };

    /* ===================== ADD STOCK ===================== */
    const openStockDialog = (id: number) => {
        setStockItemId(id);
        setStockQtyInput('');
        setShowStockDialog(true);
    };

    const handleAddStock = async () => {
        if (!stockQtyInput || Number(stockQtyInput) <= 0 || stockItemId === null) return;
        const addedQty = Number(stockQtyInput);
        await updateIngredientStock(stockItemId, addedQty);
        setShowStockDialog(false);
        setInventory(prev => prev.map(item => {
            if (item.id === stockItemId) {
                const newQty = item.stockQty + addedQty;
                return {
                    ...item,
                    stockQty: newQty,
                    status: newQty < item.minStock ? 'low' : newQty === item.minStock ? 'normal' : 'good',
                };
            }
            return item;
        }));
        setStockItemId(null);
        setStockQtyInput('');
    };

    /* ===================== ADD INGREDIENT ===================== */
    const handleAddIngredient = async () => {
        if (!newIngredient.name || !newIngredient.unit) {
            alert('Name and unit are required');
            return;
        }
        if (newIngredient.quantity < 0 || newIngredient.minThreshold < 0) {
            alert('Quantity and Min Threshold cannot be negative');
            return;
        }

        await addIngredient(newIngredient);

        setShowAddModal(false);
        setNewIngredient({
            name: '',
            unit: '',
            quantity: 0,
            minThreshold: 0,
        });

        fetchInventory();
    };

    /* ===================== EDIT INGREDIENT ===================== */
    const openEditDialog = (item: InventoryItem) => {
        setEditItem({ id: item.id, name: item.name, unit: item.unit, quantity: item.stockQty, minThreshold: item.minStock });
        setShowEditModal(true);
    };

    const handleEditIngredient = async () => {
        if (!editItem) return;
        await editIngredient(editItem.id, { name: editItem.name, unit: editItem.unit, quantity: editItem.quantity, minThreshold: editItem.minThreshold });
        setShowEditModal(false);
        setInventory(prev => prev.map(item => {
            if (item.id === editItem.id) {
                const newQty = editItem.quantity;
                return {
                    ...item,
                    name: editItem.name,
                    unit: editItem.unit,
                    stockQty: newQty,
                    minStock: editItem.minThreshold,
                    status: newQty < editItem.minThreshold ? 'low' : newQty === editItem.minThreshold ? 'normal' : 'good',
                };
            }
            return item;
        }));
        setEditItem(null);
    };

    /* ===================== STATUS BADGE ===================== */
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'low':
                return (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B]">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs">Low Stock</span>
                    </div>
                );
            case 'good':
                return (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4CAF50]/10 text-[#4CAF50]">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Good</span>
                    </div>
                );
            default:
                return (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground">
                        <Package className="w-3 h-3" />
                        <span className="text-xs">Normal</span>
                    </div>
                );
        }
    };

    const lowStockCount = inventory.filter(i => i.status === 'low').length;

    /* ===================== UI ===================== */
    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-card rounded-xl border shadow-soft-sm">
                        <p className="text-sm text-muted-foreground">Low Stock Items</p>
                        <p className="text-[#FF6B6B]">{lowStockCount}</p>
                    </div>

                    <div className="px-4 py-2 bg-card rounded-xl border shadow-soft-sm">
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        <p className="text-[#6C63FF]">{inventory.length}</p>
                    </div>
                </div>

                <motion.button
                    onClick={() => setShowAddModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 px-6 bg-gradient-to-r from-[#6C63FF] to-[#93E5AB] text-white rounded-xl flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Ingredient
                </motion.button>
            </div>

            {loading && <p className="text-muted-foreground">Loading inventory…</p>}

            {/* Table */}
            <div className="bg-card rounded-2xl border shadow-soft overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Unit</th>
                            <th className="p-4 text-left">Stock</th>
                            <th className="p-4 text-left">Min</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id} className="border-t">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4">{item.unit}</td>
                                <td className="p-4">{item.stockQty}</td>
                                <td className="p-4">{item.minStock}</td>
                                <td className="p-4">{getStatusBadge(item.status)}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openStockDialog(item.id)}
                                            className="px-3 py-1 bg-[#6C63FF]/10 text-[#6C63FF] rounded"
                                        >
                                            Add Stock
                                        </button>
                                        <button
                                            onClick={() => openEditDialog(item)}
                                            className="px-3 py-1 bg-amber-100 text-amber-700 rounded flex items-center gap-1"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ===================== ADD STOCK DIALOG ===================== */}
            {showStockDialog && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '400px', padding: '36px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#1a1a1a' }}>Add Stock</h2>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Quantity to add</label>
                            <input
                                type="number"
                                placeholder="e.g. 50"
                                value={stockQtyInput}
                                onChange={(e) => setStockQtyInput(e.target.value)}
                                style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                            <button
                                onClick={() => { setShowStockDialog(false); setStockItemId(null); setStockQtyInput(''); }}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStock}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#6C63FF', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ===================== ADD MODAL ===================== */}
            {showAddModal && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '460px', padding: '36px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>Add Ingredient</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Name</label>
                                <input
                                    placeholder="e.g. Coffee Beans"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={newIngredient.name}
                                    onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Unit (ml / gm / pcs)</label>
                                <input
                                    placeholder="e.g. gm"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={newIngredient.unit}
                                    onChange={e => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Quantity</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    onChange={e => setNewIngredient({ ...newIngredient, quantity: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Min Threshold</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 100"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    onChange={e => setNewIngredient({ ...newIngredient, minThreshold: Number(e.target.value) })}
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
                                onClick={handleAddIngredient}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#6C63FF', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ===================== EDIT INGREDIENT DIALOG ===================== */}
            {showEditModal && editItem && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '460px', padding: '36px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>Edit Ingredient</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Name</label>
                                <input
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={editItem.name}
                                    onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Unit</label>
                                <input
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={editItem.unit}
                                    onChange={e => setEditItem({ ...editItem, unit: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Quantity</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={editItem.quantity}
                                    onChange={e => setEditItem({ ...editItem, quantity: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#666', marginBottom: '6px' }}>Min Threshold</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                    value={editItem.minThreshold}
                                    onChange={e => setEditItem({ ...editItem, minThreshold: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                            <button
                                onClick={() => { setShowEditModal(false); setEditItem(null); }}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditIngredient}
                                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#6C63FF', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}



