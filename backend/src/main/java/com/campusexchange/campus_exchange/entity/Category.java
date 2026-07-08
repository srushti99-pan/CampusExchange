package com.campusexchange.campus_exchange.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "categories", 
       uniqueConstraints = { 
           @UniqueConstraint(columnNames = "name")
       })
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false)
    private String name;

    @Size(max = 255)
    private String description;

    public Category() {}

    public Category(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static CategoryBuilder builder() {
        return new CategoryBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static class CategoryBuilder {
        private Long id;
        private String name;
        private String description;

        public CategoryBuilder id(Long id) { this.id = id; return this; }
        public CategoryBuilder name(String name) { this.name = name; return this; }
        public CategoryBuilder description(String description) { this.description = description; return this; }

        public Category build() {
            return new Category(id, name, description);
        }
    }
}
