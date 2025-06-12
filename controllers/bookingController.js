const Booking = require('../models/bookings_model');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('GetAllBookings Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingBookings = async (req, res) => {
  try {
    const professionalId = parseInt(req.query.professionalId, 10);
    if (!professionalId || isNaN(professionalId)) {
      return res.status(400).json({ error: 'Valid professionalId is required' });
    }
    const bookings = await Booking.getPending(professionalId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('GetPendingBookings Error:', {
      message: error.message,
      stack: error.stack,
      professionalId: req.query.professionalId
    });
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.getById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('GetBookingById Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const bookingId = await Booking.create(bookingData);
    res.status(201).json({ booking_id: bookingId });
  } catch (error) {
    console.error('CreateBooking Error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const bookingData = req.body;

    if (bookingData.status === 'accepted') {
      const booking = await Booking.getById(bookingId);
      if (booking && booking.status === 'accepted' && booking.professional_id && booking.professional_id !== bookingData.professional_id) {
        return res.status(400).json({ error: 'Booking already accepted by another professional' });
      }
      // Ensure professional_id is provided for acceptance
      if (!bookingData.professional_id || isNaN(parseInt(bookingData.professional_id, 10))) {
        return res.status(400).json({ error: 'Valid professional_id is required for acceptance' });
      }
    }

    const updated = await Booking.update(bookingId, bookingData);
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('UpdateBooking Error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { professionalId } = req.body;
    if (!professionalId) {
      return res.status(400).json({ error: 'professionalId is required' });
    }
    const rejected = await Booking.rejectBooking(req.params.id, professionalId);
    if (!rejected) {
      return res.status(404).json({ error: 'Booking not found or already rejected' });
    }
    res.status(200).json({ message: 'Booking rejected successfully' });
  } catch (error) {
    console.error('DeleteBooking Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.getByUserId(userId);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: 'No bookings found for this user' });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error('GetBookingsByUserId Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;