const express = require("express");
const { processPayment, sendStripeAPI } = require("../Controller/paymentController");
const router = express.Router();

router.post('/processpayment',processPayment);
router.get('/stripeAPIKey',sendStripeAPI);

module.exports = router;