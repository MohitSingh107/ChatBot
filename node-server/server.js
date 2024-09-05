const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Utility function to get the correct file path
const getDataFilePath = (type) => {
  if (type === 'payment') {
    return path.join('uploads', 'payment.json');
  } else if (type === 'order-details') {
    return path.join('uploads', 'order-details.json');
  }
  return null;
};

// Read data from file
const readDataFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const path = parsedUrl.pathname;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  if (method === 'OPTIONS') {
    // Handle preflight requests
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === 'GET' && path === '/payment-details') {
    // GET /payment-details - Retrieve payment details
    const dataFilePath = getDataFilePath('payment');
    const paymentDetails = readDataFromFile(dataFilePath);
    res.writeHead(200);
    res.end(JSON.stringify(paymentDetails));
  } else if (method === 'GET' && path === '/order-details') {
    // GET /order-details - Retrieve order details
    const dataFilePath = getDataFilePath('order-details');
    const orderDetails = readDataFromFile(dataFilePath);
    res.writeHead(200);
    res.end(JSON.stringify(orderDetails));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
