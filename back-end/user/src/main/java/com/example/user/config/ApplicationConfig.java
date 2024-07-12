package com.example.user.config;

import com.example.user.TokenUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;


@Configuration
public class ApplicationConfig {

//    @Bean
//    public JwtDecoder jwtDecoder() {
//        return JwtDecoders.fromIssuerLocation("http://localhost:8080/realms/Pham-Viet-Nhat");
//    }
    @Bean
    public TokenUtils tokenUtils() throws MalformedURLException {
        return new TokenUtils();
    }
}
