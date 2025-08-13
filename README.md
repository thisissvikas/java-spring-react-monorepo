# Data Product Management System

A comprehensive monorepo for managing data products with a Spring Boot backend, React frontend, and end-to-end testing.

## Project Structure

```
├── build.gradle                    # Root build configuration
├── settings.gradle                 # Project settings and subprojects
├── gradle/                         # Gradle wrapper and configurations
├── openapi/
│   └── data-product-api.yaml      # OpenAPI specification
├── commons/                        # Shared configurations and utilities
├── data-product-api/              # Spring Boot backend
├── data-product-ui/               # React frontend
├── data-product-e2e/              # End-to-end tests
└── .github/workflows/             # CI/CD pipelines
```

## Prerequisites

- Java 21 (LTS)
- Node.js 20+ (LTS)
- PostgreSQL 15+
- Docker (optional, for containerized database)

## Local Development Setup

### 1. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL and create database
createdb dataproduct_db
createuser dataproduct_user
psql -c "ALTER USER dataproduct_user WITH PASSWORD 'password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE dataproduct_db TO dataproduct_user;"
```

#### Option B: Docker PostgreSQL
```bash
docker run --name postgres-dp \
  -e POSTGRES_DB=dataproduct_db \
  -e POSTGRES_USER=dataproduct_user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Build and Run

#### Build all projects
```bash
./gradlew build
```

#### Run backend API
```bash
./gradlew :data-product-api:bootRun
```

#### Run frontend (in separate terminal)
```bash
cd data-product-ui
npm install
npm start
```

#### Run end-to-end tests
```bash
./gradlew :data-product-e2e:test
```

### 3. Development Commands

#### Generate OpenAPI code
```bash
./gradlew generateApiCode
```

#### Run all tests
```bash
./gradlew test
```

#### Clean build
```bash
./gradlew clean build
```

## API Documentation

Once the backend is running, access:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Application URLs

- Backend API: http://localhost:8080
- Frontend UI: http://localhost:3000
- Database: localhost:5432

## CI/CD

The project uses GitHub Actions for continuous integration. On every PR and merge to main:
1. Builds all subprojects
2. Runs unit and integration tests
3. Runs end-to-end tests
4. Generates test reports

## Contributing

1. Make changes in appropriate subproject
2. Run tests locally: `./gradlew test`
3. Commit and push changes
4. Create pull request

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8080 (backend) and 3000 (frontend) are available
2. **Database connection**: Verify PostgreSQL is running and credentials are correct
3. **Node.js version**: Use Node.js 20+ for frontend compatibility

### Logs

- Backend logs: `./gradlew :data-product-api:bootRun --info`
- Frontend logs: Available in browser console and npm start output