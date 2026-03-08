import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { createPortal } from 'react-dom';
import TableCard from './TableCard';
import OrderSidebar from './OrderSidebar';
import { GlassButton } from '../ui/GlassButton';
import { createTable, deleteTable, renumberTables, getTablesWithReservations, Table as TableData } from '../../services/tableService';


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
                    <h1>Point of Sale</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage orders and table reservations
                    </p>
                </div>
                <GlassButton
                    onClick={() => setIsAddDialogOpen(true)}
                    className="text-foreground text-sm font-semibold tracking-wide"
                >
                    <Plus className="w-5 h-5 text-primary" />
                    Add Table
                </GlassButton>
            </motion.div>

            {/* Add Table Dialog */}
            {createPortal(
                <AnimatePresence>
                    {isAddDialogOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60"
                                onClick={() => setIsAddDialogOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xl text-center"
                                style={{ width: '500px', padding: '48px 64px' }}
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Add New Table
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Select the number of seats for the new table.
                                </p>
                                <div className="mb-6 text-left">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Number of Seats
                                    </label>
                                    <select
                                        value={newTableSeats}
                                        onChange={(e) => setNewTableSeats(e.target.value)}
                                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="2">2 seats</option>
                                        <option value="4">4 seats</option>
                                        <option value="6">6 seats</option>
                                        <option value="8">8 seats</option>
                                        <option value="10">10 seats</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        onClick={() => setIsAddDialogOpen(false)}
                                        className="flex-1 px-4 py-3 text-sm font-medium rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddTable}
                                        className="flex-1 px-4 py-3 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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

            {/* Table Grid */}
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

            {/* Order Sidebar */}
            <AnimatePresence>
                {selectedTable && (
                    <OrderSidebar
                        table={selectedTable}
                        onClose={handleCloseSidebar}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}



