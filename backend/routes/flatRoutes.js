const express = require('express');
const { 
    getFlatAllData,changeFlat,createFlat,deleteFlat
     } = require('../controllers/flatController');

const router = express.Router();

// search Flat name
router.get('/getAllData',getFlatAllData);
router.post('/changeflat',changeFlat);
router.post('/createflat',createFlat);
router.post('/deleteFlat',deleteFlat);






module.exports = router;
