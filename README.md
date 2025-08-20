# Route Testing Application

A Node.js application for testing HTTP routes with authentication support, detailed error logging, and response time tracking.

## Features

- Execute HTTP requests against defined routes
- Support for Postman collection JSON files as input
- Token-based authentication support via command line or environment variables
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

The application supports token-based authentication through multiple methods:

1. **Command Line Argument**:
   Provide the token as the second argument:
   ```bash
   node index.js ./routes.js your-auth-token-here
   ```

2. **Environment Variables**:
   Set the `AUTH_TOKEN` environment variable:
   ```bash
   export AUTH_TOKEN=your-auth-token-here
   ```

3. **Configuration File**:
   Edit the `auth.config.json` file:
   ```json
   {
     "token": "your-auth-token-here"
   }
   ```

### Routes Definition

The application supports two formats for defining routes:

1. **Custom JavaScript Format** (`routes.js`):
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

2. **Postman Collection Format** (`collection.json`):
   Export your Postman collection as JSON and use it directly:
   ```bash
   node index.js ./postman-collection.json
   ```

## Usage

Run the application using one of these commands:

```bash
# Using npm with default routes file
npm start

# Direct execution with default routes file
node index.js

# Direct execution with custom routes file
node index.js ./routes.js

# Direct execution with Postman collection
node index.js ./sample-postman-collection.json

# Direct execution with Postman collection and auth token
node index.js ./sample-postman-collection.json your-auth-token-here

# Direct execution with Postman collection, auth token, and custom baseURL
node index.js ./sample-postman-collection.json your-auth-token-here https://soffa.api.emaalouf.com/

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