const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Registration Service runs in the same Pod -> http://localhost:5001
const REGISTRATION_SERVICE_URL = process.env.REGISTRATION_SERVICE_URL || 'http://localhost:5001';

// Delete Service runs in 2nd Pod -> accessed via K8s Service http://delete-service:5002
const DELETE_SERVICE_URL = process.env.DELETE_SERVICE_URL || 'http://delete-service:5002';

app.use(cors());
app.use(express.json());

// Forward Registration Request to Registration Microservice
app.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${REGISTRATION_SERVICE_URL}/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json(error.response ? error.response.data : { error: error.message });
  }
});

// Forward Delete Request (URL parameter) to Delete Microservice
app.delete('/delete/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${DELETE_SERVICE_URL}/delete/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json(error.response ? error.response.data : { error: error.message });
  }
});

// Forward Delete Request (POST Body) to Delete Microservice
app.post('/delete', async (req, res) => {
  try {
    const response = await axios.post(`${DELETE_SERVICE_URL}/delete`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json(error.response ? error.response.data : { error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'API Gateway', status: 'UP', port: PORT });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
