package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.entity.StockMovement;

import java.util.List;

public interface InventoryAnalyticsService {

    List<Product> getLowStockProducts();

    List<Product> getDeadStockProducts();

    List<StockMovement> getStockMovements();

    Double getInventoryTurnover();
}