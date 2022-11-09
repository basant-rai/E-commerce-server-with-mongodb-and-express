const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// return stripe to frontend
exports.sendStripeAPI = async(req,res) => {
    res.status(200).json({stripeAPIKey: process.env.STRIPE_API_KEY})
}

// processing payment
exports.processPayment = async(req,res) => {
    const PaymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'npr',
        metadata: {integration_check: "accept_a_payment"}
    })
    res.status(200).json({
        client_secret: PaymentIntent.client_secret
    })
}
    