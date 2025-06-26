import express from 'express';
import * as UserController from '../controllers/UserController.js';


const userroutes = express.Router();



userroutes.post('/signup', UserController.Signup);
userroutes.post('/login', UserController.Login);

export default userroutes;