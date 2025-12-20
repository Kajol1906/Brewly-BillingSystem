import axios from "axios";

/**
 * 🔹 Base API URL
 * Change only if backend URL changes
 */
const API_URL = "http://localhost:8080/api/menu";

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
export const searchMenuItems = async (keyword: string) => {
    const response = await axios.get(
        `${API_URL}/search`,
        {
            params: { keyword },
            ...getAuthHeader(),
        }
    );
    return response.data;
};

/**
 * 🔹 Toggle availability (enable / disable item)
 */
export const toggleMenuAvailability = async (id: number) => {
    const response = await axios.post(
        `${API_URL}/${id}/toggle`,
        {},
        getAuthHeader()
    );
    return response.data;
};
