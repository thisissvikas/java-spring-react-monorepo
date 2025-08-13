package com.dataproduct.api.integration;

import com.dataproduct.api.entity.DataProduct;
import com.dataproduct.api.repository.DataProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class DataProductIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DataProductRepository dataProductRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private DataProduct testDataProduct;

    @BeforeEach
    void setUp() {
        dataProductRepository.deleteAll();
        
        testDataProduct = new DataProduct();
        testDataProduct.setName("Integration Test Product");
        testDataProduct.setDescription("Test description");
        testDataProduct.setPortfolio("Test Portfolio");
        testDataProduct.setSource("Test Source");
        testDataProduct.setSensitivityCategory(DataProduct.SensitivityCategory.INTERNAL);
        testDataProduct.setDataFormat("JSON");
        testDataProduct.setOwner("test@company.com");
        testDataProduct.setTags(List.of("test", "integration"));
        testDataProduct.setRetentionPeriodDays(365);
        
        testDataProduct = dataProductRepository.save(testDataProduct);
    }

    @Test
    void getAllDataProducts_ShouldReturnPagedResults() throws Exception {
        mockMvc.perform(get("/api/v1/data-products")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("Integration Test Product")))
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.page", is(0)))
                .andExpect(jsonPath("$.size", is(10)));
    }

    @Test
    void getDataProductById_ShouldReturnDataProduct_WhenExists() throws Exception {
        mockMvc.perform(get("/api/v1/data-products/{id}", testDataProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(testDataProduct.getId().toString())))
                .andExpect(jsonPath("$.name", is("Integration Test Product")))
                .andExpect(jsonPath("$.portfolio", is("Test Portfolio")));
    }

    @Test
    void getDataProductById_ShouldReturn404_WhenNotExists() throws Exception {
        UUID nonExistentId = UUID.randomUUID();
        
        mockMvc.perform(get("/api/v1/data-products/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", containsString("Data product not found")));
    }

    @Test
    void createDataProduct_ShouldCreateAndReturnDataProduct_WhenValid() throws Exception {
        String createRequest = """
            {
                "name": "New Data Product",
                "description": "New test description",
                "portfolio": "New Portfolio",
                "source": "New Source",
                "sensitivityCategory": "CONFIDENTIAL",
                "dataFormat": "CSV",
                "owner": "newowner@company.com",
                "tags": ["new", "test"],
                "retentionPeriodDays": 180
            }
            """;

        mockMvc.perform(post("/api/v1/data-products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createRequest))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("New Data Product")))
                .andExpect(jsonPath("$.sensitivityCategory", is("CONFIDENTIAL")))
                .andExpected(jsonPath("$.id", notNullValue()));
    }

    @Test
    void createDataProduct_ShouldReturn409_WhenNameAlreadyExists() throws Exception {
        String createRequest = """
            {
                "name": "Integration Test Product",
                "portfolio": "Test Portfolio",
                "source": "Test Source",
                "sensitivityCategory": "INTERNAL"
            }
            """;

        mockMvc.perform(post("/api/v1/data-products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createRequest))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    void updateDataProduct_ShouldUpdateAndReturnDataProduct_WhenValid() throws Exception {
        String updateRequest = """
            {
                "name": "Updated Integration Test Product",
                "description": "Updated description",
                "sensitivityCategory": "CONFIDENTIAL"
            }
            """;

        mockMvc.perform(put("/api/v1/data-products/{id}", testDataProduct.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateRequest))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Updated Integration Test Product")))
                .andExpected(jsonPath("$.sensitivityCategory", is("CONFIDENTIAL")));
    }

    @Test
    void deleteDataProduct_ShouldDeleteDataProduct_WhenExists() throws Exception {
        mockMvc.perform(delete("/api/v1/data-products/{id}", testDataProduct.getId()))
                .andExpect(status().isNoContent());

        // Verify deletion
        assertFalse(dataProductRepository.existsById(testDataProduct.getId()));
    }

    @Test
    void deleteDataProduct_ShouldReturn404_WhenNotExists() throws Exception {
        UUID nonExistentId = UUID.randomUUID();
        
        mockMvc.perform(delete("/api/v1/data-products/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("Data product not found")));
    }
}