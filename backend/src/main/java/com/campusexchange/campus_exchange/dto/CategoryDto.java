package com.campusexchange.campus_exchange.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDto {
    private Long id;

    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name must not exceed 50 characters")
    private String name;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    public CategoryDto() {}

    public CategoryDto(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static CategoryDtoBuilder builder() {
        return new CategoryDtoBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static class CategoryDtoBuilder {
        private Long id;
        private String name;
        private String description;

        public CategoryDtoBuilder id(Long id) { this.id = id; return this; }
        public CategoryDtoBuilder name(String name) { this.name = name; return this; }
        public CategoryDtoBuilder description(String description) { this.description = description; return this; }

        public CategoryDto build() {
            return new CategoryDto(id, name, description);
        }
    }
}
