import axios from "axios";

const API = "http://localhost:8080/api/vendors";

export interface Vendor {
    id: number;
    name: string;
    category: 'photographer' | 'dj' | 'cake' | 'decorator';
    rating: number;
    availability: 'available' | 'busy' | 'booked';
    phone: string;
    price: string;
}

export const getAllVendors = async (): Promise<Vendor[]> => {
    try {
        const response = await axios.get(API);
        return response.data;
    } catch (error) {
        console.error("Error fetching vendors", error);
        return [];
    }
};

export const createVendor = async (vendor: Omit<Vendor, 'id' | 'rating' | 'availability'>): Promise<Vendor | null> => {
    try {
        const response = await axios.post(API, vendor);
        return response.data;
    } catch (error) {
        console.error("Error creating vendor", error);
        return null;
    }
};

export const updateVendorStatus = async (id: number, status: string): Promise<Vendor | null> => {
    try {
        const response = await axios.patch(`${API}/${id}/status`, { availability: status });
        return response.data;
    } catch (error) {
        console.error("Error updating vendor status", error);
        return null;
    }
};
