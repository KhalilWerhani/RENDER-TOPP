import express from 'express';

import { createAppointment , getUserAppointments , getExpertAppointments , updateAppointmentStatus , deleteAppointment} from '../controllers/appointmentsController.js';


const appointmentRouter = express.Router();

// Create appointment
appointmentRouter.post('/', createAppointment);

// Get user appointments
appointmentRouter.get('/user/:userId', getUserAppointments);

// Get expert appointments
appointmentRouter.get('/expert/:expertId', getExpertAppointments);

// Update appointment status
appointmentRouter.put('/:id/status', updateAppointmentStatus);

// Delete appointment
appointmentRouter.delete('/:id', deleteAppointment);

export default appointmentRouter ;