package com.dataproduct.api.controller;

import com.dataproduct.api.generated.HealthApi;
import com.dataproduct.api.generated.model.HealthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.OffsetDateTime;

@RestController
public class HealthController implements HealthApi {

    private final DataSource dataSource;
    private final BuildProperties buildProperties;

    @Autowired
    public HealthController(DataSource dataSource, BuildProperties buildProperties) {
        this.dataSource = dataSource;
        this.buildProperties = buildProperties;
    }

    @Override
    public ResponseEntity<HealthResponse> healthCheck() {
        HealthResponse response = new HealthResponse();
        response.setStatus(HealthResponse.StatusEnum.UP);
        response.setTimestamp(OffsetDateTime.now());
        response.setVersion(buildProperties.getVersion());
        
        // Check database connectivity
        try (Connection connection = dataSource.getConnection()) {
            response.setDatabase(HealthResponse.DatabaseEnum.UP);
        } catch (Exception e) {
            response.setDatabase(HealthResponse.DatabaseEnum.DOWN);
            response.setStatus(HealthResponse.StatusEnum.DOWN);
        }
        
        return ResponseEntity.ok(response);
    }
}