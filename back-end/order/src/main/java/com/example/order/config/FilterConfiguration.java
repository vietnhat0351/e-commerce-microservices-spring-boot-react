package com.example.order.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.Map;

@Configuration
public class FilterConfiguration {

    private final ApplicationContext applicationContext;

    public FilterConfiguration(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

//    @Bean
    public FilterRegistrationBean<?>[] logFilterRegistrations() {
        Map<String, FilterRegistrationBean> filterRegistrationBeans = applicationContext.getBeansOfType(FilterRegistrationBean.class);
        for (Map.Entry<String, FilterRegistrationBean> entry : filterRegistrationBeans.entrySet()) {
            System.out.println("Filter name: " + entry.getKey() + ", Filter class: " + entry.getValue().getFilter().getClass().getName());
        }
        return new FilterRegistrationBean[0];
    }
}