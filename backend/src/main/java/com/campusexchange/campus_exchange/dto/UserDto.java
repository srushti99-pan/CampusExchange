package com.campusexchange.campus_exchange.dto;

import java.util.Set;

public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String college;
    private String branch;
    private String year;
    private String phoneNumber;
    private String profilePictureUrl;
    private Boolean isActive;
    private Set<String> roles;

    public UserDto() {}

    public UserDto(Long id, String email, String name, String college, String branch, String year, String phoneNumber, String profilePictureUrl, Boolean isActive, Set<String> roles) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.college = college;
        this.branch = branch;
        this.year = year;
        this.phoneNumber = phoneNumber;
        this.profilePictureUrl = profilePictureUrl;
        this.isActive = isActive;
        this.roles = roles;
    }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public static class UserDtoBuilder {
        private Long id;
        private String email;
        private String name;
        private String college;
        private String branch;
        private String year;
        private String phoneNumber;
        private String profilePictureUrl;
        private Boolean isActive;
        private Set<String> roles;

        public UserDtoBuilder id(Long id) { this.id = id; return this; }
        public UserDtoBuilder email(String email) { this.email = email; return this; }
        public UserDtoBuilder name(String name) { this.name = name; return this; }
        public UserDtoBuilder college(String college) { this.college = college; return this; }
        public UserDtoBuilder branch(String branch) { this.branch = branch; return this; }
        public UserDtoBuilder year(String year) { this.year = year; return this; }
        public UserDtoBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public UserDtoBuilder profilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; return this; }
        public UserDtoBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public UserDtoBuilder roles(Set<String> roles) { this.roles = roles; return this; }

        public UserDto build() {
            return new UserDto(id, email, name, college, branch, year, phoneNumber, profilePictureUrl, isActive, roles);
        }
    }
}
