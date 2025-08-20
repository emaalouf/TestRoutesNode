# Route Testing Application

A Node.js application for testing HTTP routes with authentication support, detailed error logging, and response time tracking.

## Features

- Execute HTTP requests against defined routes
- Token-based authentication support via environment variables or config file
- Comprehensive test reporting with success/error categorization
- Detailed error logging and response time tracking
- Generates timestamped test reports in JavaScript format

## Installation

1. Clone or download this repository
2. Install dependencies (if any):
   ```bash
   npm install
   ```

## Configuration

### Authentication

The application supports token-based authentication through two methods:

1. **Environment Variables**:
   Set the `AUTH_TOKEN` environment variable:
   ```bash
   export AUTH_TOKEN=your-auth-token-here
   ```

2. **Configuration File**:
   Edit the `auth.config.json` file:
   ```json
   {
     "token": "your-auth-token-here"
   }
   ```

### Routes Definition

Define your routes in the `routes.js` file using the following format:

```javascript
module.exports = [
  {
    method: 'GET',           // HTTP method
    url: 'https://example.com/api/endpoint',  // Full URL
    headers: {               // HTTP headers
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({   // Request body (optional)
      key: 'value'
    })
  }
];
```

## Usage

Run the application using one of these commands:

```bash
# Using npm
npm start

# Direct execution
node index.js

# Development mode
npm run dev
```

## Report Generation

After execution, the application generates a detailed report in a file named `report_[timestamp].js` which contains:

- Test summary with success rate and average response time
- Detailed results for successful requests
- Detailed results for failed requests
- Response times for all requests

## Environment Variables

- `AUTH_TOKEN`: Authentication token for protected routes

## Dependencies

This application uses only built-in Node.js modules:
- `http` and `https` for making requests
- `url` for URL parsing
- `fs` and `path` for file operations

## License

MIT