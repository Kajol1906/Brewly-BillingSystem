import axios from "axios";
import { API_BASE } from '../../config/api';

/**
 * 🔹 Base API URL
 * Change only if backend URL changes
 */
const API_URL = `${API_BASE}/api/menu`;

/**
 * 🔹 Helper to get JWT token
 */
const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};


/**
 * 🔹 Add new menu item
 */
export const addMenuItem = async (item: {
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
}) => {
    const response = await axios.post(
        API_URL,
        item,
        getAuthHeader()
    );
    return response.data;
};


/**
 * ===============================
 * MENU API CALLS
 * ===============================
 */

/**
 * 🔹 Get all menu items
 */
export const getAllMenuItems = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

/**
 * 🔹 Get menu items by category
 */
export const getMenuByCategory = async (category: string) => {
    const response = await axios.get(
        `${API_URL}/category/${category}`,
        getAuthHeader()
    );
    return response.data;
};

/**
 * 🔹 Search menu items
 */
export const searchMenuItems = async (q: string) => {
    const response = await axios.get(
        `${API_URL}/search`,
        {
            params: { q }, // ✅ must be `q`
            ...getAuthHeader(),
        }
    );
    return response.data;
};


/**
 * 🔹 Get all distinct categories
 */
export const getCategories = async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/categories`, getAuthHeader());
    return response.data;
};

/**
 * 🔹 Get category item counts
 */
export const getCategoryCounts = async (): Promise<Record<string, number>> => {
    const response = await axios.get(`${API_URL}/categories/counts`, getAuthHeader());
    return response.data;
};

/**
 * 🔹 Delete a category and all its items
 */
export const deleteCategory = async (category: string): Promise<void> => {
    await axios.delete(`${API_URL}/category/${encodeURIComponent(category)}`, getAuthHeader());
};

/**
 * 🔹 Reassign items from one category to another
 */
export const reassignCategory = async (oldCategory: string, newCategory: string): Promise<void> => {
    await axios.put(
        `${API_URL}/category/${encodeURIComponent(oldCategory)}/reassign/${encodeURIComponent(newCategory)}`,
        {},
        getAuthHeader()
    );
};

/**
 * 🔹 Update a menu item
 */
export const updateMenuItem = async (id: number, item: { name: string; price: number; category: string; imageUrl?: string }) => {
    const response = await axios.put(`${API_URL}/${id}`, item, getAuthHeader());
    return response.data;
};

/**
 * 🔹 Toggle availability (enable / disable item)
 */
export const toggleMenuAvailability = async (id: number) => {
    const response = await axios.patch(
        `${API_URL}/${id}/toggle`,
        {},
        getAuthHeader()
    );
    return response.data;
};

/**
 * 🔹 Bulk import menu items
 */
export const bulkImportMenuItems = async (items: { name: string; price: number; category: string }[]) => {
    const response = await axios.post(`${API_URL}/bulk`, items, getAuthHeader());
    return response.data;
};
