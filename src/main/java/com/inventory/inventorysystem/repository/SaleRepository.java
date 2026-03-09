package com.inventory.inventorysystem.repository;

import com.inventory.inventorysystem.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}