package com.trip_app_backend.services;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import com.trip_app_backend.dto.AuthResponseDto;
import com.trip_app_backend.dto.RegisterRequestDto;
import com.trip_app_backend.enums.Role;
import com.trip_app_backend.exceptions.BadRequestException;
import com.trip_app_backend.models.User;
import com.trip_app_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    public void register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .displayName(request.getDisplayName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
    }


        private String generateAccessToken(User user) {
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuedAt(Instant.now())
                .issuer("trip-app-backend")
                .expiresAt(Instant.now().plus(5, ChronoUnit.MINUTES))
                .subject(String.valueOf(user.getId()))
                .claim("name", user.getDisplayName())
                .claim("role", user.getRole())
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
    }

    private String generateRefreshToken(User user) {
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuedAt(Instant.now())
                .issuer("blog-backend")
                .expiresAt(Instant.now().plus(1, ChronoUnit.DAYS))
                .subject(String.valueOf(user.getId()))
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
    }

    public AuthResponseDto authenticateByPassword(String email, String password)
    {
        var user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("invalid email or password"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadCredentialsException("invalid email or password");
        }
        return new AuthResponseDto(generateAccessToken(user), generateRefreshToken(user));
    }

    public AuthResponseDto authenticateByRefreshToken(String refreshToken) {
        var jwt = jwtDecoder.decode(refreshToken);
        var userId = UUID.fromString(jwt.getSubject());
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("invalid refresh token"));
        return new AuthResponseDto(generateAccessToken(user), generateRefreshToken(user));
    }
}
