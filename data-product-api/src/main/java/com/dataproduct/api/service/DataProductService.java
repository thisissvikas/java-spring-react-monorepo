package com.dataproduct.api.service;

import com.dataproduct.api.entity.DataProduct;
import com.dataproduct.api.repository.DataProductRepository;
import com.dataproduct.commons.exception.DataProductAlreadyExistsException;
import com.dataproduct.commons.exception.DataProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class DataProductService {

    private final DataProductRepository dataProductRepository;

    @Autowired
    public DataProductService(DataProductRepository dataProductRepository) {
        this.dataProductRepository = dataProductRepository;
    }

    @Transactional(readOnly = true)
    public Page<DataProduct> getAllDataProducts(
            String portfolio, 
            DataProduct.SensitivityCategory sensitivityCategory, 
            Pageable pageable) {
        return dataProductRepository.findWithFilters(portfolio, sensitivityCategory, pageable);
    }

    @Transactional(readOnly = true)
    public DataProduct getDataProductById(UUID id) {
        return dataProductRepository.findById(id)
                .orElseThrow(() -> new DataProductNotFoundException("Data product not found with id: " + id));
    }

    public DataProduct createDataProduct(DataProduct dataProduct) {
        if (dataProductRepository.existsByName(dataProduct.getName())) {
            throw new DataProductAlreadyExistsException("Data product already exists with name: " + dataProduct.getName());
        }
        return dataProductRepository.save(dataProduct);
    }

    public DataProduct updateDataProduct(UUID id, DataProduct updateRequest) {
        DataProduct existingDataProduct = getDataProductById(id);
        
        // Check if name is being changed and if new name already exists
        if (updateRequest.getName() != null && 
            !updateRequest.getName().equals(existingDataProduct.getName()) &&
            dataProductRepository.existsByName(updateRequest.getName())) {
            throw new DataProductAlreadyExistsException("Data product already exists with name: " + updateRequest.getName());
        }

        // Update fields
        if (updateRequest.getName() != null) {
            existingDataProduct.setName(updateRequest.getName());
        }
        if (updateRequest.getDescription() != null) {
            existingDataProduct.setDescription(updateRequest.getDescription());
        }
        if (updateRequest.getPortfolio() != null) {
            existingDataProduct.setPortfolio(updateRequest.getPortfolio());
        }
        if (updateRequest.getSource() != null) {
            existingDataProduct.setSource(updateRequest.getSource());
        }
        if (updateRequest.getSensitivityCategory() != null) {
            existingDataProduct.setSensitivityCategory(updateRequest.getSensitivityCategory());
        }
        if (updateRequest.getDataFormat() != null) {
            existingDataProduct.setDataFormat(updateRequest.getDataFormat());
        }
        if (updateRequest.getOwner() != null) {
            existingDataProduct.setOwner(updateRequest.getOwner());
        }
        if (updateRequest.getTags() != null) {
            existingDataProduct.setTags(updateRequest.getTags());
        }
        if (updateRequest.getIsActive() != null) {
            existingDataProduct.setIsActive(updateRequest.getIsActive());
        }
        if (updateRequest.getRetentionPeriodDays() != null) {
            existingDataProduct.setRetentionPeriodDays(updateRequest.getRetentionPeriodDays());
        }

        return dataProductRepository.save(existingDataProduct);
    }

    public void deleteDataProduct(UUID id) {
        if (!dataProductRepository.existsById(id)) {
            throw new DataProductNotFoundException("Data product not found with id: " + id);
        }
        dataProductRepository.deleteById(id);
    }
}