package com.example.payment.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class PaymentTopicConfig {
    @Bean
    public NewTopic paymentTopic() {
        return TopicBuilder
                .name("payment-topic")
                .build();
    }
}
