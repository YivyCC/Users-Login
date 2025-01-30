import * as userServices from "../services/userServices.js";

export const getUsers = async(req, res) =>{
  try{
    const users = await userServices.getUsers();
    res.status(200).json(users);
  } catch (err){
    console.error("Error fetching users:", err);
    res.status(500).json({ message: 'Internal server error.'});
  }
};

export const createUser = async(req, res) =>{
  try{
    const userData = req.body;
    const newUser = await userServices.createUser(userData);
    res.status(200).json(newUser);
  } catch (err){
    console.error("Error adding users:", err);
    res.status(500).json({ message: 'Internal server error.'});
  }
};

export const updateUser = async(req, res) =>{
  try{
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = await userServices.updateUser(userId, userData);
    if (!updatedUser){
      return res.status(404).json({message:"User not found"});
    }
    res.status(200).json(updatedUser);

  } catch (err){
    console.error("Error updating users:", err);
    res.status(500).json({ message: 'Internal server error.'});
  }
};

export const deleteUser = async(req, res) =>{
  try{
    const userId = req.params.id;
    const deleted = await userServices.deleteUser(userId);
    if (!deleted){
      return res.status(404).json({message:"User not found"});
    }
    
    res.status(200).send();

  } catch (err){
    console.error("Error deleting users:", err);
    res.status(500).json({ message: 'Internal server error.'});
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginResult = await userServices.loginUser(email, password);

    if (loginResult.success) {
      res.status(200).json({ success: true, message: 'Login successful', user: loginResult.user });
    } else {
      res.status(401).json({ success: false, message: loginResult.message });
    }
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
};

// Update user status and last login time
export const updateLoginDetails = async (req, res) => {
  const { email } = req.body;

  try {
    const updatedUser = await userServices.updateLoginDetails(email);
    if (updatedUser) {
      res.status(200).json({ success: true, message: 'User status updated' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating login details:', err);
    res.status(500).json({ success: false, message: 'Error updating login details' });
  }
};

// Update user status and last login time
export const updateIsActiveOffline = async (req, res) => {
  const { email } = req.body;

  try {
    const updatedUser = await userServices.updateIsActiveOffline(email);
    if (updatedUser) {
      res.status(200).json({ success: true, message: 'User status updated' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating login details:', err);
    res.status(500).json({ success: false, message: 'Error updating login details' });
  }
};

// Controller for bulk actions (block, unblock, delete users)
export const bulkActionController = async (req, res) => {
  const { action, users } = req.body;

  try {
    const result = await userServices.bulkActionOnUsers(action, users);

    if (result) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Failed to perform action' });
    }
  } catch (error) {
    console.error('Error performing bulk action:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserByEmailController = async (req, res) => {
  const { email } = req.params;
  console.log('Requested email:', email);
  try {
    const user = await userServices.getUserByEmail(email);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};


