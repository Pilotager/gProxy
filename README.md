# gProxy

A development proxy server designed for mocking API responses and facilitating frontend development.

## Features

- API mocking with dynamic templates
- Proxy to real service when mock data not available
- Automatic code editor integration with Cursor
- Configurable CORS settings and request handling
- Comprehensive logging

## Architecture

The application is structured following a clean architecture pattern:

```
src/
├── config/             # Configuration files
├── middlewares/        # Express middlewares
├── routes/             # Route definitions
├── services/           # Business logic services
├── templates/          # API mock templates
├── utils/              # Utility functions
└── index.js            # Application entry point
```

### Key Components

- **Config**: Centralizes all application configuration settings
- **Middlewares**: Contains request handling, error handling, and proxy logic
- **Services**: Contains business logic for mock data and homepage generation
- **Routes**: Handles API route setup and request processing
- **Utils**: Provides logging, file viewing, and Cursor integration utilities

## Setup

### Prerequisites

- Node.js 14+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-organization/gProxy.git
cd gProxy

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the project root with the following settings:

```
PORT=3000
TARGET_SERVICE_URL=https://your-api-server.com
MOCK_DELAY=200
LOG_LEVEL=info
LOG_FORMAT=json
```

### Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Usage

### Accessing the Application

Once running, access the application at:

```
http://localhost:3000
```

### API Endpoints

- `/api/{template-name}` - Access mock data from templates
- `/api/{template-name}/{id}` - Access specific resource with ID
- `/proxy/...` - Forward requests to real service
- `/health` - Check application health

### Adding Mock Templates

Create template files in the `src/templates` directory:

```javascript
// src/templates/users.js
module.exports = {
  // GET /api/users
  get: (params, query, body) => {
    return {
      success: true,
      data: [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ],
    };
  },

  // GET /api/users/:id
  "get/:id": (params, query, body) => {
    return {
      success: true,
      data: { id: Number(params.id), name: `User ${params.id}` },
    };
  },
};
```

## License

MIT
