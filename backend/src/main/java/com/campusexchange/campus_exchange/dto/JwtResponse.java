package com.campusexchange.campus_exchange.dto;

import java.util.List;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String name;
    private String college;
    private List<String> roles;

    public JwtResponse() {}

    public JwtResponse(String token, String type, Long id, String email, String name, String college, List<String> roles) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.id = id;
        this.email = email;
        this.name = name;
        this.college = college;
        this.roles = roles;
    }

    public static JwtResponseBuilder builder() {
        return new JwtResponseBuilder();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public static class JwtResponseBuilder {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private String name;
        private String college;
        private List<String> roles;

        public JwtResponseBuilder token(String token) { this.token = token; return this; }
        public JwtResponseBuilder type(String type) { this.type = type; return this; }
        public JwtResponseBuilder id(Long id) { this.id = id; return this; }
        public JwtResponseBuilder email(String email) { this.email = email; return this; }
        public JwtResponseBuilder name(String name) { this.name = name; return this; }
        public JwtResponseBuilder college(String college) { this.college = college; return this; }
        public JwtResponseBuilder roles(List<String> roles) { this.roles = roles; return this; }

        public JwtResponse build() {
            return new JwtResponse(token, type, id, email, name, college, roles);
        }
    }
}
