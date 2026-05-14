import axios from 'axios';
import { API_BASE } from '../config/api';

const API = `${API_BASE}/api/ai/chat`;

export const sendMessageToAI = async (message: string): Promise<string> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API, 
            { message },
            { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            }
        );
        return response.data.response;
    } catch (error) {
        console.error("Error communicating with AI Assistant", error);
        return "I'm sorry, I'm having trouble connecting to the brain. Please try again later.";
    }
};
