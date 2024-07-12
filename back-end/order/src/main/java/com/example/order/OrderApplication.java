package com.example.order;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableFeignClients
@SecurityScheme(
		name = "Order-Service",
		type = SecuritySchemeType.OPENIDCONNECT,
		openIdConnectUrl = "http://localhost:8080/realms/Pham-Viet-Nhat/.well-known/openid-configuration",
		scheme = "bearer",
		in = SecuritySchemeIn.HEADER
)
@EnableScheduling
public class OrderApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrderApplication.class, args);
	}

}
