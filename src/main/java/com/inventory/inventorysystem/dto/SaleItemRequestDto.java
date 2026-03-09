package com.inventory.inventorysystem.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaleItemRequestDto {

    private Long productId;
    private Integer quantity;
}