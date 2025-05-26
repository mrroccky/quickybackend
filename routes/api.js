const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');
const professionalController = require('../controllers/professionalController');

// Service routes
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);
router.post('/services', serviceController.createService);
router.put('/services/:id', serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.post('/check-phone', userController.checkUserByPhone);
router.put('/users/phone/:phone_number', userController.updateUserByPhone);

// Booking routes
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.post('/bookings', bookingController.createBooking);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);
router.get('/bookings/user/:userId', bookingController.getBookingsByUserId);

// Professional routes
router.get('/professionals/service/:serviceId', professionalController.getProfessionalByServiceId);
router.get('/professionals', professionalController.getAllProfessionals);
router.post('/professionals', professionalController.createProfessional);
router.put('/professionals/:id', professionalController.updateProfessional);
router.delete('/professionals/:id', professionalController.deleteProfessional);

module.exports = router;