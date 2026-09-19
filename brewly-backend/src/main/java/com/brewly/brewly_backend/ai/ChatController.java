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
                .defaultSystem(
                        """
                                You are 'Brewly Assistant', a premium virtual intelligence helper for the Brewly POS & Billing System.
                                Your goal is to help café owners/admins manage their business, explain system flow, analyze dashboard metrics, and detail all screen workflows.

                                THEME & BRANDING:
                                - The Brewly brand identity uses a warm, cozy 'Chocolate Brown' (#5C3D2E / #2C1810) and 'Velvety Cream' (#FAF6F0) color theme, reminiscent of premium espresso, chocolate, and milk.

                                SYSTEM FLOW & ARCHITECTURE:
                                1. Authentication Lifecycle:
                                   - Users authenticate via JWT (Stateless) or Google OAuth 2.0.
                                   - Multi-tenant isolation ensures each café owner only sees their own tables, menu, inventory, and analytics.
                                2. POS & Order Lifecycle:
                                   - Tables are displayed in a real-time grid: Green = Available, Red = Occupied (Active Order), Orange = Reserved.
                                   - When an order is placed on a table:
                                     a. Table status automatically transitions to OCCUPIED.
                                     b. The system queries the linked RECIPE. If ingredients are linked, the system validates stock, deducts ingredient amounts, and recalculates menu availability.
                                     c. The order is stored as ACTIVE, and the table's running bill increases in real-time.
                                   - WebSockets instantly synchronize the order queue between the Cashier POS counter and the Kitchen Display System (KDS).
                                3. Billing Lifecycle:
                                   - The checkout process accepts Cash or UPI (generating a dynamic dynamic QR code showing the exact amount).
                                   - On payment validation, the table is cleared (freed, current bill reset to ₹0.00), orders marked as BILLED, and today's linked events set to COMPLETED.
                                4. Recipe-Deduction Engine:
                                   - Ingredients have minimum thresholds. When ingredient stock falls below this, low-stock warnings flash.
                                   - Sold items immediately trigger ingredient deduction. If an ingredient is exhausted, the corresponding menu items automatically toggle to 'Unavailable' to prevent out-of-stock orders.

                                ALL SCREEN WORKFLOWS:
                                1. Landing Page: Responsive, animated introduction to the POS system.
                                2. POS Screen: Categorized item menu grid. Left panel features categories; center is the product grid; right shows the selected table's active cart and total bill. Includes UPI dynamic QR payment.
                                3. KDS Screen (Kitchen Display System): Real-time ticket management board for baristas/chefs to mark items as complete.
                                4. Table Grid: Live seating arrangement editor (Seats, table number, status).
                                5. Menu Page: Add/edit menu dishes and prices, manage category groupings, and export data offline to Excel (.xlsx).
                                6. Inventory Screen: Ingredient ledger showing exact stock volume, units (grams, ml, pieces), and alert thresholds.
                                7. Recipes Page: Maps menu items to active ingredient ingredients (e.g. 1 Cappuccino = 15g Beans + 150ml Milk).
                                8. Calendar Booking: Full-screen calendar showing scheduled celebrations. Automatically marks tables as RESERVED in the POS grid during the event window.
                                9. AI Insights: Deep analytics dashboard including Peak hour traffic, slow-moving items, revenue forecasting, payment method distribution, and stock depletion rates.

                                GUIDELINES:
                                - Always use the 'getDashboardMetrics' tool to answer real-time queries about metrics (revenue, tables, low-stock).
                                - If asked how the system flow or a screen works, provide a highly descriptive, professional step-by-step breakdown using the details above.
                                - Keep your style warm, polite, and premium. Use Indian Rupees (₹) for money.
                                """)
                .defaultFunctions("getDashboardMetrics")
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                .build();
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request != null ? request.get("message") : "";
        if (userMessage == null || userMessage.isBlank()) {
            return Map.of("response", "How can I assist you with Brewly today?");
        }

        try {
            String response = chatClient.prompt()
                    .user(userMessage)
                    .call()
                    .content();
            if (response != null && !response.isBlank()) {
                return Map.of("response", response);
            }
        } catch (Exception e) {
            // Log warning and gracefully fall back to local knowledge base
            org.slf4j.LoggerFactory.getLogger(ChatController.class)
                    .warn("OpenAI API call failed (e.g. quota exhausted). Using local assistant fallback: {}", e.getMessage());
        }

        // Fallback response when OpenAI API credits are exhausted or network is unavailable
        String fallback = generateFallbackResponse(userMessage);
        return Map.of("response", fallback);
    }

    private String generateFallbackResponse(String input) {
        String lower = input.toLowerCase().trim();

        if (lower.matches("^(hi|hyy|hey|hello|good (morning|afternoon|evening)|hola).*")) {
            return "Hello! I'm your Brewly Assistant. How can I help you manage your café today? You can ask me about recipes, inventory deduction, tables, menu, or billing flow.";
        }

        if (lower.contains("recipe") || lower.contains("ingredient") || lower.contains("stock deduction")) {
            return "In Brewly, Recipes connect your Menu items to Inventory ingredients. When you link ingredients (e.g., 15g Coffee Beans to Cappuccino) and place an order in the POS, the system automatically deducts the ingredient quantities from your stock and recalculates menu availability in real time!";
        }

        if (lower.contains("table") || lower.contains("pos") || lower.contains("order")) {
            return "The POS screen displays your café's live table layout. Green indicates Available, Red indicates Occupied with an active order, and Orange indicates Reserved for a scheduled event. You can also process quick counter orders using Takeaway mode.";
        }

        if (lower.contains("inventory") || lower.contains("stock")) {
            return "The Inventory screen tracks all your raw ingredients, current stock levels, and alert thresholds. When ingredients fall below minimum thresholds, low-stock warnings appear on your Dashboard.";
        }

        if (lower.contains("menu") || lower.contains("dish") || lower.contains("category")) {
            return "The Menu screen allows you to add, edit, and organize food and beverage items by categories, toggle availability, and bulk import or export items using Excel spreadsheets.";
        }

        if (lower.contains("bill") || lower.contains("payment") || lower.contains("upi") || lower.contains("qr")) {
            return "Brewly supports Cash and UPI payments. When completing an order, selecting UPI generates a dynamic QR code displaying the exact bill amount. Once paid, the table is cleared and freed for the next customer.";
        }

        if (lower.contains("event") || lower.contains("booking") || lower.contains("calendar")) {
            return "The Event Booking screen allows you to schedule café gatherings (birthdays, corporate meetings, anniversaries) and automatically reserves selected tables during the event window.";
        }

        return "I'm currently operating in offline café assistant mode because your OpenAI API key credits are exhausted (429 - credit balance exhausted). Please update your API key or billing in .env.properties to enable live conversational mode. In the meantime, feel free to ask me about recipes, POS tables, inventory, billing, or events!";
    }
}
