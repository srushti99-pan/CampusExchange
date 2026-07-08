package com.campusexchange.campus_exchange.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 50)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String password;

    @NotBlank(message = "Name is required")
    @Size(max = 50)
    private String name;

    @NotBlank(message = "College is required")
    @Size(max = 100)
    private String college;

    @NotBlank(message = "Branch is required")
    @Size(max = 50)
    private String branch;

    @NotBlank(message = "Year is required")
    @Size(max = 20)
    private String year;

    @NotBlank(message = "Phone number is required")
    @Size(max = 15)
    private String phoneNumber;

    public RegisterRequest() {}

    public RegisterRequest(String email, String password, String name, String college, String branch, String year, String phoneNumber) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.college = college;
        this.branch = branch;
        this.year = year;
        this.phoneNumber = phoneNumber;
    }

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
}
