package com.inventory.inventorysystem.repository;

import com.inventory.inventorysystem.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
}