const http = require('http');

const loginData = JSON.stringify({
  email: 'admin@example.com',
  password: 'password123'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let data;
    try {
      data = JSON.parse(body);
    } catch(e) {
      console.log('Failed to parse:', body);
      process.exit(1);
    }
    if (!data.token) {
      console.log('Login failed:', data);
      process.exit(1);
    }
    
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const endDate = today.toISOString();
    
    const analysisData = JSON.stringify({
      question: 'What are the best-selling products?',
      startDate,
      endDate
    });

    const aiReq = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/analytics/ai-analysis',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
        'Content-Length': Buffer.byteLength(analysisData)
      }
    }, (aiRes) => {
      let aiBody = '';
      aiRes.on('data', chunk => aiBody += chunk);
      aiRes.on('end', () => {
        console.log('Status Code:', aiRes.statusCode);
        console.log('Response:', aiBody);
      });
    });
    
    aiReq.on('error', (e) => {
      console.error('Problem with AI request:', e.message);
    });
    
    aiReq.write(analysisData);
    aiReq.end();
  });
});

req.on('error', (e) => {
  console.error('Problem with login request:', e.message);
});

req.write(loginData);
req.end();
