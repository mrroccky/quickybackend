const UserReviewProfessional = require('../models/userReviewProfessional');

// Create a new user review for a professional
exports.createUserReviewProfessional = async (req, res) => {
  try {
    const { booking_id, user_id, professional_id, rating, review_text } = req.body;

    // Validate that user_id, professional_id, and booking_id are integers
    if (
      !Number.isInteger(Number(user_id)) ||
      !Number.isInteger(Number(professional_id)) ||
      !Number.isInteger(Number(booking_id))
    ) {
      return res.status(400).json({ message: 'user_id, professional_id, and booking_id must be integers' });
    }

    const userReview = await UserReviewProfessional.create({
      booking_id: Number(booking_id),
      user_id: Number(user_id),
      professional_id: Number(professional_id),
      rating,
      review_text,
    });

    res.status(201).json(userReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other functions remain the same
exports.getAllUserReviewsProfessionals = async (req, res) => {
  try {
    const userReviews = await UserReviewProfessional.findAll();
    res.status(200).json(userReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserReviewProfessionalById = async (req, res) => {
  try {
    const userReview = await UserReviewProfessional.findById(req.params.id);
    if (!userReview) {
      return res.status(404).json({ message: 'User review not found' });
    }
    res.status(200).json(userReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserReviewProfessional = async (req, res) => {
  try {
    const { rating, review_text } = req.body;
    const updatedReview = await UserReviewProfessional.update(req.params.id, { rating, review_text });

    if (!updatedReview) {
      return res.status(404).json({ message: 'User review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserReviewProfessional = async (req, res) => {
  try {
    const deleted = await UserReviewProfessional.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User review not found' });
    }

    res.status(204).json({ message: 'User review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};