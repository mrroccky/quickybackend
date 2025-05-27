const ServiceReview = require('../models/serviceReview');

// Create a new service review
exports.createServiceReview = async (req, res) => {
  try {
    const { rating, comment, service_id, user_id, professional_id } = req.body;

    // Validate that service_id, user_id, and professional_id are integers
    if (!Number.isInteger(Number(service_id)) || !Number.isInteger(Number(user_id)) || !Number.isInteger(Number(professional_id))) {
      return res.status(400).json({ message: 'service_id, user_id, and professional_id must be integers' });
    }

    const serviceReview = await ServiceReview.create({
      rating,
      comment,
      service_id: Number(service_id),
      user_id: Number(user_id),
      professional_id: Number(professional_id),
    });

    res.status(201).json(serviceReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all service reviews
exports.getAllServiceReviews = async (req, res) => {
  try {
    const serviceReviews = await ServiceReview.findAll();
    res.status(200).json(serviceReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single service review by ID
exports.getServiceReviewById = async (req, res) => {
  try {
    const serviceReview = await ServiceReview.findById(req.params.id);
    if (!serviceReview) {
      return res.status(404).json({ message: 'Service review not found' });
    }
    res.status(200).json(serviceReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a service review
exports.updateServiceReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedReview = await ServiceReview.update(req.params.id, { rating, comment });

    if (!updatedReview) {
      return res.status(404).json({ message: 'Service review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a service review
exports.deleteServiceReview = async (req, res) => {
  try {
    const deleted = await ServiceReview.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Service review not found' });
    }

    res.status(204).json({ message: 'Service review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};