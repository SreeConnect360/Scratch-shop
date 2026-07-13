package com.reevibes.ai.controller;

import com.reevibes.ai.model.User;
import com.reevibes.ai.model.EmailOtp;
import com.reevibes.ai.repository.UserRepository;
import com.reevibes.ai.repository.EmailOtpRepository;
import com.reevibes.ai.service.EmailService;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://reevibes.com"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailOtpRepository emailOtpRepository;

    @Autowired
    private EmailService emailService;

    private final SecureRandom random = new SecureRandom();

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String type = request.get("type"); // "SIGNUP" or "FORGOT_PASSWORD"

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        email = email.trim().toLowerCase();

        // For forgot password, verify user exists
        if ("FORGOT_PASSWORD".equalsIgnoreCase(type)) {
            if (!userRepository.existsByEmail(email)) {
                return ResponseEntity.status(404).body(Map.of("message", "Email address is not registered"));
            }
        } else {
            // For sign up, check if email already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.status(400).body(Map.of("message", "Email is already registered"));
            }
        }

        // Rate limiting: check if OTP was requested recently (less than 30 seconds ago)
        Optional<EmailOtp> existingOtpOpt = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email);
        if (existingOtpOpt.isPresent()) {
            EmailOtp existingOtp = existingOtpOpt.get();
            if (existingOtp.getCreatedAt().plusSeconds(30).isAfter(LocalDateTime.now())) {
                return ResponseEntity.status(429).body(Map.of("message", "Please wait 30 seconds before requesting another OTP"));
            }
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        // Delete older OTP records for this email
        emailOtpRepository.deleteByEmail(email);

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setOtp(otp);
        emailOtp.setExpiresAt(expiresAt);
        emailOtp.setAttempts(0);
        emailOtp.setCreatedAt(LocalDateTime.now());

        emailOtpRepository.save(emailOtp);

        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send verification email"));
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null || email.trim().isEmpty() || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required"));
        }
        email = email.trim().toLowerCase();
        otp = otp.trim();

        Optional<EmailOtp> emailOtpOpt = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email);
        if (emailOtpOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "No active OTP request found for this email"));
        }

        EmailOtp emailOtp = emailOtpOpt.get();

        // Expiration check (5 mins)
        if (emailOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            emailOtpRepository.delete(emailOtp);
            return ResponseEntity.status(400).body(Map.of("message", "OTP has expired. Please request a new one."));
        }

        // Attempts check (max 5)
        if (emailOtp.getAttempts() >= 5) {
            emailOtpRepository.delete(emailOtp);
            return ResponseEntity.status(403).body(Map.of("message", "Too many failed attempts. Please request a new OTP."));
        }

        // OTP verification
        if (!emailOtp.getOtp().equals(otp)) {
            emailOtp.setAttempts(emailOtp.getAttempts() + 1);
            emailOtpRepository.save(emailOtp);
            return ResponseEntity.status(400).body(Map.of("message", "Invalid OTP. Attempts remaining: " + (5 - emailOtp.getAttempts())));
        }

        // Cleanup OTP on success
        emailOtpRepository.delete(emailOtp);

        return ResponseEntity.ok(Map.of("message", "OTP verified successfully", "email", email));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        if (name == null || email == null || password == null || name.trim().isEmpty() || email.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required"));
        }
        email = email.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(400).body(Map.of("message", "Email is already registered"));
        }

        String passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        try {
            emailService.sendWelcomeEmail(email, name);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(Map.of("message", "Account registered successfully", "user", Map.of("name", user.getName(), "email", user.getEmail())));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }
        email = email.trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        User user = userOpt.get();

        if (!BCrypt.checkpw(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        return ResponseEntity.ok(Map.of(
            "message", "Sign in successful",
            "user", Map.of(
                "id", user.getId().toString(),
                "name", user.getName(),
                "email", user.getEmail()
            )
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        email = email.trim().toLowerCase();

        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.status(404).body(Map.of("message", "Email address is not registered"));
        }

        String otp = String.format("%06d", random.nextInt(1000000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        emailOtpRepository.deleteByEmail(email);

        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setOtp(otp);
        emailOtp.setExpiresAt(expiresAt);
        emailOtp.setAttempts(0);
        emailOtp.setCreatedAt(LocalDateTime.now());

        emailOtpRepository.save(emailOtp);

        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send reset email"));
        }

        return ResponseEntity.ok(Map.of("message", "Reset OTP sent successfully"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String confirmPassword = request.get("confirmPassword");

        if (email == null || password == null || confirmPassword == null ||
            email.trim().isEmpty() || password.trim().isEmpty() || confirmPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required"));
        }
        email = email.trim().toLowerCase();

        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Passwords do not match"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        user.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
