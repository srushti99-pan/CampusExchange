package com.campusexchange.campus_exchange.config;

import com.campusexchange.campus_exchange.entity.Category;
import com.campusexchange.campus_exchange.entity.ERole;
import com.campusexchange.campus_exchange.entity.Role;
import com.campusexchange.campus_exchange.entity.User;
import com.campusexchange.campus_exchange.repository.CategoryRepository;
import com.campusexchange.campus_exchange.repository.RoleRepository;
import com.campusexchange.campus_exchange.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(RoleRepository roleRepository, CategoryRepository categoryRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles
        if (roleRepository.count() == 0) {
            roleRepository.save(Role.builder().name(ERole.ROLE_STUDENT).build());
            roleRepository.save(Role.builder().name(ERole.ROLE_ADMIN).build());
        }

        // Seed Categories
        if (categoryRepository.count() == 0) {
            List<String> categories = List.of(
                    "Books", "Electronics", "Furniture", "Hostel Items",
                    "Calculators", "Lab Equipment", "Cycles", "Stationery",
                    "Notes", "Project Components", "Miscellaneous"
            );
            for (String categoryName : categories) {
                categoryRepository.save(Category.builder()
                        .name(categoryName)
                        .description("Second-hand " + categoryName.toLowerCase() + " for campus students.")
                        .build());
            }
        }

        // Seed Default Users
        if (userRepository.count() == 0) {
            Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                    .orElseThrow(() -> new RuntimeException("Role ROLE_STUDENT not found."));
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Role ROLE_ADMIN not found."));

            // Admin User (Has both Admin and Student powers)
            User admin = User.builder()
                    .name("Exchange Admin")
                    .email("admin@campusexchange.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .college("Campus Tech")
                    .branch("Administration")
                    .year("Staff")
                    .phoneNumber("9876543210")
                    .isActive(true)
                    .roles(Set.of(studentRole, adminRole))
                    .build();
            userRepository.save(admin);

            // Student User
            User student = User.builder()
                    .name("Rahul Sharma")
                    .email("student@campusexchange.com")
                    .password(passwordEncoder.encode("Student@123"))
                    .college("IIT Delhi")
                    .branch("Computer Science")
                    .year("3rd Year")
                    .phoneNumber("9876543211")
                    .isActive(true)
                    .roles(Set.of(studentRole))
                    .build();
            userRepository.save(student);
        }
    }
}
