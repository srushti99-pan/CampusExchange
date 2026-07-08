package com.campusexchange.campus_exchange.entity;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users", 
       uniqueConstraints = { 
           @UniqueConstraint(columnNames = "email")
       })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Email
    @Column(nullable = false)
    private String email;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String college;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false)
    private String branch;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false)
    private String year;

    @NotBlank
    @Size(max = 15)
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles", 
               joinColumns = @JoinColumn(name = "user_id"), 
               inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "wishlists",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "product_id"))
    private Set<Product> wishlist = new HashSet<>();

    public User() {}

    public User(Long id, String email, String password, String name, String college, String branch, String year, String phoneNumber, String profilePictureUrl, Boolean isActive, LocalDateTime createdAt, Set<Role> roles, Set<Product> wishlist) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.college = college;
        this.branch = branch;
        this.year = year;
        this.phoneNumber = phoneNumber;
        this.profilePictureUrl = profilePictureUrl;
        this.isActive = isActive != null ? isActive : true;
        this.createdAt = createdAt;
        this.roles = roles != null ? roles : new HashSet<>();
        this.wishlist = wishlist != null ? wishlist : new HashSet<>();
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    public Set<Product> getWishlist() { return wishlist; }
    public void setWishlist(Set<Product> wishlist) { this.wishlist = wishlist; }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String password;
        private String name;
        private String college;
        private String branch;
        private String year;
        private String phoneNumber;
        private String profilePictureUrl;
        private Boolean isActive = true;
        private LocalDateTime createdAt;
        private Set<Role> roles;
        private Set<Product> wishlist;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder college(String college) { this.college = college; return this; }
        public UserBuilder branch(String branch) { this.branch = branch; return this; }
        public UserBuilder year(String year) { this.year = year; return this; }
        public UserBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public UserBuilder profilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; return this; }
        public UserBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder roles(Set<Role> roles) { this.roles = roles; return this; }
        public UserBuilder wishlist(Set<Product> wishlist) { this.wishlist = wishlist; return this; }

        public User build() {
            return new User(id, email, password, name, college, branch, year, phoneNumber, profilePictureUrl, isActive, createdAt, roles, wishlist);
        }
    }
}
