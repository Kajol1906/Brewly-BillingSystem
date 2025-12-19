<<<<<<< HEAD
<<<<<<< HEAD
package com.brewly.brewly_backend.auth;

import com.brewly.brewly_backend.user.User;
import com.brewly.brewly_backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /* SIGNUP */
    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        // simple token (for learning purpose)
        String token = UUID.randomUUID().toString();

        return new AuthResponse(token);
    }

    /* LOGIN */
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = UUID.randomUUID().toString();

        return new AuthResponse(token);
    }
}
=======
package com.brewly.brewly_backend.auth;

=======
package com.brewly.brewly_backend.auth;

import com.brewly.brewly_backend.security.JwtService;
>>>>>>> e55e188 (Add frontend and backend project structure)
import com.brewly.brewly_backend.user.User;
import com.brewly.brewly_backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
<<<<<<< HEAD
=======
    private final JwtService  jwtService;
>>>>>>> e55e188 (Add frontend and backend project structure)

    /* SIGNUP */
    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

<<<<<<< HEAD
        // simple token (for learning purpose)
        String token = UUID.randomUUID().toString();
=======

        String token = jwtService.generateToken(user.getEmail());
>>>>>>> e55e188 (Add frontend and backend project structure)

        return new AuthResponse(token);
    }

    /* LOGIN */
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

<<<<<<< HEAD
        String token = UUID.randomUUID().toString();
=======
        String token = jwtService.generateToken(user.getEmail());
>>>>>>> e55e188 (Add frontend and backend project structure)

        return new AuthResponse(token);
    }
}
<<<<<<< HEAD
>>>>>>> 564c4ca (Initial commit: frontend and backend setup)
=======
>>>>>>> e55e188 (Add frontend and backend project structure)
