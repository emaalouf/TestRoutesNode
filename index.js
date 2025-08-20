// Main application file for route testing
const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const AuthConfig = require('./auth');
const routes = require('./routes');

// Initialize authentication
const authConfig = new AuthConfig();

// Test results storage
const testResults = {
  success: [],
  error: [],
  startTime: new Date()
};

// Utility function to make HTTP requests
function makeRequest(route) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    // Parse URL to determine if it's HTTP or HTTPS
    const parsedUrl = url.parse(route.url);
    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    
    // Prepare request options
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.path,
      method: route.method,
      headers: {
        ...route.headers,
        ...authConfig.getAuthHeader() // Add authentication headers if configured
      }
    };
    
    // Create request
    const req = client.request(options, (res) => {
      let data = '';
      
      // Collect response data
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Handle response end
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        const result = {
          route: route,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          responseTime: responseTime,
          headers: res.headers,
          data: data,
          timestamp: new Date()
        };
        
        // Categorize by status code
        if (res.statusCode >= 200 && res.statusCode < 400) {
          testResults.success.push(result);
        } else {
          testResults.error.push(result);
        }
        
        resolve(result);
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const result = {
        route: route,
        error: error.message,
        responseTime: responseTime,
        timestamp: new Date()
      };
      
      testResults.error.push(result);
      reject(error);
    });
    
    // Write request body if present
    if (route.body) {
      req.write(route.body);
    }
    
    // End request
    req.end();
  });
}

// Execute all routes
async function executeRoutes() {
  console.log(`Starting route tests at ${testResults.startTime}`);
  console.log(`Total routes to test: ${routes.length}`);
  
  if (authConfig.isConfigured()) {
    console.log('Authentication is configured');
  } else {
    console.log('No authentication configured');
  }
  
  // Execute each route sequentially
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    console.log(`\nTesting route ${i + 1}/${routes.length}: ${route.method} ${route.url}`);
    
    try {
      const result = await makeRequest(route);
      console.log(`  Status: ${result.statusCode} (${result.statusMessage})`);
      console.log(`  Response time: ${result.responseTime}ms`);
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  
  // Generate report
  await generateReport();
}

// Generate comprehensive test report
async function generateReport() {
  const endTime = new Date();
  const duration = endTime - testResults.startTime;
  
  console.log('\n' + '='.repeat(50));
  console.log('TEST REPORT');
  console.log('='.repeat(50));
  console.log(`Start time: ${testResults.startTime}`);
  console.log(`End time: ${endTime}`);
  console.log(`Duration: ${duration}ms`);
  console.log(`Total routes tested: ${routes.length}`);
  console.log(`Successful requests: ${testResults.success.length}`);
  console.log(`Failed requests: ${testResults.error.length}`);
  
  // Calculate success rate
  const successRate = routes.length > 0 ? (testResults.success.length / routes.length) * 100 : 0;
  console.log(`Success rate: ${successRate.toFixed(2)}%`);
  
  // Calculate average response time
  const totalResponseTime = testResults.success.reduce((sum, result) => sum + result.responseTime, 0) +
                            testResults.error.reduce((sum, result) => sum + (result.responseTime || 0), 0);
  const averageResponseTime = routes.length > 0 ? (totalResponseTime / routes.length) : 0;
  console.log(`Average response time: ${averageResponseTime.toFixed(2)}ms`);
  
  // Detailed success results
  if (testResults.success.length > 0) {
    console.log('\nSUCCESSFUL REQUESTS:');
    console.log('-'.repeat(30));
    testResults.success.forEach((result, index) => {
      console.log(`${index + 1}. ${result.route.method} ${result.route.url}`);
      console.log(`   Status: ${result.statusCode} (${result.statusMessage})`);
      console.log(`   Response time: ${result.responseTime}ms`);
    });
  }
  
  // Detailed error results
  if (testResults.error.length > 0) {
    console.log('\nFAILED REQUESTS:');
    console.log('-'.repeat(30));
    testResults.error.forEach((result, index) => {
      console.log(`${index + 1}. ${result.route.method} ${result.route.url}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      } else {
        console.log(`   Status: ${result.statusCode} (${result.statusMessage})`);
      }
      console.log(`   Response time: ${result.responseTime}ms`);
    });
  }
  
  // Save detailed report to file
  await saveReportToFile();
}

// Save detailed report to a file
async function saveReportToFile() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFileName = `report_${timestamp}.js`;
  
  // Prepare report data
  const reportData = {
    summary: {
      startTime: testResults.startTime,
      endTime: new Date(),
      totalRoutes: routes.length,
      successfulRequests: testResults.success.length,
      failedRequests: testResults.error.length,
      successRate: routes.length > 0 ? (testResults.success.length / routes.length) * 100 : 0,
      averageResponseTime: routes.length > 0 ? 
        ((testResults.success.reduce((sum, result) => sum + result.responseTime, 0) +
          testResults.error.reduce((sum, result) => sum + (result.responseTime || 0), 0)) / routes.length) : 0
    },
    success: testResults.success.map(result => ({
      method: result.route.method,
      url: result.route.url,
      statusCode: result.statusCode,
      statusMessage: result.statusMessage,
      responseTime: result.responseTime,
      timestamp: result.timestamp
    })),
    error: testResults.error.map(result => ({
      method: result.route.method,
      url: result.route.url,
      error: result.error,
      statusCode: result.statusCode,
      statusMessage: result.statusMessage,
      responseTime: result.responseTime,
      timestamp: result.timestamp
    }))
  };
  
  // Write report to file
  const reportContent = `// Route Test Report - Generated on ${new Date().toISOString()}
module.exports = ${JSON.stringify(reportData, null, 2)};
`;
  
  try {
    fs.writeFileSync(reportFileName, reportContent);
    console.log(`\nDetailed report saved to: ${reportFileName}`);
  } catch (error) {
    console.error(`Error saving report to file: ${error.message}`);
  }
}

// Run the application
executeRoutes().catch(error => {
  console.error('Application error:', error);
  process.exit(1);
});