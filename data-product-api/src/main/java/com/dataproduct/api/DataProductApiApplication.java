package com.dataproduct.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.dataproduct")
@EntityScan(basePackages = "com.dataproduct")
@EnableJpaRepositories(basePackages = "com.dataproduct")
public class DataProductApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(DataProductApiApplication.class, args);
    }
}