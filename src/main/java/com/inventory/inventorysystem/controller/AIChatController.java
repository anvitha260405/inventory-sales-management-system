package com.inventory.inventorysystem.controller;

import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIChatController {

    @Autowired
    private ProductService productService;

    public static class ChatRequest {
        public String message;
    }

    public static class ChatResponse {
        public String reply;
        public String type;
        public List<Map<String, Object>> data;

        public ChatResponse(String reply, String type) {
            this.reply = reply;
            this.type  = type;
        }

        public ChatResponse(String reply, String type, List<Map<String, Object>> data) {
            this.reply = reply;
            this.type  = type;
            this.data  = data;
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
        String msg = req.message == null ? "" : req.message.toLowerCase().trim();
        return ResponseEntity.ok(route(msg));
    }

    private ChatResponse route(String msg) {
        if (matches(msg, "hi", "hello", "hey", "good morning", "good evening")) {
            return new ChatResponse(
                    "Hi! I am your Inventory AI Assistant. Ask me things like:\n" +
                            "- Which products are low on stock?\n" +
                            "- Show dead stock\n" +
                            "- What is the total inventory value?\n" +
                            "- Which products need reordering?\n" +
                            "- Inventory summary",
                    "info"
            );
        }
        if (matches(msg, "low stock", "low on stock", "running out", "almost out", "stock alert")) {
            return handleLowStock();
        }
        if (matches(msg, "dead stock", "not moving", "no sales", "unsold", "idle stock", "slow moving")) {
            return handleDeadStock();
        }
        if (matches(msg, "reorder", "restock", "replenish", "order more", "need to order", "purchase order")) {
            return handleReorderSuggestions();
        }
        if (matches(msg, "inventory value", "total value", "stock worth", "worth", "value of inventory")) {
            return handleInventoryValue();
        }
        if (matches(msg, "total products", "how many products", "product count", "number of products")) {
            return handleProductCount();
        }
        if (matches(msg, "overstock", "overstocked", "excess stock", "too much stock", "surplus")) {
            return handleOverstock();
        }
        if (matches(msg, "summary", "overview", "dashboard", "status", "health", "report")) {
            return handleSummary();
        }
        if (matches(msg, "help", "what can you do", "commands", "options", "capabilities")) {
            return new ChatResponse(
                    "I can answer questions about your inventory:\n\n" +
                            "Stock Queries:\n" +
                            "  - low stock / stock alerts\n" +
                            "  - dead stock / slow moving\n" +
                            "  - overstocked products\n\n" +
                            "Value and Count:\n" +
                            "  - total inventory value\n" +
                            "  - total products\n\n" +
                            "Actions:\n" +
                            "  - reorder suggestions\n" +
                            "  - inventory summary",
                    "info"
            );
        }
        return new ChatResponse(
                "I didn't quite understand that. Try:\n" +
                        "- low stock products\n" +
                        "- dead stock\n" +
                        "- restock suggestions\n" +
                        "- inventory value\n" +
                        "- Type help for all options.",
                "warning"
        );
    }

    private ChatResponse handleLowStock() {
        try {
            List<Product> lowStock = productService.getLowStockProducts();
            if (lowStock.isEmpty()) {
                return new ChatResponse("Great news! No products are currently low on stock.", "success");
            }
            List<Map<String, Object>> rows = lowStock.stream()
                    .sorted(Comparator.comparingInt(Product::getCurrentStock))
                    .map(p -> {
                        Map<String, Object> row = new LinkedHashMap<>();
                        row.put("Product", p.getProductName());
                        row.put("SKU", p.getSku());
                        row.put("Category", p.getCategory());
                        row.put("Current Stock", p.getCurrentStock());
                        row.put("Reorder Level", p.getReorderLevel());
                        row.put("Deficit", p.getReorderLevel() - p.getCurrentStock());
                        return row;
                    }).collect(Collectors.toList());
            return new ChatResponse(
                    lowStock.size() + " product(s) are low on stock and need attention:",
                    "warning", rows
            );
        } catch (Exception e) {
            return errorResponse(e);
        }
    }

    private ChatResponse handleDeadStock() {
        try {
            List<Product> all = productService.getAllProducts();
            List<Product> dead = all.stream()
                    .filter(p -> p.getCurrentStock() > 50 && p.getCurrentStock() > p.getReorderLevel() * 3)
                    .sorted((a, b) -> b.getCurrentStock() - a.getCurrentStock())
                    .limit(10)
                    .collect(Collectors.toList());
            if (dead.isEmpty()) {
                return new ChatResponse("No dead stock detected. Your inventory is moving well!", "success");
            }
            List<Map<String, Object>> rows = dead.stream().map(p -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("Product", p.getProductName());
                row.put("SKU", p.getSku());
                row.put("Category", p.getCategory());
                row.put("Current Stock", p.getCurrentStock());
                row.put("Reorder Level", p.getReorderLevel());
                row.put("Status", "Potential Dead Stock");
                return row;
            }).collect(Collectors.toList());
            return new ChatResponse(
                    dead.size() + " product(s) may be dead stock (high quantity, low movement):",
                    "warning", rows
            );
        } catch (Exception e) {
            return errorResponse(e);
        }
    }

    private ChatResponse handleReorderSuggestions() {
        try {
            List<Product> needReorder = productService.getLowStockProducts();
            if (needReorder.isEmpty()) {
                return new ChatResponse("No reorders needed right now. All stock levels are healthy!", "success");
            }
            List<Map<String, Object>> rows = needReorder.stream().map(p -> {
                int suggestedQty = Math.max((p.getReorderLevel() * 3) - p.getCurrentStock(), 10);
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("Product", p.getProductName());
                row.put("SKU", p.getSku());
                row.put("Current Stock", p.getCurrentStock());
                row.put("Reorder Level", p.getReorderLevel());
                row.put("Suggested Order Qty", suggestedQty);
                row.put("Priority", p.getCurrentStock() == 0 ? "URGENT" : "Soon");
                return row;
            }).collect(Collectors.toList());
            long urgent = rows.stream().filter(r -> "URGENT".equals(r.get("Priority"))).count();
            return new ChatResponse(
                    "Restock Suggestions: " + needReorder.size() + " items need ordering" +
                            (urgent > 0 ? " (" + urgent + " URGENT)" : "") + ":",
                    urgent > 0 ? "warning" : "info", rows
            );
        } catch (Exception e) {
            return errorResponse(e);
        }
    }

    private ChatResponse handleInventoryValue() {
        try {
            List<Product> all = productService.getAllProducts();
            double totalValue = all.stream().mapToDouble(p -> p.getCurrentStock() * p.getUnitPrice()).sum();
            int totalUnits = all.stream().mapToInt(Product::getCurrentStock).sum();
            double avgPrice = all.isEmpty() ? 0 : all.stream().mapToDouble(Product::getUnitPrice).average().orElse(0);
            return new ChatResponse(
                    "Inventory Value Report\n\n" +
                            "- Total Inventory Value: Rs." + String.format("%.2f", totalValue) + "\n" +
                            "- Total Stock Units: " + totalUnits + "\n" +
                            "- Total Distinct Products: " + all.size() + "\n" +
                            "- Average Product Price: Rs." + String.format("%.2f", avgPrice),
                    "success"
            );
        } catch (Exception e) {
            return errorResponse(e);
        }
    }

    private ChatResponse handleProductCount() {
        try {
            List<Product> all = productService.getAllProducts();
            long inStock    = all.stream().filter(p -> p.getCurrentStock() > 0).count();
            long outOfStock = all.stream().filter(p -> p.getCurrentStock() == 0).count();
            long lowStock   = all.stream().filter(p -> p.getCurrentStock() > 0 && p.getCurrentStock() <= p.getReorderLevel()).count();
            return new ChatResponse(
                    "Product Count Summary\n\n" +
                            "- Total Products: " + all.size() + "\n" +
                            "- In Stock: " + inStock + "\n" +
                            "- Low Stock: " + lowStock + "\n" +
                            "- Out of Stock: " + outOfStock,
                    "info"
            );
        } catch (Exception e) {
            return errorResponse(e);
        }
    }

    private ChatResponse handleOverstock() {
        try {
            List<Product> all = productService.getAllProducts();
            List<Product> overstocked = all.stream()
                    .filter(p -> p.getReorderLevel() > 0 && p.getCurrentStock() > p.getReorderLevel() * 5)
                    .sorted((a, b) -> b.getCurrentStock() - a.getCurrentStock())
                    .collect(Collectors.toList());
            if (overstocked.isEmpty()) {
                return new ChatResponse("No significant overstock detected. Inventory levels look balanced!", "success");
            }
            List<Map<String, Object>> rows = overstocked.stream().map(p -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("Product", p.getProductName());
                row.put("SKU", p.getSku());
                row.put("Category", p.getCategory());
                row.put("Current Stock", p.getCurrentStock());
                row.put("Reorder Level", p.getReorderLevel());
                row.put("Excess Units", p.getCurrentStock() - (p.getReorderLevel() * 2));
                return row;
            }).collect(Collectors.toList());
            return new ChatResponse(
                    overstocked.size() + " overstocked product(s) detected. Consider slowing procurement:",
                    "warning", rows
            );
        } catch (Exception e) {
            return errorResponse(e);
        }
    }

    private ChatResponse handleSummary() {
        try {
            List<Product> all = productService.getAllProducts();
            long lowStock   = all.stream().filter(p -> p.getCurrentStock() <= p.getReorderLevel()).count();
            long outOfStock = all.stream().filter(p -> p.getCurrentStock() == 0).count();
            double totalVal = all.stream().mapToDouble(p -> p.getCurrentStock() * p.getUnitPrice()).sum();
            String health;
            String type;
            if (outOfStock > 0 || lowStock > 3) {
                health = "Needs Attention";
                type   = "warning";
            } else if (lowStock > 0) {
                health = "Moderate";
                type   = "info";
            } else {
                health = "Healthy";
                type   = "success";
            }
            return new ChatResponse(
                    "Inventory Health Summary\n\n" +
                            "- Overall Status: " + health + "\n" +
                            "- Total Products: " + all.size() + "\n" +
                            "- Low Stock Items: " + lowStock + "\n" +
                            "- Out of Stock: " + outOfStock + "\n" +
                            "- Total Inventory Value: Rs." + String.format("%.2f", totalVal) +
                            (lowStock > 0 ? "\n\nTip: Ask me for restock suggestions to fix low stock items." : ""),
                    type
            );
        } catch (Exception e) {
            return errorResponse(e);
        }
    }

    private boolean matches(String msg, String... keywords) {
        for (String kw : keywords) {
            if (msg.contains(kw)) return true;
        }
        return false;
    }

    private ChatResponse errorResponse(Exception e) {
        return new ChatResponse("Something went wrong: " + e.getMessage(), "error");
    }
}