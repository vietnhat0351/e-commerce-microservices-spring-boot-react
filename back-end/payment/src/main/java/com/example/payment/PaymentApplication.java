package com.example.payment;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@SecurityScheme(
		name = "Payment-Service",
		type = SecuritySchemeType.OPENIDCONNECT,
		openIdConnectUrl = "https://localhost:8080/realms/Pham-Viet-Nhat/.well-known/openid-configuration",
		scheme = "bearer",
		in = SecuritySchemeIn.HEADER
)
public class PaymentApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaymentApplication.class, args);
	}

}
