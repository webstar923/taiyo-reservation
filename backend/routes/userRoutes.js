const express = require('express');
const { 
    getUserAllData, createUser,changeUser,deleteUser
     } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');


const router = express.Router();


router.get('/getAllData',getUserAllData);
router.post('/changeUser',changeUser);
router.post('/createUser',createUser);
router.post('/deleteUser',deleteUser);






module.exports = router;
