package com.dataproduct.api.service;

import com.dataproduct.api.entity.DataProduct;
import com.dataproduct.api.repository.DataProductRepository;
import com.dataproduct.commons.exception.DataProductAlreadyExistsException;
import com.dataproduct.commons.exception.DataProductNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataProductServiceTest {

    @Mock
    private DataProductRepository dataProductRepository;

    @InjectMocks
    private DataProductService dataProductService;

    private DataProduct testDataProduct;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testDataProduct = new DataProduct();
        testDataProduct.setId(testId);
        testDataProduct.setName("Test Data Product");
        testDataProduct.setPortfolio("Test Portfolio");
        testDataProduct.setSource("Test Source");
        testDataProduct.setSensitivityCategory(DataProduct.SensitivityCategory.INTERNAL);
        testDataProduct.setIsActive(true);
    }

    @Test
    void getAllDataProducts_ShouldReturnPagedResults() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<DataProduct> mockPage = new PageImpl<>(List.of(testDataProduct), pageable, 1);
        when(dataProductRepository.findWithFilters(null, null, pageable)).thenReturn(mockPage);

        // When
        Page<DataProduct> result = dataProductService.getAllDataProducts(null, null, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testDataProduct.getName(), result.getContent().get(0).getName());
        verify(dataProductRepository).findWithFilters(null, null, pageable);
    }

    @Test
    void getDataProductById_ShouldReturnDataProduct_WhenExists() {
        // Given
        when(dataProductRepository.findById(testId)).thenReturn(Optional.of(testDataProduct));

        // When
        DataProduct result = dataProductService.getDataProductById(testId);

        // Then
        assertNotNull(result);
        assertEquals(testDataProduct.getName(), result.getName());
        verify(dataProductRepository).findById(testId);
    }

    @Test
    void getDataProductById_ShouldThrowException_WhenNotExists() {
        // Given
        when(dataProductRepository.findById(testId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(DataProductNotFoundException.class, 
            () -> dataProductService.getDataProductById(testId));
        verify(dataProductRepository).findById(testId);
    }

    @Test
    void createDataProduct_ShouldSaveAndReturnDataProduct_WhenValid() {
        // Given
        when(dataProductRepository.existsByName(testDataProduct.getName())).thenReturn(false);
        when(dataProductRepository.save(any(DataProduct.class))).thenReturn(testDataProduct);

        // When
        DataProduct result = dataProductService.createDataProduct(testDataProduct);

        // Then
        assertNotNull(result);
        assertEquals(testDataProduct.getName(), result.getName());
        verify(dataProductRepository).existsByName(testDataProduct.getName());
        verify(dataProductRepository).save(testDataProduct);
    }

    @Test
    void createDataProduct_ShouldThrowException_WhenNameAlreadyExists() {
        // Given
        when(dataProductRepository.existsByName(testDataProduct.getName())).thenReturn(true);

        // When & Then
        assertThrows(DataProductAlreadyExistsException.class, 
            () -> dataProductService.createDataProduct(testDataProduct));
        verify(dataProductRepository).existsByName(testDataProduct.getName());
        verify(dataProductRepository, never()).save(any());
    }

    @Test
    void updateDataProduct_ShouldUpdateAndReturnDataProduct_WhenValid() {
        // Given
        DataProduct updateRequest = new DataProduct();
        updateRequest.setName("Updated Name");
        updateRequest.setDescription("Updated Description");
        
        when(dataProductRepository.findById(testId)).thenReturn(Optional.of(testDataProduct));
        when(dataProductRepository.existsByName("Updated Name")).thenReturn(false);
        when(dataProductRepository.save(any(DataProduct.class))).thenReturn(testDataProduct);

        // When
        DataProduct result = dataProductService.updateDataProduct(testId, updateRequest);

        // Then
        assertNotNull(result);
        verify(dataProductRepository).findById(testId);
        verify(dataProductRepository).save(any(DataProduct.class));
    }

    @Test
    void deleteDataProduct_ShouldDeleteDataProduct_WhenExists() {
        // Given
        when(dataProductRepository.existsById(testId)).thenReturn(true);

        // When
        dataProductService.deleteDataProduct(testId);

        // Then
        verify(dataProductRepository).existsById(testId);
        verify(dataProductRepository).deleteById(testId);
    }

    @Test
    void deleteDataProduct_ShouldThrowException_WhenNotExists() {
        // Given
        when(dataProductRepository.existsById(testId)).thenReturn(false);

        // When & Then
        assertThrows(DataProductNotFoundException.class, 
            () -> dataProductService.deleteDataProduct(testId));
        verify(dataProductRepository).existsById(testId);
        verify(dataProductRepository, never()).deleteById(any());
    }
}