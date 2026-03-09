package com.inventory.inventorysystem.service.impl;

import com.inventory.inventorysystem.dto.SaleItemRequestDto;
import com.inventory.inventorysystem.dto.SaleRequestDto;
import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.entity.Sale;
import com.inventory.inventorysystem.entity.SaleItem;
import com.inventory.inventorysystem.entity.StockMovement;
import com.inventory.inventorysystem.repository.ProductRepository;
import com.inventory.inventorysystem.repository.SaleRepository;
import com.inventory.inventorysystem.repository.StockMovementRepository;
import com.inventory.inventorysystem.service.SaleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public SaleServiceImpl(SaleRepository saleRepository,
                           ProductRepository productRepository,
                           StockMovementRepository stockMovementRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Override
    @Transactional
    public Sale recordSale(SaleRequestDto saleRequestDto) {

        if (saleRequestDto.getItems() == null || saleRequestDto.getItems().isEmpty()) {
            throw new RuntimeException("Sale must contain at least one item");
        }

        Sale sale = new Sale();
        sale.setCustomerName(saleRequestDto.getCustomerName());
        sale.setTotalAmount(0.0);
        sale.setSaleItems(new ArrayList<>());

        double totalAmount = 0.0;

        for (SaleItemRequestDto itemDto : saleRequestDto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDto.getProductId()));

            if (itemDto.getQuantity() == null || itemDto.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than zero");
            }

            if (product.getCurrentStock() < itemDto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getProductName());
            }

            int stockBefore = product.getCurrentStock();
            int stockAfter = stockBefore - itemDto.getQuantity();

            double subtotal = product.getUnitPrice() * itemDto.getQuantity();
            totalAmount += subtotal;

            SaleItem saleItem = new SaleItem();
            saleItem.setSale(sale);
            saleItem.setProduct(product);
            saleItem.setQuantity(itemDto.getQuantity());
            saleItem.setUnitPrice(product.getUnitPrice());
            saleItem.setSubtotal(subtotal);

            sale.getSaleItems().add(saleItem);

            product.setCurrentStock(stockAfter);
            productRepository.save(product);

            StockMovement stockMovement = new StockMovement();
            stockMovement.setProduct(product);
            stockMovement.setMovementType("SALE_OUT");
            stockMovement.setQuantityChanged(itemDto.getQuantity());
            stockMovement.setStockBefore(stockBefore);
            stockMovement.setStockAfter(stockAfter);
            stockMovement.setReferenceNote("Stock reduced due to sale");

            stockMovementRepository.save(stockMovement);
        }

        sale.setTotalAmount(totalAmount);

        return saleRepository.save(sale);
    }

    @Override
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @Override
    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));
    }
}