package com.example.user;

import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.KeyFactory;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class TokenUtils {

    private JwkProvider jwkProvider;
    private static final String PUBLIC_KEY = "MIICmzCCAYMCBgGP4jUXCjANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjQwNjA0MDc0MzAxWhcNMzQwNjA0MDc0NDQxWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC98Y9X5du6vFb3OzZwyjTfXchbKmeasQun9YXv2vtt0KTktETIv0VCxjJg50HYEJVwgs89AUPqCPS5r1I6aJCHhloeZKqc7RupWSEnNWe+VnnKyTsunPEPWb7lSRnpuFR+zAziHEoUDqmETNNG0bbeYh2yb66MQEDs76FD3+1lS7EGZw7Rik6kVuyQEf1bJVPAo3bzm8Pk6RYPyU4W4k1VZXQvDeLnxgr+8jTXUztaRnkrsISq0dI7P6S1rfIOK2SsOO/4qbSFxmNmDyxtv06RLAlTYuWPO75nw5T3OXcZT/dY4uetC9NBFFJLdzREVpeePSA7VEQ9Oq8LpQvW+OzNAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAKFhfDG6JUViTWCYWhc+opaB5DQLUZ/9n9OgEk/U4LXCeHEDyAiPhyR9UB4WdM8eRZBp6B0IzffOQVB24pRmQ2b8vqdWP0Q6ZyBDjmDc+1TikO9cQfE3cwQEOfq7j1jDtZMniRGNpDq6z6KAkwMmID5wL/6eEbLUpthDJU1XmcEomyiSFtOfi/Rj67hbIdJpelvg+3fy+41K/uq04oX96b5ZNHv7tP+RrJaIlVthJMoUpeNdFhLt1hjgtCsJzTe4jrBHtNUnE5DY3PNXAkkzm/fpyLm/eGzIi7VtGrvYejdRzsVe3bUYNp9ZX5SQtkO+BEMREP+Zomzc+LjhWTfOx88="; // Replace with your actual public key

    public TokenUtils() throws MalformedURLException {
        jwkProvider = new JwkProviderBuilder(
                new URL("https://phamvietnhat.zapto.org:8443/realms/Pham-Viet-Nhat/protocol/openid-connect/certs")
        ).build();
    }

    public DecodedJWT decodeToken(String token) throws JwkException {
        DecodedJWT decodedJWT = JWT.decode(token);
        Jwk jwk = jwkProvider.get(decodedJWT.getKeyId());
        Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("https://phamvietnhat.zapto.org:8443/realms/Pham-Viet-Nhat")
                .build();
        return verifier.verify(token);
    }

    private RSAPublicKey getPublicKey() throws Exception {
        String publicKeyPEM = PUBLIC_KEY.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replaceAll("\\s", "");
        byte[] encoded = Base64.getDecoder().decode(publicKeyPEM);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return (RSAPublicKey) keyFactory.generatePublic(keySpec);
    }

    public String getUsernameFromToken(String token) throws Exception {
        DecodedJWT decodedJWT = decodeToken(token);
        Jwk jwk = jwkProvider.get(decodedJWT.getKeyId());
        Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("https://phamvietnhat.zapto.org:8443/realms/Pham-Viet-Nhat")
                .build();
        verifier.verify(token);
        return decodedJWT.getClaim("preferred_username").asString();
    }

    public String getUserIdFromToken(String token) throws Exception {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getClaim("sub").asString();
    }

    public String getEmailFromToken(String token) throws Exception {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getClaim("email").asString();
    }

    public boolean isTokenExpired(String token) throws Exception {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getExpiresAt().before(new java.util.Date());
    }
}
