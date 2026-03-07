import axios from "axios";

// Update if backend URL changes
const API_URL = "http://localhost:8080/api/ai";

const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export interface PeakHourData {
    hour: string;
    traffic: number;
}

export interface Recommendation {
    id: number;
    item: string;
    confidence: number;
    trend: string;
}

export interface RevenueForecastData {
    history: { date: string; revenue: number; type: string }[];
    forecast: { date: string; revenue: number; type: string }[];
    weeklyRevenue: number;
    projectedWeekly: number;
    changePercent: number;
    avgDaily: number;
}

export interface CategorySale {
    category: string;
    revenue: number;
    percent: number;
}

export interface SlowMovingItem {
    item: string;
    totalSold: number;
    category: string;
    price: number;
    demandPercent: number;
}

export interface StockDepletionItem {
    name: string;
    currentStock: number;
    unit: string;
    dailyUsage: number;
    daysLeft: number | null;
    status: 'critical' | 'warning' | 'good' | 'no-data';
    minThreshold: number;
}

export interface PaymentInsightsData {
    methods: { method: string; count: number; revenue: number; percent: number }[];
    totalBills: number;
    totalRevenue: number;
}

export interface TableTurnoverItem {
    tableNumber: string;
    seats: number;
    totalOrders: number;
    avgSessionMinutes: number;
    totalRevenue: number;
    revenuePerOrder: number;
}

export const getPeakHours = async (): Promise<PeakHourData[]> => {
    const res = await axios.get(`${API_URL}/peak-hours`, authHeaders());
    return res.data;
};

export const getRecommendations = async (): Promise<Recommendation[]> => {
    const res = await axios.get(`${API_URL}/recommendations`, authHeaders());
    return res.data;
};

export const getRevenueForecast = async (): Promise<RevenueForecastData> => {
    const res = await axios.get(`${API_URL}/revenue-forecast`, authHeaders());
    return res.data;
};

export const getCategorySales = async (): Promise<CategorySale[]> => {
    const res = await axios.get(`${API_URL}/category-sales`, authHeaders());
    return res.data;
};

export const getSlowMovingItems = async (): Promise<SlowMovingItem[]> => {
    const res = await axios.get(`${API_URL}/slow-moving`, authHeaders());
    return res.data;
};

export const getStockDepletion = async (): Promise<StockDepletionItem[]> => {
    const res = await axios.get(`${API_URL}/stock-depletion`, authHeaders());
    return res.data;
};

export const getPaymentInsights = async (): Promise<PaymentInsightsData> => {
    const res = await axios.get(`${API_URL}/payment-insights`, authHeaders());
    return res.data;
};

export const getTableTurnover = async (): Promise<TableTurnoverItem[]> => {
    const res = await axios.get(`${API_URL}/table-turnover`, authHeaders());
    return res.data;
};
