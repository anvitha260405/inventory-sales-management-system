package com.inventory.inventorysystem.service.impl;

import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.repository.ProductRepository;
import com.inventory.inventorysystem.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product addProduct(Product product) {
        productRepository.findBySku(product.getSku()).ifPresent(existing -> {
            throw new RuntimeException("Product with this SKU already exists");
        });
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existingProduct.setProductName(product.getProductName());
        existingProduct.setSku(product.getSku());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setUnitPrice(product.getUnitPrice());
        existingProduct.setCurrentStock(product.getCurrentStock());
        existingProduct.setReorderLevel(product.getReorderLevel());

        return productRepository.save(existingProduct);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getLowStockProducts() {
        List<Product> allProducts = productRepository.findAll();
        return allProducts.stream()
                .filter(product -> product.getCurrentStock() <= product.getReorderLevel())
                .toList();
    }

    @Override
    public void deleteProduct(Long id) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        productRepository.delete(existingProduct);
    }
}