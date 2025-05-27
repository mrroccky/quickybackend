const Payment = require('../models/payment');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { booking_id, payment_method, transaction_id, amount, status, user_id } = req.body;

    // Validate that user_id is an integer
    if (!Number.isInteger(Number(user_id))) {
      return res.status(400).json({ message: 'user_id must be an integer' });
    }

    // Validate that booking_id and transaction_id are strings
    if (typeof booking_id !== 'number' || typeof transaction_id !== 'string') {
      return res.status(400).json({ message: 'booking_id should be integer and transaction_id must be strings' });
    }

    // Validate amount is a number
    if (typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({ message: 'amount must be a number' });
    }

    const payment = await Payment.create({
      booking_id,
      payment_method,
      transaction_id,
      amount,
      status,
      user_id: Number(user_id),
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a payment
exports.updatePayment = async (req, res) => {
  try {
    const { payment_method, transaction_id, amount, status } = req.body;

    // Validate amount is a number
    if (amount && (typeof amount !== 'number' || isNaN(amount))) {
      return res.status(400).json({ message: 'amount must be a number' });
    }

    const updatedPayment = await Payment.update(req.params.id, { payment_method, transaction_id, amount, status });

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(204).json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};