const { Op } = require('sequelize'); 
const Flat = require('../models/Flat');
const Work = require('../models/Work'); 
const logger = require('../logger');

// Find Flat by partial match on the name

const getFlatAllData = async (req, res) => {  
  try {  
    const flatData = await Flat.findAll();    
    const dataValues = flatData.map(flat => flat.dataValues);
    if (dataValues.length === 0) {
      return res.status(404).json({ message: '指定された条件に一致する物件は見つかりませんでした' }); // No matching flat found
    }   
    res.status(200).json(dataValues); // 200 OK status for success
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); // Server error
  }
};

const changeFlat = async (req, res) => { 
  try {    
    const { id, name, address } = req.body; 
    if (!id) {
      return res.status(400).json({ message: '物件IDが必要です' });
    }
    const flat = await Flat.findByPk(id);
    if (!flat) {
      return res.status(404).json({ message: '物件が見つかりません' });
    }    

    // Log changes
    if (flat.name !== name && flat.address !== address) {
      logger.logInfo(`管理者によって ${flat.name} 物件の名前が ${name} に住所が ${flat.address} に変更されました。`, req.id, req.originalUrl, req.method, res.statusCode, req.user ? req.user.id : null, req.ip);
    } else if (flat.name === name && flat.address !== address) {
      logger.logInfo(`管理者によって ${flat.name} 物件の住所が ${flat.address} に変更されました。`, req.id, req.originalUrl, req.method, res.statusCode, req.user ? req.user.id : null, req.ip);
    }

    flat.name = name; 
    flat.address = address; 
    await flat.save();
    return res.status(200).json(flat); // Success message with updated flat
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); // Server error
  }
};

const createFlat = async (req, res) => {  
  try {
    const { name, address,works } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({ message: '全ての必須項目を入力してください' }); 
    }
    
    const newFlat = await Flat.create({ name, address });
    logger.logInfo(`${name} 物件が新規作成されました。`, req.id, req.originalUrl, req.method, res.statusCode, req.user ? req.user.id : null, req.ip);
    res.status(201).json(newFlat); 
    for (const work of works) {
      console.log(work);
      const startTime = new Date(); 
      const endTime = new Date();
      endTime.setMonth(endTime.getMonth() + 1);
  
      const newWork = await Work.create({
          work_name: work.workName,
          room_num: work.roomNum,
          flat_name: name,
          start_time: startTime,  
          end_time: endTime      
      });
  }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

const deleteFlat = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: '物件IDが必要です' }); 
    }
    const flatToDelete = await Flat.findOne({ where: { id } });
    if (!flatToDelete) {
      return res.status(404).json({ message: '物件を見つかりません' }); 
    }
    await Flat.destroy({ where: { id } });
    logger.logInfo(`${flatToDelete.name} 物件が削除されました。`, req.id, req.originalUrl, req.method, res.statusCode, req.user ? req.user.id : null, req.ip);
    res.status(200).json({ message: '物件が削除されました', flat: flatToDelete }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

module.exports = { 
    getFlatAllData, changeFlat, createFlat, deleteFlat
};
