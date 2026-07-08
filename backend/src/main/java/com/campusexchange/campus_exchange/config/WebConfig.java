package com.campusexchange.campus_exchange.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Expose uploaded files statically
        String path = new File(uploadDir).getAbsolutePath();
        // Standardize path separator for Windows file protocol URLs
        path = path.replace("\\", "/");
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + path + "/");
    }
}
