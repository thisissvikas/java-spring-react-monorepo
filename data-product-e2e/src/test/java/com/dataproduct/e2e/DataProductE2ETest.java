package com.dataproduct.e2e;

import com.dataproduct.e2e.generated.api.DataProductsApi;
import com.dataproduct.e2e.generated.model.*;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("e2e")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class DataProductE2ETest {

    private static DataProductsApi dataProductsApi;
    private static UUID createdDataProductId;

    @BeforeAll
    static void setUp() {
        String baseUrl = System.getProperty("api.base.url", "http://localhost:8080");
        WebClient webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
        
        dataProductsApi = new DataProductsApi();
        // Configure the generated client with WebClient
        // Note: This would need to be configured based on the actual generated client
    }

    @Test
    @Order(1)
    void shouldCreateDataProduct() {
        // Given
        CreateDataProductRequest request = new CreateDataProductRequest();
        request.setName("E2E Test Data Product");
        request.setDescription("End-to-end test data product");
        request.setPortfolio("E2E Portfolio");
        request.setSource("E2E Source");
        request.setSensitivityCategory(SensitivityCategory.INTERNAL);
        request.setDataFormat("JSON");
        request.setOwner("e2e@company.com");
        request.setTags(List.of("e2e", "test"));
        request.setRetentionPeriodDays(90);

        // When
        DataProductResponse response = dataProductsApi.createDataProduct(request).block();

        // Then
        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("E2E Test Data Product", response.getName());
        assertEquals(SensitivityCategory.INTERNAL, response.getSensitivityCategory());
        
        createdDataProductId = UUID.fromString(response.getId());
    }

    @Test
    @Order(2)
    void shouldGetDataProductById() {
        // When
        DataProductResponse response = dataProductsApi.getDataProductById(createdDataProductId.toString()).block();

        // Then
        assertNotNull(response);
        assertEquals(createdDataProductId.toString(), response.getId());
        assertEquals("E2E Test Data Product", response.getName());
    }

    @Test
    @Order(3)
    void shouldGetAllDataProducts() {
        // When
        DataProductPageResponse response = dataProductsApi.getAllDataProducts(0, 20, null, null).block();

        // Then
        assertNotNull(response);
        assertNotNull(response.getContent());
        assertTrue(response.getContent().size() > 0);
        assertTrue(response.getContent().stream()
                .anyMatch(dp -> dp.getName().equals("E2E Test Data Product")));
    }

    @Test
    @Order(4)
    void shouldUpdateDataProduct() {
        // Given
        UpdateDataProductRequest request = new UpdateDataProductRequest();
        request.setName("Updated E2E Test Data Product");
        request.setDescription("Updated end-to-end test data product");
        request.setSensitivityCategory(SensitivityCategory.CONFIDENTIAL);

        // When
        DataProductResponse response = dataProductsApi.updateDataProduct(createdDataProductId.toString(), request).block();

        // Then
        assertNotNull(response);
        assertEquals("Updated E2E Test Data Product", response.getName());
        assertEquals(SensitivityCategory.CONFIDENTIAL, response.getSensitivityCategory());
    }

    @Test
    @Order(5)
    void shouldDeleteDataProduct() {
        // When & Then
        assertDoesNotThrow(() -> {
            dataProductsApi.deleteDataProduct(createdDataProductId.toString()).block();
        });

        // Verify deletion
        assertThrows(Exception.class, () -> {
            dataProductsApi.getDataProductById(createdDataProductId.toString()).block();
        });
    }

    @Test
    void shouldFilterDataProductsByPortfolio() {
        // Given - Create test data with specific portfolio
        CreateDataProductRequest request = new CreateDataProductRequest();
        request.setName("Portfolio Filter Test Product");
        request.setPortfolio("Specific Portfolio");
        request.setSource("Test Source");
        request.setSensitivityCategory(SensitivityCategory.PUBLIC);
        
        DataProductResponse created = dataProductsApi.createDataProduct(request).block();
        assertNotNull(created);

        // When
        DataProductPageResponse response = dataProductsApi.getAllDataProducts(0, 20, "Specific Portfolio", null).block();

        // Then
        assertNotNull(response);
        assertTrue(response.getContent().stream()
                .allMatch(dp -> "Specific Portfolio".equals(dp.getPortfolio())));
    }
}