<<<<<<< HEAD
<<<<<<< HEAD
//package com.brewly.brewly_backend.security;
//
//
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Service;
//
//import java.security.Key;
//import java.util.Date;
//
//@Service
//public class JwtService {
//
//    // 🔐 Secret key (keep long & safe)
//    private static final String SECRET_KEY =
//            "brewly_secret_key_which_should_be_at_least_32_characters_long";
//
//    // ⏱ Token validity (24 hours)
//    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;
//
//    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
//    }
//
//    // ✅ Generate token using email
//    public String generateToken(String email) {
//        return Jwts.builder()
//                .setSubject(email)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    // ✅ Extract email from token
//    public String extractEmail(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    // ✅ Validate token
//    public boolean isTokenValid(String token) {
//        try {
//            extractEmail(token);
//            return true;
//        } catch (Exception e) {
//            return false;
//        }
//    }
//}
//
=======
//package com.brewly.brewly_backend.security;
//
//
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Service;
//
//import java.security.Key;
//import java.util.Date;
//
//@Service
//public class JwtService {
//
//    // 🔐 Secret key (keep long & safe)
//    private static final String SECRET_KEY =
//            "brewly_secret_key_which_should_be_at_least_32_characters_long";
//
//    // ⏱ Token validity (24 hours)
//    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;
//
//    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
//    }
//
//    // ✅ Generate token using email
//    public String generateToken(String email) {
//        return Jwts.builder()
//                .setSubject(email)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    // ✅ Extract email from token
//    public String extractEmail(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    // ✅ Validate token
//    public boolean isTokenValid(String token) {
//        try {
//            extractEmail(token);
//            return true;
//        } catch (Exception e) {
//            return false;
//        }
//    }
//}
//
>>>>>>> 564c4ca (Initial commit: frontend and backend setup)
=======
package com.brewly.brewly_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "my-super-secret-key-for-brewly-project-very-secure";

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            extractEmail(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
>>>>>>> e55e188 (Add frontend and backend project structure)
