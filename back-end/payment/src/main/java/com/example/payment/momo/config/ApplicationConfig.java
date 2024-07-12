package com.example.payment.momo.config;

import com.example.payment.momo.dto.PartnerInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {

    @Value("${payment.momo.partner-code}")
    private String partnerCode;

    @Value("${payment.momo.access-key}")
    private String accessKey;

    @Value("${payment.momo.secret-key}")
    private String secretKey;

    @Bean
    public PartnerInfo partnerInfo() {
        return new PartnerInfo(partnerCode, accessKey, secretKey);
    }
}
