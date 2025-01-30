import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Retrieve user data
router.get('/users', userController.getUsers);

// Register new user
router.post('/registerNewUser', userController.createUser);

// Update user by id
router.put('/users/:id', userController.updateUser);

// Delete user
router.delete('/users/:id', userController.deleteUser);

// Login User
router.post('/login', userController.loginController);

// Update user status and last login time after login
router.put('/updateLoginDetails', userController.updateLoginDetails);

// Update user status and last login time after login
router.put('/updateIsActiveOffline', userController.updateIsActiveOffline);

// POST route for bulk action (block, unblock, delete)
router.post('/bulk-action', userController.bulkActionController);

// Get user by email
router.get('/users/:email', userController.getUserByEmailController);

export default router; 