import axios from "axios";
import { API_BASE } from '../../config/api';

const API_URL = `${API_BASE}/api/recipes`;

export interface RecipeIngredient {
    id: number;
    ingredient: {
        id: number;
        name: string;
        unit: string;
        quantity: number;
    };
    quantity: number;
}

/* Get recipe ingredients for a menu item */
export const getRecipeByMenuItemId = async (menuItemId: number): Promise<RecipeIngredient[]> => {
    const res = await axios.get(`${API_URL}/menu/${menuItemId}`);
    return res.data;
};

/* Add or update a recipe ingredient (upsert) */
export const addRecipeIngredient = async (data: {
    menuItemId: number;
    ingredientId: number;
    quantity: number;
}): Promise<RecipeIngredient> => {
    const res = await axios.post(API_URL, data);
    return res.data;
};

/* Delete a recipe ingredient */
export const deleteRecipeIngredient = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
