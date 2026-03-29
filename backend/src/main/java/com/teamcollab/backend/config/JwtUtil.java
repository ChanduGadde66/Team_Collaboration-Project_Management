package com.teamcollab.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey123"; // 32+ chars
    private final Key key;

    public JwtUtil() {
        this.key = Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(String email) {
        String token = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        
        return token;
    }

    public String extractEmail(String token) throws JwtException {
        try {
            String email = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            
            return email;
        } catch (ExpiredJwtException e) {
            throw e;
        } catch (JwtException e) {
            throw e;
        } catch (Exception e) {
            throw new JwtException("Failed to parse JWT: " + e.getMessage(), e);
        }
    }
}