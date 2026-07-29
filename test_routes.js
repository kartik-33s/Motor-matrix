import http from 'http';

const BASE_URL = 'http://localhost:5000';

let userToken = '';
let adminToken = '';
let createdVehicleId = '';
let purchasedOrderId = '';

// Helper to make HTTP requests
function request(method, path, body = null, token = null) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const postData = body ? JSON.stringify(body) : '';
    
    const headers = {
      'Content-Type': 'application/json',
    };
    if (postData) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: headers,
    };

    const startTime = Date.now();

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          data: json,
          responseTime,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        statusText: err.message,
        headers: {},
        data: null,
        responseTime: Date.now() - startTime,
      });
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function formatJson(obj, indent = 2) {
  const str = JSON.stringify(obj, null, indent);
  const lines = str.split('\n');
  if (lines.length > 15) {
    return [...lines.slice(0, 12), `    ... (${lines.length - 12} lines truncated)`].join('\n');
  }
  return str;
}

function printSectionHeader(title) {
  console.log(`\n================================================================================`);
  console.log(`📌 COLLECTION: ${title.toUpperCase()}`);
  console.log(`================================================================================`);
}

function printRequestResult(testName, method, endpoint, reqBody, res, expectedStatus) {
  const passed = Array.isArray(expectedStatus)
    ? expectedStatus.includes(res.status)
    : res.status === expectedStatus;

  const statusSymbol = passed ? '✅ [PASS]' : '❌ [FAIL]';
  const statusColor = passed ? '\x1b[32m' : '\x1b[31m';
  const resetColor = '\x1b[0m';

  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`🚀 ${testName}`);
  console.log(`   ${method} ${BASE_URL}${endpoint}`);
  if (reqBody) {
    console.log(`   📥 Request Body:`);
    console.log(`   ${formatJson(reqBody).replace(/\n/g, '\n   ')}`);
  }
  console.log(`   ${statusColor}${statusSymbol} Status: ${res.status} ${res.statusText} (${res.responseTime}ms)${resetColor}`);
  console.log(`   📤 Response Headers: content-type = ${res.headers['content-type'] || 'N/A'}`);
  console.log(`   📄 Response Body:`);
  console.log(`   ${formatJson(res.data).replace(/\n/g, '\n   ')}`);
  return passed;
}

async function runPostmanTests() {
  console.clear ? console.clear() : null;
  console.log(`
███╗   ███╗██████╗ ████████╗██████╗ ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
██╔████╔██║██║  ██║   ██║   ██████╔╝██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
██║╚██╔╝██║██║  ██║   ██║   ██╔══██╗██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
██║ ╚═╝ ██║██████╔╝   ██║   ██║  ██║██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
╚═╝     ╚═╝╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
`);
  console.log(`⚡ POSTMAN API TEST RUNNER - MOTOR MATRIX BACKEND API ⚡`);
  console.log(`Target Base URL: ${BASE_URL}\n`);

  let totalTests = 0;
  let passedTests = 0;

  const check = (passed) => {
    totalTests++;
    if (passed) passedTests++;
  };

  // ---------------------------------------------------------------------------
  // 1. SYSTEM & HEALTH ENDPOINTS
  // ---------------------------------------------------------------------------
  printSectionHeader('System & Health Endpoints');

  let res = await request('GET', '/');
  check(printRequestResult('Get API Root Metadata', 'GET', '/', null, res, 200));

  res = await request('GET', '/api');
  check(printRequestResult('Get Base API Endpoint Info', 'GET', '/api', null, res, 200));

  res = await request('GET', '/api/health');
  check(printRequestResult('Check System Health Status', 'GET', '/api/health', null, res, 200));

  // ---------------------------------------------------------------------------
  // 2. AUTHENTICATION & USER MANAGEMENT
  // ---------------------------------------------------------------------------
  printSectionHeader('Authentication & User Management');

  const testEmail = `testuser_${Date.now()}@example.com`;
  const registerPayload = {
    name: 'Postman Test User',
    email: testEmail,
    password: 'TestPassword123!',
    role: 'user',
  };
  res = await request('POST', '/api/auth/register', registerPayload);
  check(printRequestResult('Register New User Account', 'POST', '/api/auth/register', registerPayload, res, 201));

  // Duplicate email registration test
  res = await request('POST', '/api/auth/register', registerPayload);
  check(printRequestResult('Reject Duplicate Email Registration', 'POST', '/api/auth/register', registerPayload, res, 400));

  // Login Demo Customer
  const customerLogin = { email: 'user@dealership.com', password: 'user123' };
  res = await request('POST', '/api/auth/login', customerLogin);
  if (res.status === 200 && res.data?.token) {
    userToken = res.data.token;
  }
  check(printRequestResult('Login Customer Account', 'POST', '/api/auth/login', customerLogin, res, 200));

  // Login Demo Admin
  const adminLogin = { email: 'admin@dealership.com', password: 'admin123' };
  res = await request('POST', '/api/auth/login', adminLogin);
  if (res.status === 200 && res.data?.token) {
    adminToken = res.data.token;
  }
  check(printRequestResult('Login Admin Account', 'POST', '/api/auth/login', adminLogin, res, 200));

  // Login Invalid Credentials
  const invalidLogin = { email: 'wrong@dealership.com', password: 'badpassword' };
  res = await request('POST', '/api/auth/login', invalidLogin);
  check(printRequestResult('Reject Invalid Login Credentials', 'POST', '/api/auth/login', invalidLogin, res, 401));

  // Get Profile authenticated
  res = await request('GET', '/api/auth/me', null, userToken);
  check(printRequestResult('Get Current User Profile (Authenticated)', 'GET', '/api/auth/me', null, res, 200));

  // Get Profile unauthenticated
  res = await request('GET', '/api/auth/me');
  check(printRequestResult('Reject Unauthenticated User Profile Request', 'GET', '/api/auth/me', null, res, 401));

  // ---------------------------------------------------------------------------
  // 3. VEHICLE INVENTORY API
  // ---------------------------------------------------------------------------
  printSectionHeader('Vehicle Inventory API');

  res = await request('GET', '/api/vehicles');
  check(printRequestResult('Get All Inventory Vehicles', 'GET', '/api/vehicles', null, res, 200));

  res = await request('GET', '/api/vehicles/search?make=Porsche&category=Sports');
  check(printRequestResult('Search & Filter Vehicles (make=Porsche, category=Sports)', 'GET', '/api/vehicles/search?make=Porsche&category=Sports', null, res, 200));

  res = await request('GET', '/api/vehicles/search?q=Plaid&minPrice=50000&maxPrice=100000');
  check(printRequestResult('Search & Filter Vehicles (q=Plaid, minPrice=50000, maxPrice=100000)', 'GET', '/api/vehicles/search?q=Plaid&minPrice=50000&maxPrice=100000', null, res, 200));

  const sampleVehicleId = 'v1111111-1111-1111-1111-111111111111';
  res = await request('GET', `/api/vehicles/${sampleVehicleId}`);
  check(printRequestResult(`Get Vehicle Details by ID (${sampleVehicleId})`, 'GET', `/api/vehicles/${sampleVehicleId}`, null, res, 200));

  res = await request('GET', '/api/vehicles/v9999999-invalid-id');
  check(printRequestResult('Handle Non-Existent Vehicle Details Request', 'GET', '/api/vehicles/v9999999-invalid-id', null, res, 404));

  // Create Vehicle Admin Auth
  const newVehiclePayload = {
    make: 'Bugatti',
    model: 'Tourbillon V16',
    year: 2026,
    price: 4100000,
    stock: 2,
    category: 'Hypercar',
    image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
    description: 'Naturally aspirated 8.3L V16 hybrid developing 1,800 horsepower.',
  };
  res = await request('POST', '/api/vehicles', newVehiclePayload, adminToken);
  if (res.status === 201 && res.data?.id) {
    createdVehicleId = res.data.id;
  }
  check(printRequestResult('Create New Vehicle (Admin Auth)', 'POST', '/api/vehicles', newVehiclePayload, res, 201));

  // Create Vehicle Customer Auth (RBAC test)
  res = await request('POST', '/api/vehicles', newVehiclePayload, userToken);
  check(printRequestResult('Forbidden Create Vehicle (Customer Auth RBAC Test)', 'POST', '/api/vehicles', newVehiclePayload, res, 403));

  // Update Created Vehicle (Admin Auth)
  if (createdVehicleId) {
    const updatePayload = {
      price: 4250000,
      stock: 5,
      description: 'Updated description: Naturally aspirated 8.3L V16 hybrid developing 1,800 horsepower with ultra-light chassis.',
    };
    res = await request('PUT', `/api/vehicles/${createdVehicleId}`, updatePayload, adminToken);
    check(printRequestResult(`Update Vehicle Details (Admin Auth, ID: ${createdVehicleId})`, 'PUT', `/api/vehicles/${createdVehicleId}`, updatePayload, res, 200));

    // Restock Created Vehicle
    const restockPayload = { amount: 3 };
    res = await request('POST', `/api/vehicles/${createdVehicleId}/restock`, restockPayload, adminToken);
    check(printRequestResult(`Restock Vehicle Inventory (Admin Auth, ID: ${createdVehicleId})`, 'POST', `/api/vehicles/${createdVehicleId}/restock`, restockPayload, res, 200));

    // Purchase Created Vehicle (Customer Auth)
    const purchasePayload = { quantity: 2 };
    res = await request('POST', `/api/vehicles/${createdVehicleId}/purchase`, purchasePayload, userToken);
    if (res.status === 200 && res.data?.transaction?.id) {
      purchasedOrderId = res.data.transaction.id;
    }
    check(printRequestResult(`Purchase Vehicle (Customer Auth, ID: ${createdVehicleId})`, 'POST', `/api/vehicles/${createdVehicleId}/purchase`, purchasePayload, res, 200));
  }

  // Get Admin Sales Audit Ledger
  res = await request('GET', '/api/vehicles/transactions/all', null, adminToken);
  check(printRequestResult('Get Admin Sales Audit Ledger', 'GET', '/api/vehicles/transactions/all', null, res, 200));

  // Customer attempting Admin Sales Audit Ledger (RBAC Test)
  res = await request('GET', '/api/vehicles/transactions/all', null, userToken);
  check(printRequestResult('Forbidden Access to Sales Ledger (Customer RBAC Test)', 'GET', '/api/vehicles/transactions/all', null, res, 403));

  // ---------------------------------------------------------------------------
  // 4. ORDERS & ANALYTICS API
  // ---------------------------------------------------------------------------
  printSectionHeader('Orders & Analytics API');

  res = await request('GET', '/api/orders/my-orders', null, userToken);
  check(printRequestResult('Get Logged-in Customer Order History', 'GET', '/api/orders/my-orders', null, res, 200));

  res = await request('GET', '/api/orders/my-orders?status=completed', null, userToken);
  check(printRequestResult('Filter Customer Orders by Status (status=completed)', 'GET', '/api/orders/my-orders?status=completed', null, res, 200));

  res = await request('GET', '/api/orders/analytics', null, userToken);
  check(printRequestResult('Get Customer Spending & Category Analytics', 'GET', '/api/orders/analytics', null, res, 200));

  if (purchasedOrderId) {
    res = await request('GET', `/api/orders/${purchasedOrderId}`, null, userToken);
    check(printRequestResult(`Get Itemized Order Receipt (${purchasedOrderId})`, 'GET', `/api/orders/${purchasedOrderId}`, null, res, 200));
  }

  res = await request('GET', '/api/orders/TX-999999-invalid', null, userToken);
  check(printRequestResult('Handle Non-Existent Order Receipt Request', 'GET', '/api/orders/TX-999999-invalid', null, res, 404));

  // Delete Created Vehicle (Admin Auth) - Run after order testing
  if (createdVehicleId) {
    res = await request('DELETE', `/api/vehicles/${createdVehicleId}`, null, adminToken);
    check(printRequestResult(`Delete Vehicle from Catalog (Admin Auth, ID: ${createdVehicleId})`, 'DELETE', `/api/vehicles/${createdVehicleId}`, null, res, 200));
  }

  // ---------------------------------------------------------------------------
  // 5. ERROR HANDLING & 404 ROUTE HANDLER
  // ---------------------------------------------------------------------------
  printSectionHeader('Error Handling & 404 Handler');

  res = await request('GET', '/api/nonexistent-route-test');
  check(printRequestResult('404 Handler for Unmatched GET Endpoint', 'GET', '/api/nonexistent-route-test', null, res, 404));

  res = await request('POST', '/api/vehicles/invalid/action');
  check(printRequestResult('404 Handler for Unmatched POST Endpoint', 'POST', '/api/vehicles/invalid/action', null, res, 404));

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log(`\n================================================================================`);
  console.log(`📊 POSTMAN TEST RUN SUMMARY`);
  console.log(`================================================================================`);
  console.log(`   Total Endpoints / Test Cases Run: ${totalTests}`);
  console.log(`   ✅ Total Passed:                  ${passedTests}`);
  console.log(`   ❌ Total Failed:                  ${totalTests - passedTests}`);
  console.log(`   📈 Success Rate:                  ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log(`================================================================================\n`);
}

runPostmanTests();
