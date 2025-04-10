const express = require('express');
const { 
    getErrorData,getChangeData,getApiLogData,getNotificationNum,getNotificationData,getNotificationUpdate
     } = require('../controllers/logController');

const router = express.Router();

router.get('/getErrorData',getErrorData);
router.get('/getChangeData',getChangeData);
router.get('/getApiLogData/:pageNum/:searchTerm',getApiLogData);
router.get('/getNotificationNum',getNotificationNum);
router.get('/getNotification',getNotificationData);
router.get('/getNotification/:id',getNotificationUpdate);
module.exports = router;