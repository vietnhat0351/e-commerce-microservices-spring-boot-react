package com.example.product;

import com.example.product.entities.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    Product findByName(String name);
    List<Product> findAllByIdIn(List<String> ids);

    void deleteByIdIn(List<String> ids);

    List<Product> findAllByCategory(ProductCategory productCategory);

    List<Product> findAllByNameContainingIgnoreCase(String keyword);

    // tìm kiếm sản phẩm theo nhiều trường gồm tên, nhà sản xuất, danh mục
    @Query("{$or:[{'name': {$regex: ?0, $options: 'i'}}, {'manufacturer': {$regex: ?0, $options: 'i'}}, {'category': {$regex: ?0, $options: 'i'}}]}")
    List<Product> searchByMultipleFields(String keyword);
}
