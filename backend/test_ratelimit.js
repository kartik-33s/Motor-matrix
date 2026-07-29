import http from 'http';

const BASE_URL = 'http://localhost:5000';

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const postData = body ? JSON.stringify(body) : '';
    const headers = { 'Content-Type': 'application/json' };
    if (postData) headers['Content-Length'] = Buffer.byteLength(postData);

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let json = null;
          try { json = JSON.parse(data); } catch (e) { json = data; }
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        });
      }
    );
    if (postData) req.write(postData);
    req.end();
  });
}

async function testRateLimiting() {
  console.log('--- Testing Auth Rate Limiter (Limit: 10 per 15 mins) ---');
  let authLimiterTriggered = false;

  for (let i = 1; i <= 12; i++) {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'test_ratelimit@example.com',
      password: 'wrongpassword',
    });
    console.log(`Request #${i} -> Status: ${res.status}`, res.status === 429 ? res.data : '');
    if (res.status === 429) {
      authLimiterTriggered = true;
      console.log('✅ Auth rate limiter successfully triggered on request #' + i);
      break;
    }
  }

  if (authLimiterTriggered) {
    console.log('Rate limiting verification SUCCESSFUL!');
  } else {
    console.log('Rate limiting check completed.');
  }
}

testRateLimiting();
