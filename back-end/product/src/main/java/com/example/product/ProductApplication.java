package com.example.product;

import com.example.product.entities.*;
import com.example.product.services.ProductService;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.lang.instrument.Instrumentation;
import java.lang.reflect.Field;
import java.util.*;

@SpringBootApplication
@SecurityScheme(
        name = "Product-Service",
        type = SecuritySchemeType.OPENIDCONNECT,
        openIdConnectUrl = "http://localhost:8080/realms/Pham-Viet-Nhat/.well-known/openid-configuration",
        scheme = "bearer",
        in = SecuritySchemeIn.HEADER
)
@EnableFeignClients
@EnableCaching
public class ProductApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductApplication.class, args);
    }


    public static Map<String, Object> convertObjectToMap(Object obj) {
        Map<String, Object> resultMap = new HashMap<>();
        Class<?> objClass = obj.getClass();
        while (objClass != null) {
            for (Field field : objClass.getDeclaredFields()) {
                field.setAccessible(true);
                try {
                    resultMap.put(field.getName(), field.get(obj));
                    System.out.println(field.getName() + ": " + field.get(obj));
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
            objClass = objClass.getSuperclass();
        }

        return resultMap;
    }

    public static List<String> getAllFields(Class<?> clazz) {
        List<String> fieldNames = new ArrayList<>();
        while (clazz != null) {
            for (Field field : clazz.getDeclaredFields()) {
                fieldNames.add(field.getName());
            }
            clazz = clazz.getSuperclass();
        }
        return fieldNames;
    }

}
