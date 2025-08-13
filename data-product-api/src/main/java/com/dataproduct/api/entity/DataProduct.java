package com.dataproduct.api.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "data_products", uniqueConstraints = {
    @UniqueConstraint(columnNames = "name")
})
@EntityListeners(AuditingEntityListener.class)
public class DataProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String portfolio;

    @Column(nullable = false)
    private String source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SensitivityCategory sensitivityCategory;

    private String dataFormat;

    private String owner;

    @ElementCollection
    @CollectionTable(name = "data_product_tags", joinColumns = @JoinColumn(name = "data_product_id"))
    @Column(name = "tag")
    private List<String> tags;

    @Column(nullable = false)
    private Boolean isActive = true;

    private Integer retentionPeriodDays;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public DataProduct() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public SensitivityCategory getSensitivityCategory() { return sensitivityCategory; }
    public void setSensitivityCategory(SensitivityCategory sensitivityCategory) { this.sensitivityCategory = sensitivityCategory; }

    public String getDataFormat() { return dataFormat; }
    public void setDataFormat(String dataFormat) { this.dataFormat = dataFormat; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getRetentionPeriodDays() { return retentionPeriodDays; }
    public void setRetentionPeriodDays(Integer retentionPeriodDays) { this.retentionPeriodDays = retentionPeriodDays; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum SensitivityCategory {
        PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
    }
}