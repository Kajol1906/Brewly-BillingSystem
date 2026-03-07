import axios from "axios";

// Update if backend URL changes
const API_URL = "http://localhost:8080/api/events";

export interface Event {
    id?: number;
    title: string;
    date: string | Date; // ISO string or Date object
    type: string;
    guestCount: number;
    time: string;
    packageType: string;
    vendorIds?: number[];
    tableIds?: number[];
}

/** Format a Date to "YYYY-MM-DD" in local timezone to avoid UTC date shift */
const toLocalDateStr = (d: string | Date): string => {
    if (typeof d === 'string') return d;
    return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
};

export const getAllEvents = async (): Promise<Event[]> => {
    const res = await axios.get(API_URL);
    return res.data.map((e: any) => ({
        ...e,
        date: new Date(e.date + 'T00:00:00'),
        package: e.packageType || e.package || ''
    }));
};

export const createEvent = async (event: Event): Promise<Event> => {
    const res = await axios.post(API_URL, { ...event, date: toLocalDateStr(event.date) });
    return {
        ...res.data,
        date: new Date(res.data.date + 'T00:00:00')
    };
};

export const updateEvent = async (id: number, event: Event): Promise<Event> => {
    const res = await axios.put(`${API_URL}/${id}`, { ...event, date: toLocalDateStr(event.date) });
    return {
        ...res.data,
        date: new Date(res.data.date + 'T00:00:00')
    };
};

export const deleteEvent = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
