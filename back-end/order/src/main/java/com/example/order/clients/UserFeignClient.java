package com.example.order.clients;

import com.example.order.dto.fullOrder.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
@FeignClient(name = "user-service", url = "${feign.client.user-service.url}")
public interface UserFeignClient {
    @GetMapping("/check-user-exists")
    boolean isUserExists(@RequestParam String userId);

    @GetMapping("/findUserById/{id}")
    User findUserById(@PathVariable String id);

    @GetMapping("/all")
    List<User> getAllUsers();
}
