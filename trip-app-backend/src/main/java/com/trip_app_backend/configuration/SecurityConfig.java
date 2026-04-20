package com.trip_app_backend.configuration;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

@Configuration
@EnableWebSecurity
// @AllArgsConstructor
public class SecurityConfig {

    @Value("${rsa.public-key}")
	RSAPublicKey publicKey;

	@Value("${rsa.private-key}")
	RSAPrivateKey privateKey;


    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // désactiver le contrôle des CSRF
                .csrf(csrf -> csrf.disable())
                // pour pouvoir recevoir des requêtes d'un nom de domaine différent
                .cors(c -> c.configurationSource(corsConfigurationSource())) // pour pouvoir recevoir des requêtes
                // d'un nom de domaine de différent
                // dire qui à le droit à quoi
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        // .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
                        // .anyRequest().authenticated())
                .anyRequest().permitAll())
                // connexion sans état : aucune donnée enregistrée en session pour les requêtes
                .sessionManagement(s ->
                s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // pour indiquer qu'on utilise le prorocole Oauth et JWT
                .oauth2ResourceServer(oa -> oa.jwt(Customizer.withDefaults()))
                // Utiliser le formulaire d'authentification basique (username et password)
                // .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
	JwtDecoder jwtDecoder() {
		return NimbusJwtDecoder.withPublicKey(publicKey).build();
	}

	@Bean
	JwtEncoder jwtEncoder() {
		JWK jwk = new RSAKey.Builder(publicKey).privateKey(privateKey).build();
		JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
		return new NimbusJwtEncoder(jwks);
	}
}
