package com.inventory.inventorysystem.controller;

import com.inventory.inventorysystem.dto.SaleRequestDto;
import com.inventory.inventorysystem.entity.Sale;
import com.inventory.inventorysystem.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin("*")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public Sale recordSale(@RequestBody SaleRequestDto saleRequestDto) {
        return saleService.recordSale(saleRequestDto);
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @GetMapping("/{id}")
    public Sale getSaleById(@PathVariable Long id) {
        return saleService.getSaleById(id);
    }
}