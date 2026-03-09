package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.dto.SaleRequestDto;
import com.inventory.inventorysystem.entity.Sale;

import java.util.List;

public interface SaleService {

    Sale recordSale(SaleRequestDto saleRequestDto);

    List<Sale> getAllSales();

    Sale getSaleById(Long id);
}