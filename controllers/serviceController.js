const Service = require('../models/service_model');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.status(200).json(services);
  } catch (error) {
    console.error('GetAllServices Error:', error);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('GetServiceById Error:', error);
    res.status(500).json({ error: 'Failed to fetch service', details: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const serviceData = req.body;
    console.log('Received serviceData:', serviceData);
    if (!serviceData.service_title || !serviceData.description || !serviceData.service_type || 
        !serviceData.service_price || !serviceData.service_duration || !serviceData.category_id || 
        !serviceData.service_image) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const serviceId = await Service.create(serviceData);
    res.status(201).json({ service_id: serviceId });
  } catch (error) {
    console.error('CreateService Error:', error);
    res.status(400).json({ error: 'Failed to create service', details: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const serviceData = req.body;
    console.log('Received update serviceData:', serviceData);
    if (!serviceData.service_title || !serviceData.description || !serviceData.service_type || 
        !serviceData.service_price || !serviceData.service_duration || !serviceData.category_id || 
        !serviceData.service_image) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const updated = await Service.update(req.params.id, serviceData);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('UpdateService Error:', error);
    res.status(400).json({ error: 'Failed to update service', details: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    console.log(`Attempting to delete service with ID: ${serviceId}`);
    const deleted = await Service.delete(serviceId);
    if (!deleted) {
      console.warn(`Service with ID ${serviceId} not found for deletion`);
      return res.status(404).json({ error: 'Service not found' });
    }
    console.log(`Service with ID ${serviceId} deleted successfully`);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('DeleteService Error:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        error: 'Cannot delete service because it is referenced by other records (e.g., bookings or professionals)',
        details: error.message 
      });
    }
    res.status(500).json({ error: 'Failed to delete service', details: error.message });
  }
};