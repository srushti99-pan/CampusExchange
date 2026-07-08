package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.ProductResponseDto;
import com.campusexchange.campus_exchange.dto.RegisterRequest;
import com.campusexchange.campus_exchange.dto.UserDto;
import com.campusexchange.campus_exchange.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    User registerUser(RegisterRequest signUpRequest);
    UserDto getUserProfile(String email);
    UserDto updateUserProfile(String email, UserDto userDto);
    UserDto uploadProfilePicture(String email, MultipartFile file);
    void toggleWishlist(String email, Long productId);
    List<ProductResponseDto> getWishlist(String email);
    List<UserDto> getAllUsers();
    void toggleUserStatus(Long userId, Boolean isActive);
    User findByEmailEntity(String email);
}
