package com.example.order.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        WebSocketMessageBrokerConfigurer.super.configureClientInboundChannel(registration.interceptors(
                new ChannelInterceptor() {
                    @Override
                    public Message<?> preSend(Message<?> message, MessageChannel channel) {
                        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
                        String authHeader = accessor.getFirstNativeHeader("Authorization");

                        if (authHeader != null && authHeader.startsWith("Bearer ")) {
                            String jwtToken = authHeader.substring(7);
                            System.out.println(jwtToken);
                            // Xác thực JWT token
                            // Nếu hợp lệ, tiếp tục
                            // Nếu không hợp lệ, throw exception hoặc từ chối kết nối
                        }

                        return message;
                    }
                }
        ));
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
//                .setAllowedOrigins("*")
                .setAllowedOriginPatterns("*")
                // .setAllowedOriginPatterns("https://phamvietnhat.zapto.org", "http://localhost:3000")
//                 .setAllowedOrigins("https://phamvietnhat.zapto.org", "http://localhost:3000")
                .withSockJS();
    }
}