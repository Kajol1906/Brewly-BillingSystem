import axios from "axios";

const API_URL = "http://localhost:8080/api/dashboard";

export type Period = 'today' | 'yesterday' | 'week' | 'month';

export interface DailySales {
    day: string;
    sales: number;
}

export interface TopSellingItem {
    item: string;
    sales: number;
}

export interface DashboardMetrics {
    todayRevenue: number;
    totalOrders: number;
    occupiedTables: number;
    totalTables: number;
    lowStockItems: number;
    upcomingEvents: number;
    previousRevenue: number;
    previousOrders: number;
    revenueChangePercent: number;
    ordersChangePercent: number;
}

export interface OrderItemSummary {
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface OrderSummary {
    orderId: number;
    tableId: number;
    time: string;
    total: number;
    items: OrderItemSummary[];
}

export const getDashboardMetrics = async (period: Period = 'today'): Promise<DashboardMetrics | null> => {
    try {
        const res = await axios.get(`${API_URL}/metrics`, { params: { period } });
        return res.data;
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return null;
    }
};

export const getDailySales = async (period: Period = 'week'): Promise<DailySales[]> => {
    try {
        const res = await axios.get(`${API_URL}/daily-sales`, { params: { period } });
        return res.data;
    } catch (error) {
        console.error("Error fetching daily sales:", error);
        return [];
    }
};

export const getTopSellingItems = async (period: Period = 'week'): Promise<TopSellingItem[]> => {
    try {
        const res = await axios.get(`${API_URL}/top-selling`, { params: { period } });
        return res.data;
    } catch (error) {
        console.error("Error fetching top selling items:", error);
        return [];
    }
};

export interface UpcomingEvent {
    id: number;
    title: string;
    date: string;
    time: string;
    type: string;
    guestCount: number;
    packageType: string;
}

export const getOrderSummaries = async (period: Period = 'today'): Promise<OrderSummary[]> => {
    try {
        const res = await axios.get(`${API_URL}/orders`, { params: { period } });
        return res.data;
    } catch (error) {
        console.error("Error fetching order summaries:", error);
        return [];
    }
};

export const getUpcomingEvents = async (): Promise<UpcomingEvent[]> => {
    try {
        const res = await axios.get(`${API_URL}/upcoming-events`);
        return res.data;
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        return [];
    }
};
