const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();

// - Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// - API routes
app.get('/', (req, res) =>
	res.status(200).json({
		message: 'success',
	})
);

app.post('/payments/create', async (req, res) => {
	const total = parseInt(req.query.total);

	if (total > 0) {
		// console.log('Payment Request Received  ', total);

		const paymentIntent = await stripe.paymentIntents.create({
			amount: total,
			currency: 'usd',
		});
		res.status(201).send({
			clientSecret: paymentIntent.client_secret,
		});
	} else {
		res.status(401).json({
			message: 'invalid amount',
		});
	}
});

app.listen(process.env.PORT || 5000, () => {
	console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
