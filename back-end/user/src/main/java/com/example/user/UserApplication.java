package com.example.user;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@SecurityScheme(
		name = "User-Service",
		type = SecuritySchemeType.OPENIDCONNECT,
		openIdConnectUrl = "http://localhost:8080/realms/Pham-Viet-Nhat/.well-known/openid-configuration",
		scheme = "bearer",
		in = SecuritySchemeIn.HEADER
)
public class UserApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserApplication.class, args);
	}

}
