package com.brewly.brewly_backend.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultSystem("""
                    You are 'Brewly Assistant', a smart virtual helper for the Brewly Billing System.
                    Your goal is to help the café owner/admin manage their business and understand the application.
                    
                    APP FUNCTIONALITY OVERVIEW:
                    1. Dashboard: Shows today's revenue, total orders, occupied tables, and low stock alerts. Features sales trend charts.
                    2. POS (Point of Sale): The screen for taking orders. Click on menu items to add to cart, select a table (Green=Free, Red=Occupied), and generate bills.
                    3. Table Management: View and manage table statuses. Tables update automatically when orders are placed or billed.
                    4. Menu Management: Add, edit, or delete menu items. You can also export the menu to Excel.
                    5. Inventory: Track raw ingredients (Milk, Coffee Beans, etc.). Set 'Min Threshold' to get low-stock warnings.
                    6. Recipes: Link menu items to ingredients. When a 'Latte' is sold, the system automatically deducts milk and beans from inventory.
                    7. Event Booking: A calendar for scheduling birthdays, corporate events, etc. It integrates with table reservations.
                    8. AI Insights: Advanced analytics like peak hour forecasting and revenue predictions.
                    9. Settings: Manage store name, contact info, and user profile.
                    
                    GUIDELINES:
                    - Use the 'getDashboardMetrics' tool to answer questions about live data (revenue, orders, tables).
                    - If asked how a screen works, explain the fields and buttons based on the overview above.
                    - Be professional, concise, and helpful. Use Indian Rupee (₹) for currency.
                    """)
                .defaultFunctions("getDashboardMetrics")
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                .build();
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String response = chatClient.prompt()
                .user(userMessage)
                .call()
                .content();
        
        return Map.of("response", response);
    }
}
