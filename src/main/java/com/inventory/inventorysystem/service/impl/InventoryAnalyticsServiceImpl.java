package com.inventory.inventorysystem.service.impl;

import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.entity.StockMovement;
import com.inventory.inventorysystem.repository.ProductRepository;
import com.inventory.inventorysystem.repository.StockMovementRepository;
import com.inventory.inventorysystem.repository.SaleItemRepository;
import com.inventory.inventorysystem.service.InventoryAnalyticsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryAnalyticsServiceImpl implements InventoryAnalyticsService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final SaleItemRepository saleItemRepository;

    public InventoryAnalyticsServiceImpl(ProductRepository productRepository,
                                         StockMovementRepository stockMovementRepository,
                                         SaleItemRepository saleItemRepository) {
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.saleItemRepository = saleItemRepository;
    }

    @Override
    public List<Product> getLowStockProducts() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .filter(p -> p.getCurrentStock() <= p.getReorderLevel())
                .collect(Collectors.toList());
    }

    @Override
    public List<Product> getDeadStockProducts() {

        List<Product> products = productRepository.findAll();

        return products.stream()
                .filter(p ->
                        p.getCurrentStock() > 0 &&
                                saleItemRepository.findAll().stream()
                                        .noneMatch(si -> si.getProduct().getId().equals(p.getId()))
                )
                .collect(Collectors.toList());
    }

    @Override
    public List<StockMovement> getStockMovements() {
        return stockMovementRepository.findAll();
    }
}