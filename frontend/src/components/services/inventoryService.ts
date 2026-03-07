import axios from "axios";

const API_URL = "http://localhost:8080/api/inventory";

export interface Ingredient {
    id: number;
    name: string;
    quantity: number;
    unit: string;
}
/*add ingredients */
export const addIngredient = async (ingredient: {
    name: string;
    unit: string;
    quantity: number;
    minThreshold: number;
}) => {
    const res = await axios.post(API_URL, ingredient);
    return res.data;
};


/* Get all ingredients */
export const getAllIngredients = async (): Promise<Ingredient[]> => {
    const res = await axios.get(API_URL);
    return res.data;
};

/* Update stock */
export const updateIngredientStock = async (
    id: number,
    quantity: number
): Promise<Ingredient> => {
    const res = await axios.put(
        `${API_URL}/${id}/stock`,
        { quantity }   // body
    );
    return res.data;
};

/* Edit ingredient */
export const editIngredient = async (
    id: number,
    data: { name: string; unit: string; quantity: number; minThreshold: number }
): Promise<Ingredient> => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
};
