package com.example.notification;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@SecurityScheme(
		name = "Notification-Service",
		type = SecuritySchemeType.OPENIDCONNECT,
		openIdConnectUrl = "http://localhost:8080/realms/Pham-Viet-Nhat/.well-known/openid-configuration",
		scheme = "bearer",
		in = SecuritySchemeIn.HEADER
)
public class
NotificationApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotificationApplication.class, args);
	}

}
