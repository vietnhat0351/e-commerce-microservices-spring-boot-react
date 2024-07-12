package com.example.product;

import com.example.product.dtos.*;
import com.example.product.entities.*;
import com.example.product.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RequestMapping("/api/v1/products")
@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    @PostMapping("/purchase")
    public List<PurchaseProductResponse> purchase(@RequestBody List<ProductPurchaseRequest> request) {
        return productService.purchase(request);
    }

    @GetMapping("/check-product-exists")
    public boolean isProductExists(@RequestParam String productId) {
        return productService.isProductExists(productId);
    }

    @GetMapping("/all")
    public List<Product> findAll() {
        return productService.findAll();
    }

    @GetMapping("/getFilterByCategory")
    public Map<String, Object> getFilterByCategory(@RequestParam String category) {
        ProductCategory productCategory = ProductCategory.valueOf(category.toUpperCase());
        return productService.getFilterFromProductInCategory(productCategory);
    }

    @GetMapping("/allByCategory")
    public ResponseEntity<List<Product> > findAllByCategory(@RequestParam String category) {
        return ResponseEntity.ok(productService.findAllByCategory(category.toUpperCase()));
    }

    @PostMapping("/allByIdIn")
    public List<Product> findAllByIdIn(@RequestBody FindAllProductByIdInRequest request) {
        return productService.findAllByIdIn(request.getIds());
    }

    @PostMapping("/add")
    public Product add(@RequestBody Object request) {
        return productService.add(request);
    }

    @PutMapping("/update")
    public Product update(@RequestBody Object request) {
        return productService.update(request);
    }

    @GetMapping("/findByName")
    public Product findByName(@RequestParam String name) {
        return productService.findByName(name);
    }

    @GetMapping("/findById/{id}")
    public Product findById(@PathVariable String id) {
        return productService.findById(id);
    }

    @DeleteMapping("/delete")
    public void deleteById(String id) {
        productService.deleteById(id);
    }

    @PostMapping("/deleteByIdIn")
    public ResponseEntity<String> deleteByIdIn(@RequestBody DeleteProductByIdsRequest request) {
        productService.deleteByIdIn(request.getIds());
        return ResponseEntity.ok("Deleted successfully");
    }

    // thống kê số lượng sản phẩm bán được theo danh mục
    @GetMapping("/getProductSoldByCategory")
    public Map<ProductCategory, Integer> getProductSoldByCategory() {
        return productService.getProductSoldByCategory();
    }

    @GetMapping("/getProductSold")
    public List<ProductSold> getAllProductSold() {
        return productService.getAllProductSold();
    }

    @GetMapping("/get-total-quantity")
    public int getTotalProduct() {
        return productService.getTotalProduct();
    }

    // lấy danh sách sản phẩm có số lượng tồn kho dưới 20 sản phẩm
    @GetMapping("/get-product-by-stock-under")
    public List<Product> getProductByStockUnder(@RequestParam int stockUnder) {
        return productService.getProductByStockUnder(stockUnder);
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String query) {
        return productService.search(query);
    }

}
