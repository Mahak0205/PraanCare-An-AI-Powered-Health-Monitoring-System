const express = require('express');
const router = express.Router(); 
const {checkInfoComplete, updateUser, getUserInfo, editUserProfile, retakePersonality} = require('../controllers/userController');
const {predictAnxiety,predictDepression,predictStress, getMentalHistory} = require('../controllers/mentalPredictController')
const {predictSleep} = require('../controllers/sleepPredictController');
const { protect } = require('../middleware/authMiddleware');
const { getSleepHistory, deleteSleepHistory } = require('../controllers/sleepPredictController');
const { sendSleepReportByEmail, sendMentalReportByEmail, sendEyeReportByEmail, sendCardiacReportByEmail } = require('../controllers/emailController');
const{ sleepAssistant, mentalAssistant, eyeAssistant, cardiacAssistant } = require('../controllers/assistantController');
const { predictEye, getEyeHistory, deleteEyeHistory } = require('../controllers/eyePredictController');
const { predictCardiac, getCardiacHistory, deleteCardiacHistory } = require('../controllers/cardiacPredictController');

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


//profile routes--------------
router.get('/checkInfoComplete', protect, checkInfoComplete);
router.patch('/update-basic-info', protect, updateUser);
router.patch('/update-personality', protect, updateUser);
router.get('/profile/:patientId', protect, getUserInfo);
router.put('/update/:patientId', protect, editUserProfile);
router.put('/update/retake-personality-test/:patientId', protect, retakePersonality);


//Mental health routes--------------
router.get('/mental/history/:patientId',protect, getMentalHistory);
router.delete('/mental/history/:patientId',protect, deleteSleepHistory);
router.get('/mental/progress/:patientId', protect, getMentalHistory);
router.post('/mental/send-report/:patientId', protect,upload.single("pdf"), sendMentalReportByEmail);
//Anxiety prediction routes
router.post('/predict/anxiety', protect, predictAnxiety);
//Depression prediction routes
router.post('/predict/depression', protect, predictDepression);
//Stress prediction routes
router.post('/predict/stress', protect, predictStress);


//sleep prediction routes---------------
router.post('/predict/sleep', protect, predictSleep);
router.get('/sleep/history/:patientId',protect, getSleepHistory);
router.delete('/sleep/history/:patientId',protect, deleteSleepHistory);
router.get('/sleep/progress/:patientId', protect, getSleepHistory);
router.post('/sleep/send-report/:patientId', protect,upload.single("pdf"), sendSleepReportByEmail);


//Eye health prediction routes--------------
router.post('/predict/eye', protect, predictEye);
router.get('/eye/history/:patientId', protect, getEyeHistory); // Reusing getSleepHistory for eye history
router.delete('/eye/history/:patientId', protect, deleteEyeHistory);
router.get('/eye/progress/:patientId', protect, getEyeHistory);
router.post('/eye/send-report/:patientId', protect, upload.single("pdf"), sendEyeReportByEmail);


// Cardiac health routes
router.post('/predict/cardiac', protect, predictCardiac);
router.get('/cardiac/history/:patientId', protect, getCardiacHistory);
router.delete('/cardiac/history/:patientId', protect, deleteCardiacHistory);
router.get('/cardiac/progress/:patientId', protect, getCardiacHistory);
router.post('/cardiac/send-report/:patientId', protect, upload.single("pdf"), sendCardiacReportByEmail);


//Assistant routes
router.post('/assistant/sleep/:patientId', protect, sleepAssistant);
router.post('/assistant/mental/:patientId', protect, mentalAssistant);
router.post('/assistant/eye/:patientId', protect, eyeAssistant);
router.post('/assistant/cardiac/:patientId', protect, cardiacAssistant);
module.exports = router;

