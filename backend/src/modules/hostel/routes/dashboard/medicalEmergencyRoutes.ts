// Routes file (routes/medicalEmergencies.ts)
import express from 'express';
import { getMedicalEmergencies, getMedicalEmergencyById, createMedicalEmergency, updateMedicalEmergency, deleteMedicalEmergency } from '../../controllers/dashboard/medicalEmergencyController';


const router = express.Router();

router.get('/hostel/medical-emergencies', getMedicalEmergencies);
router.get('/hostel/medical-emergencies/:id', getMedicalEmergencyById);
router.post('/hostel/medical-emergencies', createMedicalEmergency);
router.put('/hostel/medical-emergencies/:id', updateMedicalEmergency);
router.delete('/hostel/medical-emergencies/:id', deleteMedicalEmergency);

export default router;
