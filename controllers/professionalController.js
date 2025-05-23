const Service = require('../models/service_model');
const Professional = require('../models/professional_model');
exports.getProfessionalByServiceId = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const professionalId = await Service.getProfessionalByServiceId(serviceId);
    
    if (!professionalId) {
      return res.status(404).json({ error: 'No professional found for this service' });
    }
    
    res.status(200).json({ professional_id: professionalId });
  } catch (error) {
    console.error('GetProfessionalByServiceId Error:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.getAll();
    res.status(200).json(professionals);
  } catch (error) {
    console.error('GetAllProfessionals Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createProfessional = async (req, res) => {
  try {
    const professionalData = req.body;
    console.log('Received professionalData:', professionalData); // Debug log
    const professionalId = await Professional.create(professionalData);
    res.status(201).json({ professional_id: professionalId });
  } catch (error) {
    console.error('CreateProfessional Error:', error);
    res.status(400).json({ error: error.message });
  }
};