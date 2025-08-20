// Authentication configuration module
// Supports token-based authentication via environment variables or config file

const fs = require('fs');
const path = require('path');

class AuthConfig {
  constructor() {
    this.token = null;
    this.loadConfig();
  }

  // Load authentication configuration
  loadConfig() {
    // First try to load from environment variables
    if (process.env.AUTH_TOKEN) {
      this.token = process.env.AUTH_TOKEN;
      console.log('Authentication token loaded from environment variables');
      return;
    }

    // Then try to load from auth config file
    const authConfigPath = path.join(__dirname, 'auth.config.json');
    if (fs.existsSync(authConfigPath)) {
      try {
        const authConfig = JSON.parse(fs.readFileSync(authConfigPath, 'utf8'));
        this.token = authConfig.token;
        console.log('Authentication token loaded from auth.config.json');
        return;
      } catch (error) {
        console.error('Error reading auth.config.json:', error.message);
      }
    }

    console.log('No authentication token found');
  }

  // Get authorization header
  getAuthHeader() {
    if (this.token) {
      return {
        'Authorization': `Bearer ${this.token}`
      };
    }
    return {};
  }

  // Check if authentication is configured
  isConfigured() {
    return !!this.token;
  }
}

module.exports = AuthConfig;