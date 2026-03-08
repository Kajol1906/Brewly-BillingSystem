import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { API_BASE } from '../../config/api';

/* ================= TYPES ================= */

interface MenuItem {
    id: number;
    name: string;
}

interface Ingredient {
    id: number;
    name: string;
    unit: string;
}

interface RecipeIngredient {
    id: number;
    ingredient: Ingredient;
    quantity: number;
}

/* ================= API SETUP ================= */

const API = `${API_BASE}/api`;

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

/* ================= COMPONENT ================= */

export default function RecipeManager() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(null);

    const [recipeItem, setRecipeItem] = useState({
        ingredientId: "",
        quantity: "",
    });

    const [recipeList, setRecipeList] = useState<RecipeIngredient[]>([]);

    /* ================= LOAD INITIAL DATA ================= */

    useEffect(() => {
        fetchMenuItems();
        fetchIngredients();
    }, []);

    const fetchMenuItems = async () => {
        const res = await axios.get(`${API}/menu`, authHeader());
        setMenuItems(res.data);
    };

    const fetchIngredients = async () => {
        const res = await axios.get(`${API}/ingredients`, authHeader());
        setIngredients(res.data);
    };

    /* ================= LOAD RECIPE ================= */

    const fetchRecipe = async (menuItemId: number) => {
        const res = await axios.get(
            `${API}/recipes/menu/${menuItemId}`,
            authHeader()
        );
        setRecipeList(res.data);
    };

    /* ================= ADD INGREDIENT ================= */

    const handleAddRecipeItem = async () => {
        if (!selectedMenuItem || !recipeItem.ingredientId || !recipeItem.quantity) {
            alert("Please fill all fields");
            return;
        }

        await axios.post(
            `${API}/recipes`,
            {
                menuItemId: selectedMenuItem,
                ingredientId: recipeItem.ingredientId,
                quantity: recipeItem.quantity,
            },
            authHeader()
        );

        setRecipeItem({ ingredientId: "", quantity: "" });
        fetchRecipe(selectedMenuItem);
    };

    /* ================= UI ================= */

    return (
        <div className="space-y-6 max-w-3xl">

            <h1 className="text-2xl font-semibold">Recipe Management</h1>

            {/* MENU ITEM SELECT */}
            <select
                className="w-full border rounded-lg p-2"
                onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedMenuItem(id);
                    fetchRecipe(id);
                }}
                defaultValue=""
            >
                <option value="" disabled>
                    Select Menu Item
                </option>
                {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>

            {/* ADD INGREDIENT FORM */}
            {selectedMenuItem && (
                <div className="bg-card border rounded-xl p-4 space-y-4">

                    <h2 className="font-medium">Add Ingredient</h2>

                    <select
                        className="w-full border rounded-lg p-2"
                        value={recipeItem.ingredientId}
                        onChange={(e) =>
                            setRecipeItem({
                                ...recipeItem,
                                ingredientId: e.target.value,
                            })
                        }
                    >
                        <option value="">Select Ingredient</option>
                        {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>
                                {ing.name} ({ing.unit})
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Quantity for ONE item"
                        className="w-full border rounded-lg p-2"
                        value={recipeItem.quantity}
                        onChange={(e) =>
                            setRecipeItem({
                                ...recipeItem,
                                quantity: e.target.value,
                            })
                        }
                    />

                    <button
                        onClick={handleAddRecipeItem}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
                    >
                        <Plus size={16} />
                        Add Ingredient
                    </button>
                </div>
            )}

            {/* RECIPE TABLE */}
            {recipeList.length > 0 && (
                <div className="bg-card border rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="p-3 text-left">Ingredient</th>
                                <th className="p-3 text-left">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipeList.map((ri) => (
                                <tr key={ri.id} className="border-t">
                                    <td className="p-3">{ri.ingredient.name}</td>
                                    <td className="p-3">
                                        {ri.quantity} {ri.ingredient.unit}
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



