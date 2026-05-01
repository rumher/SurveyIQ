// server.js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Client, Environment } from '@paypal/paypal-server-sdk';

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Initialize PayPal client once at startup
const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET
  },
  environment: Environment.Sandbox,
});

// 🎯 Route: Create PayPal Order
app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { amount, currency = 'USD' } = req.body; // Get from frontend
    
    const response = await paypalClient.orders.ordersCreate({
      requestBody: {
        intent: "CAPTURE",
        purchaseUnits: [{
          amount: {
            currencyCode: currency,
            value: amount.toFixed(2) // Ensure 2 decimal places
          }
        }]
      }
    });
    
    // Send order ID back to frontend for PayPal approval
    res.json({ 
      orderId: response.result.id,
      links: response.result.links 
    });
    
  } catch (error) {
    console.error('PayPal order creation failed:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// 🎯 Route: Capture PayPal Payment (after user approves)
app.post('/api/capture-paypal-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const response = await paypalClient.orders.ordersCapture({
      id: orderId,
      requestBody: {}
    });
    
    res.json({ 
      status: response.result.status,
      captureId: response.result.id,
      payer: response.result.payer 
    });
    
  } catch (error) {
    console.error('PayPal capture failed:', error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});