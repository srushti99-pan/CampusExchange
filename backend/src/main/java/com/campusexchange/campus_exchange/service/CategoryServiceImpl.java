package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.CategoryDto;
import com.campusexchange.campus_exchange.entity.Category;
import com.campusexchange.campus_exchange.exception.BadRequestException;
import com.campusexchange.campus_exchange.exception.ResourceNotFoundException;
import com.campusexchange.campus_exchange.repository.CategoryRepository;
import com.campusexchange.campus_exchange.utils.DtoConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(DtoConverter::convertToCategoryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return DtoConverter.convertToCategoryDto(category);
    }

    @Override
    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto) {
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new BadRequestException("Category with name '" + categoryDto.getName() + "' already exists.");
        }
        Category category = Category.builder()
                .name(categoryDto.getName())
                .description(categoryDto.getDescription())
                .build();
        Category saved = categoryRepository.save(category);
        return DtoConverter.convertToCategoryDto(saved);
    }

    @Override
    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Check if name is changing and already exists
        if (!category.getName().equals(categoryDto.getName()) && categoryRepository.existsByName(categoryDto.getName())) {
            throw new BadRequestException("Category with name '" + categoryDto.getName() + "' already exists.");
        }

        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        Category updated = categoryRepository.save(category);
        return DtoConverter.convertToCategoryDto(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }
}
