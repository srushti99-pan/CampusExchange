package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.ProductResponseDto;
import com.campusexchange.campus_exchange.dto.RegisterRequest;
import com.campusexchange.campus_exchange.dto.UserDto;
import com.campusexchange.campus_exchange.entity.ERole;
import com.campusexchange.campus_exchange.entity.Product;
import com.campusexchange.campus_exchange.entity.Role;
import com.campusexchange.campus_exchange.entity.User;
import com.campusexchange.campus_exchange.exception.BadRequestException;
import com.campusexchange.campus_exchange.exception.ResourceNotFoundException;
import com.campusexchange.campus_exchange.repository.ProductRepository;
import com.campusexchange.campus_exchange.repository.RoleRepository;
import com.campusexchange.campus_exchange.repository.UserRepository;
import com.campusexchange.campus_exchange.utils.DtoConverter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, ProductRepository productRepository, PasswordEncoder passwordEncoder, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public User registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .college(signUpRequest.getCollege())
                .branch(signUpRequest.getBranch())
                .year(signUpRequest.getYear())
                .phoneNumber(signUpRequest.getPhoneNumber())
                .isActive(true)
                .build();

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_STUDENT not found."));
        roles.add(userRole);

        user.setRoles(roles);
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserProfile(String email) {
        User user = findByEmailEntity(email);
        return DtoConverter.convertToUserDto(user);
    }

    @Override
    @Transactional
    public UserDto updateUserProfile(String email, UserDto userDto) {
        User user = findByEmailEntity(email);
        user.setName(userDto.getName());
        user.setCollege(userDto.getCollege());
        user.setBranch(userDto.getBranch());
        user.setYear(userDto.getYear());
        user.setPhoneNumber(userDto.getPhoneNumber());
        
        User updatedUser = userRepository.save(user);
        return DtoConverter.convertToUserDto(updatedUser);
    }

    @Override
    @Transactional
    public UserDto uploadProfilePicture(String email, MultipartFile file) {
        User user = findByEmailEntity(email);
        String relativePath = fileStorageService.storeFile(file);
        user.setProfilePictureUrl(relativePath);
        User updatedUser = userRepository.save(user);
        return DtoConverter.convertToUserDto(updatedUser);
    }

    @Override
    @Transactional
    public void toggleWishlist(String email, Long productId) {
        User user = findByEmailEntity(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (user.getWishlist().contains(product)) {
            user.getWishlist().remove(product);
        } else {
            user.getWishlist().add(product);
        }
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getWishlist(String email) {
        User user = findByEmailEntity(email);
        return user.getWishlist().stream()
                .map(DtoConverter::convertToProductResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(DtoConverter::convertToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long userId, Boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByEmailEntity(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
