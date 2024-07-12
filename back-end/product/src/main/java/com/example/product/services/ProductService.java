package com.example.product.services;

import com.example.product.ProductCategory;
import com.example.product.ProductRepository;
import com.example.product.clients.OrderFeignClient;
import com.example.product.constants.ProductFilterCriteria;
import com.example.product.dtos.ProductPurchaseRequest;
import com.example.product.dtos.ProductSold;
import com.example.product.dtos.PurchaseProductResponse;
import com.example.product.entities.*;
import com.example.product.exceptions.PurchaseProductException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final OrderFeignClient orderFeignClient;

    public List<Product> findAllByIdIn(List<String> ids) {
        return productRepository.findAllByIdIn(ids);
    }

    public boolean isProductExists(String productId) {
        return productRepository.existsById(productId);
    }

    public Product findByName(String name) {
        return productRepository.findByName(name);
    }

    @CacheEvict(value = "products", allEntries = true)
    public Product add(Object request) {
        if (request instanceof Map<?,?>) {
            Map<String, Object> requestMap = (Map<String, Object>) request;
            Map<String, Object> productMap = (Map<String, Object>) requestMap.get("product");

            Product product = null;
            ProductCategory category = ProductCategory.valueOf((String) productMap.get("category"));

            if(category == ProductCategory.RAM) {
                product = new ObjectMapper().convertValue(productMap, RAM.class);
            }
            if(category == ProductCategory.CPU) {
                product = new ObjectMapper().convertValue(productMap, CPU.class);
            }
            if(category == ProductCategory.GPU) {
                product = new ObjectMapper().convertValue(productMap, GPU.class);
            }

            assert product != null;
            return productRepository.save(product);
        }
        return null;
    }

    public Map<String, Object> getFilterFromProductInCategory(ProductCategory category) {
        List<Product> products = productRepository.findAllByCategory(category);
        String[] productFilter = switch (category) {
            case RAM -> ProductFilterCriteria.FilterRAM;
            case CPU -> ProductFilterCriteria.FilterCPU;
            case GPU -> ProductFilterCriteria.FilterGPU;
        };

        Map<String, Object> filterFields = new HashMap<>();
        int numberOfFields = productFilter.length;
        for (int i = 0; i < numberOfFields; i++) {
            filterFields.put(productFilter[i], new HashSet<>());
        }
        FilterPrice filterPrice = new FilterPrice(Double.MAX_VALUE, Double.MIN_VALUE);
        products.forEach(product -> {
            for (int i = 0; i < numberOfFields; i++) {
                Field field = getFieldByName(product.getClass(), productFilter[i]);
                if (field != null) {
                    field.setAccessible(true);
                    try {
                        ((Set<Object>) filterFields.get(productFilter[i])).add(field.get(product));
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
            }
            if (filterPrice.getMin() > product.getPrice()) {
                filterPrice.setMin(product.getPrice());
            }
            if (filterPrice.getMax() < product.getPrice()) {
                filterPrice.setMax(product.getPrice());
            }
        });
        filterFields.put("price", filterPrice);
        System.out.println(filterFields);
        return filterFields;
    }

    public Field getFieldByName(Class<?> clazz, String fieldName) {
        while (clazz != null) {
            for (Field field : clazz.getDeclaredFields()) {
                if (field.getName().equals(fieldName)) {
                    return field;
                }
            }
            clazz = clazz.getSuperclass();
        }
        return null;
    }

    public List<Field> getAllFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        while (clazz != null) {
            for (Field field : clazz.getDeclaredFields()) {
                fields.add(field);
            }
            clazz = clazz.getSuperclass();
        }
        return fields;
    }

    public List<String> getAllFieldNames(Class<?> clazz) {
        List<String> fieldNames = new ArrayList<>();
        while (clazz != null) {
            for (Field field : clazz.getDeclaredFields()) {
                fieldNames.add(field.getName());
            }
            clazz = clazz.getSuperclass();
        }
        return fieldNames;
    }

//    @Cacheable(value = "product", key = "#id")
    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    @Caching(evict = {
            @CacheEvict(value = "product", key = "#id"),
            @CacheEvict(value = "products", allEntries = true)
    })
    public void deleteById(String id) {
        productRepository.deleteById(id);
    }

    @Caching(evict = {
            @CacheEvict(value = "product", key = "#product.id"),
            @CacheEvict(value = "products", allEntries = true)
    })
    public Product update(String id, Product product) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            return null;
        }
        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());
        return productRepository.save(existingProduct);
    }

    @Cacheable(value = "products")
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public List<PurchaseProductResponse> purchase(List<ProductPurchaseRequest> request) {
        var productIds = request.stream().map(ProductPurchaseRequest::getProductId).toList();
        var products = findAllByIdIn(productIds);
        if(products.size() != productIds.size()) {
            throw new PurchaseProductException("One or more products are not found");
        }
        List<PurchaseProductResponse> purchasedProducts = new ArrayList<>();
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            ProductPurchaseRequest productPurchaseRequest = request.get(i);
            if (product.getStock() < productPurchaseRequest.getQuantity()) {
                throw new PurchaseProductException("Not enough quantity for product: " + product.getName());
            }
            product.setStock(product.getStock() - productPurchaseRequest.getQuantity());
            productRepository.save(product);
            purchasedProducts.add(
                    new PurchaseProductResponse(
                            product.getId(),
                            product.getName(),
                            productPurchaseRequest.getQuantity(),
                            product.getPrice()));
        }
        return purchasedProducts;
    }

    public Product update(Object request) {
        if (request instanceof Map<?,?>) {
            Map<String, Object> requestMap = (Map<String, Object>) request;
            Map<String, Object> productMap = (Map<String, Object>) requestMap.get("product");
            Product product = null;
            ProductCategory category = ProductCategory.valueOf((String) productMap.get("category"));
            if(category == ProductCategory.RAM) {
                product = new ObjectMapper().convertValue(productMap, RAM.class);
            }
            if(category == ProductCategory.CPU) {
                product = new ObjectMapper().convertValue(productMap, CPU.class);
            }
            if(category == ProductCategory.GPU) {
                product = new ObjectMapper().convertValue(productMap, GPU.class);
            }
            return productRepository.save(product);
        }
        return null;
    }

    public void deleteByIdIn(List<String> ids) {
        productRepository.deleteByIdIn(ids);
    }

    public List<Product> findAllByCategory(String category) {
        return productRepository.findAllByCategory(ProductCategory.valueOf(category));
    }

    public Map<ProductCategory, Integer> getProductSoldByCategory() {
        Map<String, Integer> productIdAndQuantity = orderFeignClient.getProductSold();
        Map<String, Product> productMap = productRepository.findAll().stream().collect(Collectors.toMap(Product::getId, Function.identity()));
        Map<ProductCategory, Integer> categoryMap = new HashMap<>();
        productIdAndQuantity.forEach((productId, quantity) -> {
            Product product = productMap.get(productId);
            ProductCategory category = product.getCategory();
            categoryMap.put(category, categoryMap.getOrDefault(category, 0) + quantity);
        });
        return categoryMap;
    }

    public List<ProductSold> getAllProductSold() {
        Map<String, Integer> productIdAndQuantity = orderFeignClient.getProductSold();
        Map<String, Product> productMap = productRepository.findAll().stream().collect(Collectors.toMap(Product::getId, Function.identity()));
        return productIdAndQuantity.entrySet().stream().map(entry -> {
            Product product = productMap.get(entry.getKey());
            return ProductSold.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .image(product.getImage())
                    .totalSold(entry.getValue())
                    .build();
        }).toList();
    }

    public int getTotalProduct() {
        return productRepository.findAll().size();
    }

    public List<Product> getProductByStockUnder(int stockUnder) {
        return productRepository.findAll().stream().filter(product -> product.getStock() < stockUnder).toList();
    }

    public List<Product> search(String query) {
        return productRepository.searchByMultipleFields(query);
    }
}
