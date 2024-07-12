package com.example.user;

import com.example.user.entities.UserDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDetailRepository extends MongoRepository<UserDetails, String>{
    Optional<UserDetails> findByUserId(String userid);
}
