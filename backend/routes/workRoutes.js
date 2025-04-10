const express = require('express');
const { 
    getWorkAllData, createWork,changeWork,deleteWork
     } = require('../controllers/workController');
const authenticate = require('../middleware/authMiddleware');


const router = express.Router();


router.get('/getAllData',getWorkAllData);
router.post('/changeWork',changeWork);
router.post('/createWork',createWork);
router.post('/deleteWork',deleteWork);






module.exports = router;
