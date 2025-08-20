// Sample routes file with curl-like definitions
// Format: { method, url, headers, body (optional) }

module.exports = [
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  {
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1
    })
  },
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/users/1',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  {
    method: 'PUT',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: 1,
      title: 'Updated Post',
      body: 'This post has been updated',
      userId: 1
    })
  },
  {
    method: 'DELETE',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: {
      'Content-Type': 'application/json'
    }
  }
];