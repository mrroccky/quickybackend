const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');
const professionalController = require('../controllers/professionalController');
const serviceReviewController = require('../controllers/serviceReviewController');
const userReviewProfessionalController = require('../controllers/userReviewProfessionalController');
const paymentController = require('../controllers/paymentController');

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


// Service review routes
router.post('/servicereview', serviceReviewController.createServiceReview);
router.get('/servicereview/', serviceReviewController.getAllServiceReviews);
router.get('/servicereview/:id', serviceReviewController.getServiceReviewById);
router.get('/servicereview/service/:service_id', serviceReviewController.getReviewsByServiceId);
router.put('/servicereview/:id', serviceReviewController.updateServiceReview);
router.delete('/servicereview/:id', serviceReviewController.deleteServiceReview);


// User review for professionals routes
router.post('/user-review-prof', userReviewProfessionalController.createUserReviewProfessional);
router.get('/user-review-prof/', userReviewProfessionalController.getAllUserReviewsProfessionals);
router.get('/user-review-prof/:id', userReviewProfessionalController.getUserReviewProfessionalById);
router.put('/user-review-prof/:id', userReviewProfessionalController.updateUserReviewProfessional);
router.delete('/user-review-prof/:id', userReviewProfessionalController.deleteUserReviewProfessional);

//payment routes
router.post('/payment', paymentController.createPayment);
router.get('/payment/', paymentController.getAllPayments);
router.get('/payment/:id', paymentController.getPaymentById);
router.put('/payment/:id', paymentController.updatePayment);
router.delete('/payment/:id', paymentController.deletePayment);

module.exports = router;