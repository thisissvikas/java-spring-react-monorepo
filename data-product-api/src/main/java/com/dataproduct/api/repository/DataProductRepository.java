package com.dataproduct.api.repository;

import com.dataproduct.api.entity.DataProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DataProductRepository extends JpaRepository<DataProduct, UUID> {

    Optional<DataProduct> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT dp FROM DataProduct dp WHERE " +
           "(:portfolio IS NULL OR dp.portfolio = :portfolio) AND " +
           "(:sensitivityCategory IS NULL OR dp.sensitivityCategory = :sensitivityCategory)")
    Page<DataProduct> findWithFilters(
        @Param("portfolio") String portfolio,
        @Param("sensitivityCategory") DataProduct.SensitivityCategory sensitivityCategory,
        Pageable pageable
    );

    Page<DataProduct> findByIsActiveTrue(Pageable pageable);
}