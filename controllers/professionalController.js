const Service = require('../models/service_model');

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