const User = require('../models/user_model');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('GetAllUsers Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('GetUserById Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    // Validate required fields
    if (!userData.first_name || !userData.last_name || !userData.email || 
        !userData.phone_number || !userData.password) {
      return res.status(400).json({ error: 'First name, last name, email, phone number, and password are required' });
    }
    const userId = await User.create(userData);
    res.status(201).json({ user_id: userId });
  } catch (error) {
    console.error('CreateUser Error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userData = req.body;
    // Validate required fields
    if (!userData.first_name || !userData.last_name || !userData.email || 
        !userData.phone_number) {
      return res.status(400).json({ error: 'First name, last name, email, and phone number are required' });
    }
    const updated = await User.update(req.params.id, userData);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('UpdateUser Error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DeleteUser Error:', error);
    res.status(500).json({ error: error.message });
  }
};