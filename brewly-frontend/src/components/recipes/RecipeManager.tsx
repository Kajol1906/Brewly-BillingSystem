import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    ChefHat,
    Plus,
    Trash2,
    Package,
    Search,
    AlertCircle,
    CheckCircle,
    CookingPot,
    Loader2,
    BookOpen,
    ArrowRight,
} from "lucide-react";

import {
    getRecipeByMenuItemId,
    addRecipeIngredient,
    deleteRecipeIngredient,
    RecipeIngredient,
} from "../services/recipeService";
import { getAllIngredients } from "../services/inventoryService";

import axios from "axios";
import { API_BASE } from "../../config/api";

/* ================= TYPES ================= */

interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: number;
    available: boolean;
}

interface IngredientItem {
    id: number;
    name: string;
    unit: string;
    quantity: number;
}

/* ================= COMPONENT ================= */

export default function RecipeManager() {
    /* ---- Data ---- */
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
    const [recipeList, setRecipeList] = useState<RecipeIngredient[]>([]);

    /* ---- Selection ---- */
    const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    /* ---- Add form ---- */
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ ingredientId: "", quantity: "" });

    /* ---- Loading/Error ---- */
    const [loading, setLoading] = useState(true);
    const [loadingRecipe, setLoadingRecipe] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    /* ================= INITIAL FETCH ================= */

    useEffect(() => {
        Promise.all([fetchMenuItems(), fetchIngredients()]).then(() => setLoading(false));
    }, []);

    const fetchMenuItems = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/menu`);
            setMenuItems(res.data);
        } catch {
            setError("Could not load menu items.");
        }
    };

    const fetchIngredients = async () => {
        try {
            const data = await getAllIngredients();
            setIngredients(data as IngredientItem[]);
        } catch {
            setError("Could not load ingredients.");
        }
    };

    /* ================= RECIPE FETCH ================= */

    const handleSelectMenuItem = async (id: number) => {
        setSelectedMenuItemId(id);
        setLoadingRecipe(true);
        setError(null);
        try {
            const data = await getRecipeByMenuItemId(id);
            setRecipeList(Array.isArray(data) ? data : []);
        } catch {
            setError("Failed to load recipe for this item.");
            setRecipeList([]);
        } finally {
            setLoadingRecipe(false);
        }
    };

    /* ================= ADD INGREDIENT ================= */

    const handleAdd = async () => {
        if (!selectedMenuItemId || !addForm.ingredientId || !addForm.quantity) return;
        setSaving(true);
        try {
            await addRecipeIngredient({
                menuItemId: selectedMenuItemId,
                ingredientId: Number(addForm.ingredientId),
                quantity: Number(addForm.quantity),
            });
            setAddForm({ ingredientId: "", quantity: "" });
            setShowAddModal(false);
            await handleSelectMenuItem(selectedMenuItemId);
            showToast("Ingredient added to recipe!", "success");
        } catch (e: any) {
            showToast(e?.response?.data || "Failed to add ingredient.", "error");
        } finally {
            setSaving(false);
        }
    };

    /* ================= DELETE INGREDIENT ================= */

    const handleDelete = async (riId: number) => {
        if (!confirm("Remove this ingredient from the recipe?")) return;
        try {
            await deleteRecipeIngredient(riId);
            if (selectedMenuItemId) await handleSelectMenuItem(selectedMenuItemId);
            showToast("Ingredient removed.", "success");
        } catch {
            showToast("Failed to remove ingredient.", "error");
        }
    };

    /* ================= TOAST ================= */

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    /* ================= DERIVED ================= */

    const selectedItem = menuItems.find((m) => m.id === selectedMenuItemId);
    const filteredMenu = menuItems.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by category
    const categories = [...new Set(filteredMenu.map((m) => m.category))];


    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* ====== HEADER ====== */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold">Recipe Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Link ingredients to menu items for automatic stock deduction
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-card rounded-xl border shadow-soft-sm">
                        <p className="text-xs text-muted-foreground">Menu Items</p>
                        <p className="text-lg font-semibold text-primary">{menuItems.length}</p>
                    </div>
                    <div className="px-4 py-2 bg-card rounded-xl border shadow-soft-sm">
                        <p className="text-xs text-muted-foreground">Ingredients</p>
                        <p className="text-lg font-semibold text-accent">{ingredients.length}</p>
                    </div>
                </div>
            </div>

            {/* ====== ERROR BANNER ====== */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-xs underline">
                        Dismiss
                    </button>
                </motion.div>
            )}

            {/* ====== MAIN LAYOUT — side by side ====== */}
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
                {/* ---- LEFT: Menu Item Picker ---- */}
                <div className="bg-card rounded-2xl border shadow-soft overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 220px)" }}>
                    <div className="p-4 border-b space-y-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Menu Items
                        </h2>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search menu items…"
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-2">
                        {categories.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No menu items found.
                            </p>
                        )}
                        {categories.map((cat) => (
                            <div key={cat} className="mb-3">
                                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {cat}
                                </p>
                                {filteredMenu
                                    .filter((m) => m.category === cat)
                                    .map((item) => (
                                        <motion.button
                                            key={item.id}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSelectMenuItem(item.id)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 group ${
                                                selectedMenuItemId === item.id
                                                    ? "bg-primary/15 border border-primary/30 text-foreground"
                                                    : "hover:bg-muted/50 text-foreground/80"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <CookingPot
                                                    className={`w-4 h-4 shrink-0 ${
                                                        selectedMenuItemId === item.id
                                                            ? "text-primary"
                                                            : "text-muted-foreground"
                                                    }`}
                                                />
                                                <span className="truncate text-sm font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <ArrowRight
                                                className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                                    selectedMenuItemId === item.id
                                                        ? "text-primary translate-x-0"
                                                        : "text-muted-foreground -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                                                }`}
                                            />
                                        </motion.button>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ---- RIGHT: Recipe Details ---- */}
                <div className="space-y-5">
                    {/* No selection state */}
                    {!selectedMenuItemId && (
                        <div className="bg-card rounded-2xl border shadow-soft flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                                <ChefHat className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground/70">
                                Select a menu item
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                                Choose an item from the left panel to view or edit its recipe — the
                                ingredients needed to make one serving.
                            </p>
                        </div>
                    )}

                    {/* Loading recipe */}
                    {selectedMenuItemId && loadingRecipe && (
                        <div className="bg-card rounded-2xl border shadow-soft flex items-center justify-center py-20">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            <span className="ml-3 text-muted-foreground text-sm">
                                Loading recipe…
                            </span>
                        </div>
                    )}

                    {/* Recipe content */}
                    {selectedMenuItemId && !loadingRecipe && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedMenuItemId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                            >
                                {/* Selected item header */}
                                <div className="bg-card rounded-2xl border shadow-soft p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {selectedItem?.name}
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {selectedItem?.category} • ₹{selectedItem?.price}{" "}
                                                •{" "}
                                                <span
                                                    className={
                                                        selectedItem?.available
                                                            ? "text-green-500"
                                                            : "text-destructive"
                                                    }
                                                >
                                                    {selectedItem?.available
                                                        ? "Available"
                                                        : "Unavailable"}
                                                </span>
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setAddForm({ ingredientId: "", quantity: "" });
                                                setShowAddModal(true);
                                            }}
                                            className="h-10 px-5 bg-gradient-to-r from-primary to-accent text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-soft-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Ingredient
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Recipe table */}
                                {recipeList.length > 0 ? (
                                    <div className="bg-card rounded-2xl border shadow-soft overflow-hidden">
                                        <div className="px-5 py-3 border-b flex items-center gap-2">
                                            <Package className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                Ingredients per serving
                                            </span>
                                            <span className="ml-auto text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
                                                {recipeList.length} ingredient
                                                {recipeList.length !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                        <table className="w-full">
                                            <thead className="bg-muted/30">
                                                <tr>
                                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        Ingredient
                                                    </th>
                                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        Qty / Serving
                                                    </th>
                                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        Current Stock
                                                    </th>
                                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        Status
                                                    </th>
                                                    <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recipeList.map((ri) => {
                                                    const stock = ri.ingredient.quantity ?? 0;
                                                    const needed = ri.quantity;
                                                    const isLow = stock < needed;
                                                    return (
                                                        <motion.tr
                                                            key={ri.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="border-t hover:bg-muted/20 transition-colors"
                                                        >
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="w-4 h-4 text-muted-foreground" />
                                                                    <span className="font-medium">
                                                                        {ri.ingredient.name}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-muted-foreground">
                                                                {ri.quantity} {ri.ingredient.unit}
                                                            </td>
                                                            <td className="p-4 text-muted-foreground">
                                                                {stock} {ri.ingredient.unit}
                                                            </td>
                                                            <td className="p-4">
                                                                {isLow ? (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                                                                        <AlertCircle className="w-3 h-3" />
                                                                        Low Stock
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                                                                        <CheckCircle className="w-3 h-3" />
                                                                        Sufficient
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(ri.id)
                                                                    }
                                                                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                                    title="Remove from recipe"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    /* Empty recipe state */
                                    <div className="bg-card rounded-2xl border shadow-soft flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                                            <CookingPot className="w-7 h-7 text-muted-foreground/40" />
                                        </div>
                                        <h3 className="text-base font-medium text-foreground/70">
                                            No recipe defined
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                            This item has no ingredients linked yet. Click "Add
                                            Ingredient" to start defining the recipe.
                                        </p>
                                        <p className="text-xs text-muted-foreground/50 mt-3">
                                            Without a recipe, stock won't be deducted when this
                                            item is ordered.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* ====== ADD INGREDIENT MODAL ====== */}
            {showAddModal &&
                createPortal(
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card rounded-2xl border shadow-soft-lg w-[440px] p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-semibold mb-1">Add Ingredient to Recipe</h2>
                            <p className="text-sm text-muted-foreground mb-5">
                                For <span className="text-primary font-medium">{selectedItem?.name}</span>
                                {" "}— specify ingredient and quantity per serving.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                        Ingredient
                                    </label>
                                    <select
                                        className="w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        value={addForm.ingredientId}
                                        onChange={(e) =>
                                            setAddForm({ ...addForm, ingredientId: e.target.value })
                                        }
                                    >
                                        <option value="">Select Ingredient</option>
                                        {ingredients.map((ing) => (
                                            <option key={ing.id} value={ing.id}>
                                                {ing.name} ({ing.unit}) — Stock: {ing.quantity}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                        Quantity per serving
                                    </label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="e.g. 200"
                                        className="w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        value={addForm.quantity}
                                        onChange={(e) =>
                                            setAddForm({ ...addForm, quantity: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAdd}
                                    disabled={saving || !addForm.ingredientId || !addForm.quantity}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {saving ? "Saving…" : "Add to Recipe"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>,
                    document.body
                )}

            {/* ====== TOAST ====== */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-soft-lg flex items-center gap-2 text-sm font-medium ${
                            toast.type === "success"
                                ? "bg-green-500 text-white"
                                : "bg-destructive text-white"
                        }`}
                    >
                        {toast.type === "success" ? (
                            <CheckCircle className="w-4 h-4" />
                        ) : (
                            <AlertCircle className="w-4 h-4" />
                        )}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
