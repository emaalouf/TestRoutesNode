// Postman collection parser
// Converts Postman collection format to our internal route format

function parsePostmanCollection(collection) {
  const routes = [];
  
  // Check if collection has items
  if (!collection.item || !Array.isArray(collection.item)) {
    throw new Error('Invalid Postman collection format: missing or invalid "item" array');
  }
  
  // Extract variables if they exist
  const variables = {};
  if (collection.variable && Array.isArray(collection.variable)) {
    collection.variable.forEach(variable => {
      if (variable.key && variable.value) {
        variables[variable.key] = variable.value;
      }
    });
  }
  
  // Process each item in the collection (including nested items)
  processItems(collection.item, routes, variables);
  
  return routes;
}

// Recursively process items (including folders)
function processItems(items, routes, variables = {}) {
  items.forEach(item => {
    // If item has nested items (folder), process them recursively
    if (item.item && Array.isArray(item.item)) {
      processItems(item.item, routes, variables);
      return;
    }
    
    // Skip items without requests
    if (!item.request) {
      return;
    }
    
    const request = item.request;
    
    // Convert Postman request to our route format
    const route = {
      method: request.method || 'GET',
      url: getRequestUrl(request.url, variables),
      headers: parseHeaders(request.header),
      name: item.name || `${request.method} ${getRequestUrl(request.url, variables)}`
    };
    
    // Add body if present
    if (request.body && request.body.mode === 'raw') {
      route.body = request.body.raw;
    }
    
    routes.push(route);
  });
}

// Extract URL from Postman URL object or string
function getRequestUrl(url, variables = {}) {
  if (typeof url === 'string') {
    return replaceVariables(url, variables);
  }
  
  if (typeof url === 'object') {
    // Handle Postman's URL object format
    if (url.raw) {
      return replaceVariables(url.raw, variables);
    }
    
    // Construct URL from components
    if (url.host && Array.isArray(url.host)) {
      const protocol = url.protocol || 'http'; // Default to http for localhost
      const host = replaceVariables(url.host.join('.'), variables);
      const port = url.port ? `:${replaceVariables(url.port, variables)}` : '';
      const path = url.path && Array.isArray(url.path) ? '/' + url.path.map(p => replaceVariables(p, variables)).join('/') : '';
      const query = url.query && Array.isArray(url.query) ?
        '?' + url.query.map(q => `${encodeURIComponent(replaceVariables(q.key, variables))}=${encodeURIComponent(replaceVariables(q.value || '', variables))}`).join('&') : '';
      
      return `${protocol}://${host}${port}${path}${query}`;
    }
  }
  
  throw new Error('Invalid URL format in Postman collection');
}

// Replace variables in a string
function replaceVariables(str, variables) {
  if (typeof str !== 'string') {
    return str;
  }
  
  let result = str;
  for (const [key, value] of Object.entries(variables)) {
    const varPattern = `{{${key}}}`;
    result = result.replace(new RegExp(varPattern, 'g'), value);
  }
  
  return result;
}

// Parse headers from Postman format to object
function parseHeaders(postmanHeaders) {
  const headers = {};
  
  if (!postmanHeaders || !Array.isArray(postmanHeaders)) {
    return headers;
  }
  
  postmanHeaders.forEach(header => {
    if (header.key && header.value) {
      headers[header.key] = header.value;
    }
  });
  
  return headers;
}

module.exports = {
  parsePostmanCollection
};