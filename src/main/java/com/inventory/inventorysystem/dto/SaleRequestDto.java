package com.inventory.inventorysystem.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SaleRequestDto {

    private String customerName;
    private List<SaleItemRequestDto> items;
}