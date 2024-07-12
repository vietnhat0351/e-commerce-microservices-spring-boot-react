package com.example.user;

import com.auth0.jwk.JwkException;
import com.example.user.dto.*;
import com.example.user.dto.updateUserAddressRequest.UpdateUserAddressRequest;
import com.example.user.entities.Address;
import com.example.user.entities.User;
import com.example.user.entities.UserDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/users")
public class UserController {

    private final UserService userService;
    private final TokenUtils tokenUtils;

    @GetMapping("/findUserById/{id}")
    public User findUserById(@PathVariable String id) {
        return userService.findUserById(id);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/update-address")
    public ResponseEntity<UserDetails> updateAddress(@RequestBody UpdateAddressRequest request) {
        return ResponseEntity.ok(userService.updateAddress(request));
    }

    @PostMapping("/delete-address")
    public ResponseEntity<UserDetails> deleteAddress(@RequestBody DeleteAddressRequest request) {
        System.out.println(request);
        return ResponseEntity.ok(userService.deleteAddress(request));
    }

    @PostMapping("/add-address")
    public ResponseEntity<UserDetails> addAddress(@RequestBody AddAddressRequest request) {
        return ResponseEntity.ok(userService.addAddress(request));
    }

    @GetMapping("/get-user-address")
    public List<Address> getUserAddress(@RequestParam String userId) {
        return userService.getUserAddress(userId);
    }

    @GetMapping("/check-user-exists")
    public boolean isUserExists(@RequestParam String userId, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            System.out.println(token);
        } catch (Exception e) {
            return false;
        }
        return userService.isUserExists(userId);
    }

    @GetMapping("/all-representations")
    public List<UserRepresentation> getAllUserRepresentations() {
        return userService.getAllUserRepresentations();
    }

    @GetMapping("/all-customers")
    public List<Customer> getAllCustomers() {
        return userService.getAllCustomers();
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello from user controller!";
    }

    @GetMapping("/get-user-id")
    public String getUserIdFromToken(HttpServletRequest request, @RequestHeader("Authorization") String token) throws Exception {
        TokenUtils tokenUtils = new TokenUtils();
        System.out.println(token.substring(7));
        return tokenUtils.getUsernameFromToken(token.substring(7));
    }

    @PutMapping("/update-user-profile")
    public UserDetails updateUserProfile(@RequestBody UpdateUserProfileRequest request, @RequestHeader("Authorization") String authorizationHeader) {
        return userService.updateUserProfile(request, authorizationHeader.substring(7));
    }

    @GetMapping("/get-user-profile/{userId}")
    public GetUserProfileResponse getUserProfileById(@PathVariable String userId, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            tokenUtils.decodeToken(authorizationHeader.substring(7));
        } catch (JwkException e) {
            throw new RuntimeException(e);
        }
        return userService.getUserProfileById(userId);
    }

    @GetMapping("/get-total-quantity")
    public int getTotalUsersQuantity() {
        return userService.getTotalUsersQuantity();
    }

    @PutMapping("/update-user-address")
    public UserDetails updateUserAddress(@RequestBody UpdateUserAddressRequest request, @RequestHeader("Authorization") String authorizationHeader) {
        return userService.updateUserAddress(request, authorizationHeader.substring(7));
    }
}
