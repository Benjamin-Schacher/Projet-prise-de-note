package com.dawan.MesNotes.security;

import com.dawan.MesNotes.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    private final String secretkey;
    private final int expirationTime;

    public JwtUtils(
            @Value("${secretKey}") String secretkey,
            @Value("${expirationTime}") int expirationTime
    ) {
        this.secretkey = secretkey;
        this.expirationTime = expirationTime;
    }

//    public String createToken(UserDetails userDetails) {
//        Map<String, Object> claims = new HashMap<>();
//
//        String authorities= userDetails.getAuthorities()
//                                                        .stream()
//                                                        .map(GrantedAuthority::getAuthority)
//                                                        .collect(Collectors.joining(","));
//        claims.put("roles", authorities);
//        return Jwts.builder()
//                                .claims(claims)
//                                .subject(((User) userDetails).getEmail())
//                                .issuedAt(new Date())
//                                .expiration(new Date((new Date()).getTime() + expirationTime))
//                                .signWith(getSecretKey(), Jwts.SIG.HS256)
//                                .compact();
//    }
        public String createToken(UserDetails userDetails) {
            Map<String, Object> claims = new HashMap<>();

            String authorities= userDetails.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));
            claims.put("roles", authorities);

            claims.put("id", ((User) userDetails).getId());

            return Jwts.builder()
                    .claims(claims)
                    .subject(((User) userDetails).getEmail())
                    .issuedAt(new Date())
                    .expiration(new Date((new Date()).getTime() + expirationTime))
                    .signWith(getSecretKey(), Jwts.SIG.HS256)
                    .compact();
        }

    // Transforme la clé secrète en objet SecretKey utilisable par JJWT
    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secretkey.getBytes(StandardCharsets.UTF_8));
    }

    // Vérifie si un token est valide pour un utilisateur donné
    public boolean valideToken(String token, UserDetails userDetails) {
        return extractUsername(token).equals(((User) userDetails).getEmail()) && !isTokenExpired(token);
    }

    // Extrait le username (subject) depuis le token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Méthode générique pour extraire n'importe quel claim du token
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    // Analyse le token et retourne tous les claims
    private Claims extractAllClaims(String token) {
        return Jwts.parser() // Initialise le parser JJWT
                .verifyWith(getSecretKey()) // Vérifie la signature avec la clé secrète
                .build() // Construit le parser
                .parseSignedClaims(token) // Analyse le token signé
                .getPayload(); // Récupère le contenu (claims)
    }

    // Vérifie si le token est expiré
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extrait la date d'expiration depuis le token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
