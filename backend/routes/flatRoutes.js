const express = require('express');
const { 
    getFlatAllData,changeFlat,createFlat,deleteFlat,changeFlatDetailInfo,getFlatDetailInfoByflatId
     } = require('../controllers/flatController');

const router = express.Router();

// search Flat name
router.get('/getAllData',getFlatAllData);
router.get('/getFlatDetailInfoByflatId/:id',getFlatDetailInfoByflatId)
router.post('/changeflat',changeFlat);
router.post('/createflat',createFlat);
router.post('/deleteFlat',deleteFlat);
router.post('/changeFlatDetailInfo',changeFlatDetailInfo);



module.exports = router;
