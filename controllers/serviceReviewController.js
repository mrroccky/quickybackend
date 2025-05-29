const ServiceReview = require('../models/serviceReview');

// Create a new service review
exports.createServiceReview = async (req, res) => {
  try {
    const { rating, comment, service_id, user_id, professional_id, booking_id } = req.body;

    // Validate that service_id, user_id, professional_id, and booking_id are integers
    if (
      !Number.isInteger(Number(service_id)) ||
      !Number.isInteger(Number(user_id)) ||
      !Number.isInteger(Number(professional_id)) ||
      !Number.isInteger(Number(booking_id))
    ) {
      return res.status(400).json({ message: 'service_id, user_id, professional_id, and booking_id must be integers' });
    }

    const serviceReview = await ServiceReview.create({
      rating,
      comment,
      service_id: Number(service_id),
      user_id: Number(user_id),
      professional_id: Number(professional_id),
      booking_id: Number(booking_id),
    });

    res.status(201).json(serviceReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other functions remain the same
exports.getAllServiceReviews = async (req, res) => {
  try {
    const serviceReviews = await ServiceReview.findAll();
    res.status(200).json(serviceReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getServiceReviewById = async (req, res) => {
  try {
    const serviceReview = await ServiceReview.findById(req.params.id);
    if (!serviceReview) {
      return res.status(404).jsonme.status(404).json({ message: 'Service review not found' });
    }
    res.status(200).json(serviceReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByServiceId = async (req, res) => {
  try {
    const service_id = req.params.service_id;
    if (!Number.isInteger(Number(service_id))) {
      return res.status(400).json({ message: 'service_id must be an integer' });
    }

    const reviews = await ServiceReview.findByServiceId(service_id);
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this service' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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