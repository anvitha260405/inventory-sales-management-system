package com.inventory.inventorysystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "movement_type", nullable = false)
    private String movementType;

    @Column(name = "quantity_changed", nullable = false)
    private Integer quantityChanged;

    @Column(name = "stock_before", nullable = false)
    private Integer stockBefore;

    @Column(name = "stock_after", nullable = false)
    private Integer stockAfter;

    @Column(name = "movement_date", nullable = false)
    private LocalDateTime movementDate;

    @Column(name = "reference_note")
    private String referenceNote;

    @PrePersist
    public void prePersist() {
        this.movementDate = LocalDateTime.now();
    }
}