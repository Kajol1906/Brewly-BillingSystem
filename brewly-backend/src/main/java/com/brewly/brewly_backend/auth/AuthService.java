package com.brewly.brewly_backend.auth;

import com.brewly.brewly_backend.security.JwtService;
import com.brewly.brewly_backend.user.User;
import com.brewly.brewly_backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DataSeederService dataSeederService;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Derive display name from email if not provided
        String displayName = (request.getName() != null && !request.getName().isBlank())
                ? request.getName()
                : request.getEmail().split("@")[0].substring(0, 1).toUpperCase()
                  + request.getEmail().split("@")[0].substring(1);

        User user = new User();
        user.setName(displayName);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        
        // Seed initial data for the new user
        dataSeederService.seedDataForNewUser(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName());
    }
}
