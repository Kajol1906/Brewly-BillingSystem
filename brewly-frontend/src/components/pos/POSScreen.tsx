import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ShoppingBag } from 'lucide-react';
import { createPortal } from 'react-dom';
import TableCard from './TableCard';
import OrderSidebar from './OrderSidebar';
import { GlassButton } from '../ui/GlassButton';
import { createTable, deleteTable, renumberTables, getTablesWithReservations, Table as TableData } from '../../services/tableService';
import { useWebSocket } from '../../services/useWebSocket';


export interface Table extends Omit<TableData, 'status'> {
    status: 'free' | 'occupied' | 'reserved';
    billTotal?: number;
    currentOrders?: string[];
    reservedForEvent?: string | null;
    reservedForDate?: string | null;
}

export function POSScreen() {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newTableSeats, setNewTableSeats] = useState('4');
    const [isTakeawayMode, setIsTakeawayMode] = useState(false);

    // Real-time updates subscription
    useWebSocket('/topic/tables', () => {
        fetchTables();
    });

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const data = await getTablesWithReservations();
            const mapped = data.map((t: any) => ({
                ...t,
                tableNumber: t.tableNumber,
                status: t.status.toLowerCase(),
                billTotal: t.currentBill || 0,
                currentOrders: [],
                reservedForEvent: t.reservedForEvent || null,
                reservedForDate: t.reservedForDate || null,
            }));
            setTables(mapped);
        } catch (error) {
            console.error("Failed to load tables");
        } finally {
            setLoading(false);
        }
    };

    const handleTableClick = (table: Table) => {
        setSelectedTable(table);
    };

    const handleCloseSidebar = () => {
        setSelectedTable(null);
        setIsTakeawayMode(false);
        fetchTables();
    };

    const handleAddTable = async () => {
        if (!newTableSeats) return;

        const nextNumber = tables.length > 0
            ? Math.max(...tables.map(t => parseInt(t.tableNumber) || 0)) + 1
            : 1;

        const newTable = {
            tableNumber: String(nextNumber),
            seats: parseInt(newTableSeats),
            status: 'FREE' as const
        };

        const created = await createTable(newTable);
        if (created) {
            await fetchTables();
            setIsAddDialogOpen(false);
            setNewTableSeats('4');
        }
    };

    const handleDeleteTable = async (tableId: number) => {
        const success = await deleteTable(tableId);
        if (success) {
            await renumberTables();
            await fetchTables();
        } else {
            alert("Could not delete table. Ensure it is not occupied and has no active orders.");
        }
    };

    const stats = {
        free: tables.filter(t => t.status === 'free').length,
        occupied: tables.filter(t => t.status === 'occupied').length,
        reserved: tables.filter(t => t.status === 'reserved').length,
    };

    if (loading) return <div className="p-8">Loading POS...</div>;

    // @ts-ignore
    return (
        <div className="p-8">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 flex justify-between items-start"
            >
                <div>
                    <p className="text-muted-foreground">
                        Manage orders and table reservations
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <GlassButton
                        onClick={() => { setIsTakeawayMode(true); setSelectedTable(null); }}
                        className="text-foreground text-sm font-semibold tracking-wide"
                    >
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        Takeaway Order
                    </GlassButton>
                    <GlassButton
                        onClick={() => setIsAddDialogOpen(true)}
                        className="text-foreground text-sm font-semibold tracking-wide"
                    >
                        <Plus className="w-5 h-5 text-primary" />
                        Add Table
                    </GlassButton>
                </div>
            </motion.div>

            {/* Add Table Dialog */}
            {createPortal(
                <AnimatePresence>
                    {isAddDialogOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative z-10 w-full max-w-[420px] rounded-3xl border p-8 shadow-soft-lg text-center"
                                style={{ backgroundColor: '#FAF6F0', borderColor: 'rgba(92, 61, 46, 0.2)' }}
                            >
                                <h3 className="text-xl font-serif font-bold text-[#2C1810] mb-2">
                                    Add New Table
                                </h3>
                                <p className="text-xs text-[#8C7B6B] font-medium mb-6">
                                    Select the number of seats for the new table.
                                </p>
                                <div className="mb-6 text-left">
                                    <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wide mb-2.5">
                                        Number of Seats
                                    </label>
                                    <select
                                        value={newTableSeats}
                                        onChange={(e) => setNewTableSeats(e.target.value)}
                                        className="w-full h-11 px-4 text-sm rounded-xl border bg-white text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#5C3D2E]/30 transition-all font-medium cursor-pointer"
                                        style={{ borderColor: 'rgba(92, 61, 46, 0.15)' }}
                                    >
                                        <option value="2">2 seats</option>
                                        <option value="4">4 seats</option>
                                        <option value="6">6 seats</option>
                                        <option value="8">8 seats</option>
                                        <option value="10">10 seats</option>
                                    </select>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsAddDialogOpen(false)}
                                        className="flex-1 h-11 text-sm font-semibold rounded-xl border border-[#5C3D2E]/20 text-[#5C3D2E] hover:bg-[#5C3D2E]/5 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddTable}
                                        className="flex-1 h-11 text-sm font-bold rounded-xl text-white shadow-soft hover:shadow-hover transition-all cursor-pointer"
                                        style={{
                                            background: 'linear-gradient(135deg, #5C3D2E, #2C1810)'
                                        }}
                                    >
                                        Add Table
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Status Summary */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-8"
            >
                <div className="bg-card rounded-xl p-4 border border-border shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <div>
                            <p className="text-sm text-muted-foreground">Available</p>
                            <p className="mt-1">{stats.free} tables</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-danger" />
                        <div>
                            <p className="text-sm text-muted-foreground">Occupied</p>
                            <p className="mt-1">{stats.occupied} tables</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-warning" />
                        <div>
                            <p className="text-sm text-muted-foreground">Reserved</p>
                            <p className="mt-1">{stats.reserved} tables</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Table Grid / Empty State */}
            {tables.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-3xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.4)',
                        borderColor: 'rgba(92, 61, 46, 0.25)',
                    }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-[#FAF6F0] border border-[#5C3D2E]/10 flex items-center justify-center mb-4 shadow-soft">
                        <Plus className="w-8 h-8 text-[#5C3D2E] opacity-80" />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-[#2C1810]">No active tables found</h3>
                    <p className="mt-1 text-center max-w-sm text-sm text-[#8C7B6B] font-medium leading-relaxed">
                        Add custom dining tables using the "Add Table" button above to start managing dynamic dine-in orders!
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {tables.map((table, index) => (
                        <TableCard
                            key={table.id}
                            table={table}
                            onClick={() => handleTableClick(table)}
                            onDelete={handleDeleteTable}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {/* Order Sidebar */}
            <AnimatePresence>
                {(selectedTable || isTakeawayMode) && (
                    <OrderSidebar
                        table={selectedTable}
                        onClose={handleCloseSidebar}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}



