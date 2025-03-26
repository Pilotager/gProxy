# gProxy Architecture

This document describes the architectural decisions and patterns used in the gProxy application.

## Core Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **Configuration Centralization**: All configuration is maintained in a single location
3. **Modularity**: Components are designed to be replaceable and independent
4. **Error Handling**: Comprehensive error handling at all levels
5. **Testability**: Code is structured to be easily testable

## Architecture Overview

gProxy follows a layered architecture pattern:

```
[Client] <-> [Express Application]
                    |
    +--------------+----------------+
    |              |                |
[Routes]    [Middlewares]    [Services]
    |              |                |
    +--------------+----------------+
                    |
              [Configuration]
```

### Key Components

#### 1. Configuration Layer

The configuration layer centralizes all application settings in one place, making it easy to modify behavior without changing code.

**Files**:

- `src/config/index.js` - Main configuration file

**Responsibilities**:

- Environment variable loading and validation
- Default values for configuration
- Configuration structure and organization

#### 2. Middleware Layer

Middleware components handle cross-cutting concerns such as request processing, error handling, and proxying.

**Files**:

- `src/middlewares/directRequestMiddleware.js` - Handles non-proxy API requests
- `src/middlewares/errorHandler.js` - Global error handling

**Responsibilities**:

- Request processing
- Response generation
- Error handling
- Proxy functionality

#### 3. Service Layer

Services implement the business logic of the application.

**Files**:

- `src/services/homepageService.js` - Generates the homepage HTML
- `src/services/mockService.js` - Manages mock data

**Responsibilities**:

- Mock data generation and management
- Template discovery and loading
- Business logic implementation

#### 4. Routes Layer

Routes define the API endpoints and connect client requests to the appropriate handlers.

**Files**:

- `src/routes/index.js` - Main routes setup

**Responsibilities**:

- URL endpoint definition
- Request routing
- Dynamic route generation from templates

#### 5. Utility Layer

Utilities provide common functionality used across the application.

**Files**:

- `src/utils/logger.js` - Logging functionality
- `src/utils/fileViewer.js` - File viewing utilities
- `src/utils/cursorLauncher.js` - Cursor editor integration

**Responsibilities**:

- Logging
- File operations
- Editor integration

## Design Patterns

### 1. Dependency Injection

Components receive their dependencies rather than creating them, making the code more testable and flexible.

### 2. Middleware Pattern

Express middleware pattern is used extensively to process requests in a pipeline.

### 3. Factory Pattern

The mock service uses a factory pattern to create dynamic templates based on configuration.

### 4. Singleton Pattern

Logging and configuration use singleton patterns to ensure consistent access across the application.

## Architectural Improvements

The following improvements were made to the original architecture:

1. **Configuration Centralization**: Moved all configuration from scattered locations to a central config module
2. **Middleware Refactoring**: Broke down large middleware functions into smaller, focused functions
3. **Improved Error Handling**: Added structured error handling with appropriate logging
4. **Code Organization**: Better separation of concerns with clearer boundaries between components
5. **Removal of Redundant Code**: Eliminated duplicate code and unnecessary complexity
6. **Internationalization**: Standardized on English for code and comments
7. **Function Decomposition**: Split large functions into smaller, more focused ones

## Future Improvements

Potential areas for future architectural improvements:

1. **Testing**: Add comprehensive unit and integration tests
2. **API Documentation**: Add Swagger/OpenAPI documentation
3. **Containerization**: Add Docker support for easier deployment
4. **Monitoring**: Add health metrics and monitoring capabilities
5. **Caching**: Implement response caching for improved performance
6. **Authentication**: Add support for API authentication

## Conclusion

The gProxy application now follows a clean, modular architecture that is easier to maintain and extend. By separating concerns and centralizing configuration, the application is more flexible and can adapt to changing requirements with minimal effort.
