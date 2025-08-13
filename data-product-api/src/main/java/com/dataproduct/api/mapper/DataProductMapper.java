package com.dataproduct.api.mapper;

import com.dataproduct.api.entity.DataProduct;
import com.dataproduct.api.generated.model.*;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DataProductMapper {

    public DataProductResponse toResponse(DataProduct entity) {
        DataProductResponse response = new DataProductResponse();
        response.setId(entity.getId().toString());
        response.setName(entity.getName());
        response.setDescription(entity.getDescription());
        response.setPortfolio(entity.getPortfolio());
        response.setSource(entity.getSource());
        response.setSensitivityCategory(SensitivityCategory.valueOf(entity.getSensitivityCategory().name()));
        response.setDataFormat(entity.getDataFormat());
        response.setOwner(entity.getOwner());
        response.setTags(entity.getTags());
        response.setIsActive(entity.getIsActive());
        response.setRetentionPeriodDays(entity.getRetentionPeriodDays());
        response.setCreatedAt(entity.getCreatedAt().atOffset(ZoneOffset.UTC));
        response.setUpdatedAt(entity.getUpdatedAt().atOffset(ZoneOffset.UTC));
        return response;
    }

    public DataProduct toEntity(CreateDataProductRequest request) {
        DataProduct entity = new DataProduct();
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setPortfolio(request.getPortfolio());
        entity.setSource(request.getSource());
        entity.setSensitivityCategory(DataProduct.SensitivityCategory.valueOf(request.getSensitivityCategory().name()));
        entity.setDataFormat(request.getDataFormat());
        entity.setOwner(request.getOwner());
        entity.setTags(request.getTags());
        entity.setRetentionPeriodDays(request.getRetentionPeriodDays());
        return entity;
    }

    public DataProduct toEntity(UpdateDataProductRequest request) {
        DataProduct entity = new DataProduct();
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setPortfolio(request.getPortfolio());
        entity.setSource(request.getSource());
        if (request.getSensitivityCategory() != null) {
            entity.setSensitivityCategory(DataProduct.SensitivityCategory.valueOf(request.getSensitivityCategory().name()));
        }
        entity.setDataFormat(request.getDataFormat());
        entity.setOwner(request.getOwner());
        entity.setTags(request.getTags());
        entity.setIsActive(request.getIsActive());
        entity.setRetentionPeriodDays(request.getRetentionPeriodDays());
        return entity;
    }

    public DataProductPageResponse toPageResponse(Page<DataProduct> page) {
        DataProductPageResponse response = new DataProductPageResponse();
        
        List<DataProductResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        
        response.setContent(content);
        response.setPage(page.getNumber());
        response.setSize(page.getSize());
        response.setTotalElements((int) page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        
        return response;
    }
}