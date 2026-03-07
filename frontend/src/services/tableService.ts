import axios from "axios";

const API = "http://localhost:8080/api/tables";

export interface Table {
    id: number;
    tableNumber: string;
    seats: number;
    status: 'FREE' | 'OCCUPIED' | 'RESERVED';
}

export interface TableWithReservation extends Table {
    currentBill: number | null;
    reservedForEvent: string | null;
    reservedForDate: string | null;
}

export const getAllTables = async (): Promise<Table[]> => {
    try {
        const response = await axios.get(API);
        return response.data;
    } catch (error) {
        console.error("Error fetching tables", error);
        return [];
    }
};

export const updateTableStatus = async (id: number, status: 'FREE' | 'OCCUPIED' | 'RESERVED'): Promise<Table | null> => {
    try {
        const response = await axios.patch(`${API}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating table status", error);
        return null;
    }
};

export const createTable = async (table: Omit<Table, 'id'>): Promise<Table | null> => {
    try {
        const response = await axios.post(API, table);
        return response.data;
    } catch (error) {
        console.error("Error creating table", error);
        return null;
    }
};

export const deleteTable = async (id: number): Promise<boolean> => {
    try {
        await axios.delete(`${API}/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting table", error);
        return false;
    }
};

export const renumberTables = async (): Promise<boolean> => {
    try {
        await axios.post(`${API}/renumber`);
        return true;
    } catch (error) {
        console.error("Error renumbering tables", error);
        return false;
    }
};

export const getFreeTables = async (): Promise<Table[]> => {
    try {
        const response = await axios.get(`${API}/free`);
        return response.data;
    } catch (error) {
        console.error("Error fetching free tables", error);
        return [];
    }
};

export const getTablesWithReservations = async (): Promise<TableWithReservation[]> => {
    try {
        const response = await axios.get(`${API}/with-reservations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tables with reservations", error);
        return [];
    }
};

export const getTablesForDate = async (date: string, time?: string): Promise<TableWithReservation[]> => {
    try {
        const params = time ? { time } : {};
        const response = await axios.get(`${API}/for-date/${date}`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching tables for date", error);
        return [];
    }
};
