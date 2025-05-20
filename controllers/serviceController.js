const Service = require('../models/service_model');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.status(200).json(services);
  } catch (error) {
    console.error('GetAllServices Error:', error);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const serviceData = req.body;
    // Validate required fields
    if (!serviceData.service_title || !serviceData.description || !serviceData.service_type || 
        !serviceData.service_price || !serviceData.service_duration || !serviceData.category_id) {
      return res.status(400).json({ error: 'All fields except service_image are required' });
    }
    const serviceId = await Service.create(serviceData);
    res.status(201).json({ service_id: serviceId });
  } catch (error) {
    console.error('CreateService Error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const serviceData = req.body;
    // Validate required fields
    if (!serviceData.service_title || !serviceData.description || !serviceData.service_type || 
        !serviceData.service_price || !serviceData.service_duration || !serviceData.category_id) {
      return res.status(400).json({ error: 'All fields except service_image are required' });
    }
    const updated = await Service.update(req.params.id, serviceData);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('UpdateService Error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('DeleteService Error:', error);
    res.status(500).json({ error: error.message });
  }
};