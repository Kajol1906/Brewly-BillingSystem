package com.brewly.brewly_backend.user;

import com.brewly.brewly_backend.security.UserContextHelper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final UserContextHelper userContextHelper;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/settings")
    public ResponseEntity<UserSettingsDto> getUserSettings() {
        User user = userContextHelper.getCurrentUser();
        return ResponseEntity.ok(new UserSettingsDto(user.getName(), user.getEmail(), user.getPhoneNumber(), user.getStoreAddress()));
    }

    @PutMapping("/settings")
    public ResponseEntity<UserSettingsDto> updateUserSettings(@RequestBody UserSettingsDto settingsDto) {
        User user = userContextHelper.getCurrentUser();
        if (settingsDto.getStoreName() != null) {
            user.setName(settingsDto.getStoreName());
        }
        if (settingsDto.getPhoneNumber() != null) {
            user.setPhoneNumber(settingsDto.getPhoneNumber());
        }
        if (settingsDto.getStoreAddress() != null) {
            user.setStoreAddress(settingsDto.getStoreAddress());
        }
        userRepository.save(user);
        return ResponseEntity.ok(new UserSettingsDto(user.getName(), user.getEmail(), user.getPhoneNumber(), user.getStoreAddress()));
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateDto passwordDto) {
        User user = userContextHelper.getCurrentUser();
        
        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect current password");
        }
        
        user.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
        userRepository.save(user);
        
        return ResponseEntity.ok().body("Password updated successfully");
    }

    @Data
    public static class PasswordUpdateDto {
        private String currentPassword;
        private String newPassword;
    }

    @Data
    public static class UserSettingsDto {
        private String storeName;
        private String email;
        private String phoneNumber;
        private String storeAddress;

        public UserSettingsDto() {}

        public UserSettingsDto(String storeName, String email, String phoneNumber, String storeAddress) {
            this.storeName = storeName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.storeAddress = storeAddress;
        }
    }
}
