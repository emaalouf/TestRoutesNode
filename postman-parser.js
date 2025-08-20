// Postman collection parser
// Converts Postman collection format to our internal route format

function parsePostmanCollection(collection) {
  const routes = [];
  
  // Check if collection has items
  if (!collection.item || !Array.isArray(collection.item)) {
    throw new Error('Invalid Postman collection format: missing or invalid "item" array');
  }
  
  // Process each item in the collection
  collection.item.forEach(item => {
    // Skip folders/items without requests
    if (!item.request) {
      return;
    }
    
    const request = item.request;
    
    // Convert Postman request to our route format
    const route = {
      method: request.method || 'GET',
      url: getRequestUrl(request.url),
      headers: parseHeaders(request.header),
      name: item.name || `${request.method} ${getRequestUrl(request.url)}`
    };
    
    // Add body if present
    if (request.body && request.body.mode === 'raw') {
      route.body = request.body.raw;
    }
    
    routes.push(route);
  });
  
  return routes;
}

// Extract URL from Postman URL object or string
function getRequestUrl(url) {
  if (typeof url === 'string') {
    return url;
  }
  
  if (typeof url === 'object') {
    // Handle Postman's URL object format
    if (url.raw) {
      return url.raw;
    }
    
    // Construct URL from components
    if (url.host && Array.isArray(url.host)) {
      const protocol = url.protocol || 'https';
      const host = url.host.join('.');
      const path = url.path && Array.isArray(url.path) ? '/' + url.path.join('/') : '';
      const query = url.query && Array.isArray(url.query) ? 
        '?' + url.query.map(q => `${q.key}=${q.value}`).join('&') : '';
      
      return `${protocol}://${host}${path}${query}`;
    }
  }
  
  throw new Error('Invalid URL format in Postman collection');
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