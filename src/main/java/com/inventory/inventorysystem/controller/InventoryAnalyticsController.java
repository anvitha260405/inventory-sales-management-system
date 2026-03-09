package com.inventory.inventorysystem.controller;

import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.entity.StockMovement;
import com.inventory.inventorysystem.service.InventoryAnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin("*")
public class InventoryAnalyticsController {

    private final InventoryAnalyticsService analyticsService;

    public InventoryAnalyticsController(InventoryAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return analyticsService.getLowStockProducts();
    }

    @GetMapping("/dead-stock")
    public List<Product> getDeadStockProducts() {
        return analyticsService.getDeadStockProducts();
    }

    @GetMapping("/stock-movements")
    public List<StockMovement> getStockMovements() {
        return analyticsService.getStockMovements();
    }

    @GetMapping("/turnover")
    public Double getInventoryTurnover() {
        return analyticsService.getInventoryTurnover();
    }
}