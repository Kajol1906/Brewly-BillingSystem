import axios from "axios";

const API_URL = "http://localhost:8080/api/menu";

// Define the shape of a MenuItem
export interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
    available: boolean;
}

// Fetch all available menu items (for POS)
export const getAvailableMenuItems = async (): Promise<MenuItem[]> => {
    try {
        const res = await axios.get(`${API_URL}/available`);
        return res.data;
    } catch (error) {
        console.error("Error fetching available menu items:", error);
        return [];
    }
};

// Fetch all menu items (for Admin/Management)
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (error) {
        console.error("Error fetching all menu items:", error);
        return [];
    }
};

// Create a new menu item
export const createMenuItem = async (item: Omit<MenuItem, "id">): Promise<MenuItem | null> => {
    try {
        const res = await axios.post(API_URL, item);
        return res.data;
    } catch (error) {
        console.error("Error creating menu item:", error);
        return null;
    }
};

// Toggle availability of a menu item
export const toggleMenuItemAvailability = async (id: number): Promise<MenuItem | null> => {
    try {
        const res = await axios.patch(`${API_URL}/${id}/toggle`);
        return res.data;
    } catch (error) {
        console.error("Error toggling menu item availability:", error);
        return null;
    }
};

// Fetch all distinct categories
export const getCategories = async (): Promise<string[]> => {
    try {
        const res = await axios.get(`${API_URL}/categories`);
        return res.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
