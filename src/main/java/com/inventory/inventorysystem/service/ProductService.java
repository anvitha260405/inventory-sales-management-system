package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.entity.Product;

import java.util.List;

public interface ProductService {

    Product addProduct(Product product);

    Product updateProduct(Long id, Product product);

    Product getProductById(Long id);

    List<Product> getAllProducts();

    List<Product> getLowStockProducts();

    void deleteProduct(Long id);
}