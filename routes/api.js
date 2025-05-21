const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const userController = require('../controllers/userController');

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

module.exports = router;