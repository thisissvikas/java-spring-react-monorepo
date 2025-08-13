-- Create data_products table
CREATE TABLE data_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    portfolio VARCHAR(100) NOT NULL,
    source VARCHAR(255) NOT NULL,
    sensitivity_category VARCHAR(50) NOT NULL CHECK (sensitivity_category IN ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED')),
    data_format VARCHAR(50),
    owner VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    retention_period_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create data_product_tags table for the ElementCollection
CREATE TABLE data_product_tags (
    data_product_id UUID NOT NULL,
    tag VARCHAR(100) NOT NULL,
    FOREIGN KEY (data_product_id) REFERENCES data_products(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_data_products_portfolio ON data_products(portfolio);
CREATE INDEX idx_data_products_sensitivity_category ON data_products(sensitivity_category);
CREATE INDEX idx_data_products_is_active ON data_products(is_active);
CREATE INDEX idx_data_products_created_at ON data_products(created_at);
CREATE INDEX idx_data_product_tags_product_id ON data_product_tags(data_product_id);

-- Insert sample data
INSERT INTO data_products (name, description, portfolio, source, sensitivity_category, data_format, owner, retention_period_days) VALUES
('Customer Analytics Dataset', 'Comprehensive customer behavior analytics data', 'Marketing Analytics', 'CRM System', 'CONFIDENTIAL', 'JSON', 'john.doe@company.com', 365),
('Sales Performance Metrics', 'Monthly and quarterly sales performance data', 'Sales Operations', 'Sales Database', 'INTERNAL', 'CSV', 'jane.smith@company.com', 730),
('Public Demographics Data', 'Publicly available demographic information', 'Research', 'Census API', 'PUBLIC', 'JSON', 'research.team@company.com', 1095);

-- Insert sample tags
INSERT INTO data_product_tags (data_product_id, tag) 
SELECT dp.id, unnest(ARRAY['analytics', 'customer', 'marketing'])
FROM data_products dp WHERE dp.name = 'Customer Analytics Dataset';

INSERT INTO data_product_tags (data_product_id, tag)
SELECT dp.id, unnest(ARRAY['sales', 'performance', 'metrics'])
FROM data_products dp WHERE dp.name = 'Sales Performance Metrics';

INSERT INTO data_product_tags (data_product_id, tag)
SELECT dp.id, unnest(ARRAY['demographics', 'public', 'research'])
FROM data_products dp WHERE dp.name = 'Public Demographics Data';