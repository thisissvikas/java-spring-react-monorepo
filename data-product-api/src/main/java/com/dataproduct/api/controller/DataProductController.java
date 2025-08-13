package com.dataproduct.api.controller;

import com.dataproduct.api.entity.DataProduct;
import com.dataproduct.api.generated.DataProductsApi;
import com.dataproduct.api.generated.model.*;
import com.dataproduct.api.mapper.DataProductMapper;
import com.dataproduct.api.service.DataProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class DataProductController implements DataProductsApi {

    private final DataProductService dataProductService;
    private final DataProductMapper dataProductMapper;

    @Autowired
    public DataProductController(DataProductService dataProductService, DataProductMapper dataProductMapper) {
        this.dataProductService = dataProductService;
        this.dataProductMapper = dataProductMapper;
    }

    @Override
    public ResponseEntity<DataProductPageResponse> getAllDataProducts(
            Integer page, Integer size, String portfolio, SensitivityCategory sensitivityCategory) {
        
        Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 20);
        DataProduct.SensitivityCategory entitySensitivity = sensitivityCategory != null ? 
            DataProduct.SensitivityCategory.valueOf(sensitivityCategory.name()) : null;
        
        Page<DataProduct> dataProducts = dataProductService.getAllDataProducts(portfolio, entitySensitivity, pageable);
        DataProductPageResponse response = dataProductMapper.toPageResponse(dataProducts);
        
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<DataProductResponse> getDataProductById(String id) {
        UUID uuid = UUID.fromString(id);
        DataProduct dataProduct = dataProductService.getDataProductById(uuid);
        DataProductResponse response = dataProductMapper.toResponse(dataProduct);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<DataProductResponse> createDataProduct(CreateDataProductRequest request) {
        DataProduct dataProduct = dataProductMapper.toEntity(request);
        DataProduct savedDataProduct = dataProductService.createDataProduct(dataProduct);
        DataProductResponse response = dataProductMapper.toResponse(savedDataProduct);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<DataProductResponse> updateDataProduct(String id, UpdateDataProductRequest request) {
        UUID uuid = UUID.fromString(id);
        DataProduct updateData = dataProductMapper.toEntity(request);
        DataProduct updatedDataProduct = dataProductService.updateDataProduct(uuid, updateData);
        DataProductResponse response = dataProductMapper.toResponse(updatedDataProduct);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deleteDataProduct(String id) {
        UUID uuid = UUID.fromString(id);
        dataProductService.deleteDataProduct(uuid);
        return ResponseEntity.noContent().build();
    }
}