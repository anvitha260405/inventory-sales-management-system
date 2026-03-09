package com.inventory.inventorysystem.repository;

import com.inventory.inventorysystem.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {
}