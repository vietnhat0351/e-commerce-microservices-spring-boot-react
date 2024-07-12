package com.example.user;

import com.auth0.jwk.JwkException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.user.dto.*;
import com.example.user.dto.updateUserAddressRequest.UpdateUserAddressRequest;
import com.example.user.entities.Address;
import com.example.user.entities.User;
import com.example.user.entities.UserDetails;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final Keycloak keycloak;
    private final UserDetailRepository userDetailRepository;
    private final TokenUtils tokenUtils;

    private static final String realm = "Pham-Viet-Nhat";

    public boolean isUserExists(String userId) {
        return keycloak.realm(realm).users().get(userId) != null;
    }

    public List<UserRepresentation> getAllUserRepresentations() {
        return keycloak.realm(realm).users().list();
    }

    public User findUserById(String id) {
        UserRepresentation user = keycloak.realm(realm).users().get(id).toRepresentation();
        UserDetails userDetails = userDetailRepository.findByUserId(id).orElseGet(UserDetails::new);
        return User.builder()
                .id(user.getId())
                .firstname(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .avatar(user.getAttributes().get("picture").get(0))
                .addressList(userDetails.getAddressList())
                .build();
    }

    public UserDetails updateAddress(UpdateAddressRequest request) {
        Address address = request.getAddress();
        Optional<UserDetails> userDetailsOptional = Optional.of(userDetailRepository.findByUserId(request.getUserId()).orElseGet(UserDetails::new));
        UserDetails userDetails = userDetailsOptional.get();
        userDetails.setUserId(request.getUserId());
        userDetails.getAddressList().forEach(a -> {
            if (a.getId().equals(address.getId())) {
                a = address;
            }
        });
        return userDetailRepository.save(userDetails);
    }

    public UserDetails addAddress(AddAddressRequest request) {

        Address address = Address.builder()
                .district(request.getDistrict())
                .ward(request.getWard())
                .id(new ObjectId().toString())
                .province(request.getProvince())
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .street(request.getStreet())
                .build();

        Optional<UserDetails> userDetailsOptional = Optional.of(userDetailRepository.findByUserId(request.getUserId()).orElseGet(UserDetails::new));
        UserDetails userDetails = userDetailsOptional.get();
        userDetails.setUserId(request.getUserId());
        List<Address> addressList = userDetails.getAddressList();
        if (addressList == null) {
            userDetails.setAddressList(List.of(address));
        } else {
            userDetails.getAddressList().add(address);
        }
        return userDetailRepository.save(userDetails);
    }

    public List<Address> getUserAddress(String userId) {
        return userDetailRepository.findByUserId(userId).map(UserDetails::getAddressList).orElseGet(List::of);
    }

    public UserDetails deleteAddress(DeleteAddressRequest request) {
        Optional<UserDetails> userDetailsOptional = userDetailRepository.findByUserId(request.getUserId());
        UserDetails userDetails = userDetailsOptional.orElseGet(UserDetails::new);
        userDetails.getAddressList().removeIf(address -> address.getId().equals(request.getAddressId()));
        return userDetailRepository.save(userDetails);
    }

    public List<User> getAllUsers() {
        return keycloak.realm(realm).users().list().stream().map(user -> User.builder()
                .id(user.getId())
                .firstname(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .avatar(user.getAttributes().get("picture").get(0))
                .addressList(getUserAddress(user.getId()))
                .build()).toList();
    }

    public List<Customer> getAllCustomers() {
        List<User> users = getAllUsers();
        Map<String, UserDetails> userDetailsMap = userDetailRepository.findAll().stream().collect(Collectors.toMap(UserDetails::getUserId, userDetails -> userDetails));
        List<Customer> customers = new ArrayList<>();
        users.forEach(user -> customers.add(Customer.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .phone( userDetailsMap.getOrDefault(user.getId(), new UserDetails()).getPhone())
                .avatar(user.getAvatar())
                .build()));
        return customers;
    }

    public UserDetails updateUserProfile(UpdateUserProfileRequest request, String token) {
        if (!isUserExists(request.getUserId())) {
            throw new RuntimeException("User not found");
        }
        DecodedJWT decodedJWT;
        try {
            decodedJWT = tokenUtils.decodeToken(token);
        } catch (JwkException e) {
            throw new RuntimeException(e);
        }
        if (!request.getUserId().equals(decodedJWT.getClaim("sub").asString())) {
            throw new RuntimeException("Unauthorized");
        }
        UserDetails userDetails = userDetailRepository.findByUserId(request.getUserId()).orElseGet(UserDetails::new);
        userDetails.setPhone(request.getPhone());
        userDetails.setDob(request.getDob());
        userDetails.setGender(request.getGender());
        return userDetailRepository.save(userDetails);
    }


    public GetUserProfileResponse getUserProfileById(String userId) {
        User user = findUserById(userId);
        UserDetails userDetails = userDetailRepository.findByUserId(userId).orElseGet(UserDetails::new);
        return GetUserProfileResponse.builder()
                .dob(userDetails.getDob())
                .phone(userDetails.getPhone())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .gender(userDetails.getGender())
                .avatar(user.getAvatar())
                .firstname(user.getFirstname())
                .id(user.getId())
                .build();
    }

    public int getTotalUsersQuantity() {
        return keycloak.realm(realm).users().count();
    }

    public UserDetails updateUserAddress(UpdateUserAddressRequest request, String token) {
        if (!isUserExists(request.getUserId())) {
            throw new RuntimeException("User not found");
        }
        DecodedJWT decodedJWT;
        try {
            decodedJWT = tokenUtils.decodeToken(token);
        } catch (JwkException e) {
            throw new RuntimeException(e);
        }
        if (!request.getUserId().equals(decodedJWT.getClaim("sub").asString())) {
            throw new RuntimeException("Unauthorized");
        }
        UserDetails userDetails = userDetailRepository.findByUserId(request.getUserId()).orElseGet(UserDetails::new);
        userDetails.getAddressList().forEach(address -> {
            if (address.getId().equals(request.getAddress().getId())) {
                address = new Address(
                        request.getAddress().getId(),
                        request.getAddress().getRecipientName(),
                        request.getAddress().getRecipientPhone(),
                        request.getAddress().getStreet(),
                        request.getAddress().getWard(),
                        request.getAddress().getDistrict(),
                        request.getAddress().getProvince()
                );
            }
        });
        return userDetailRepository.save(userDetails);
    }
}
