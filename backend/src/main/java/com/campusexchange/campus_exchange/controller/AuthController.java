package com.campusexchange.campus_exchange.controller;

import com.campusexchange.campus_exchange.dto.JwtResponse;
import com.campusexchange.campus_exchange.dto.LoginRequest;
import com.campusexchange.campus_exchange.dto.RegisterRequest;
import com.campusexchange.campus_exchange.entity.User;
import com.campusexchange.campus_exchange.security.JwtUtils;
import com.campusexchange.campus_exchange.security.UserDetailsImpl;
import com.campusexchange.campus_exchange.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        User user = userService.registerUser(signUpRequest);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        response.put("userId", user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .name(userDetails.getName())
                .college(userDetails.getCollege())
                .roles(roles)
                .build());
    }
}
