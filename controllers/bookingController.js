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
    const bookingData = req.body;
    const updated = await Booking.update(req.params.id, bookingData);
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
    const deleted = await Booking.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('DeleteBooking Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// New method: Get bookings by user_id
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