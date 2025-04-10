const Work = require('../models/Work');
const logger = require('../logger');

// Get all work data
const getWorkAllData = async (req, res) => {  
  try {  
    const workData = await Work.findAll();    
    const dataValues = workData.map(work => work.dataValues);
    
    // If no work data is found, return a 404 response
    if (dataValues.length === 0) {
      return res.status(404).json({ message: '指定された予約に一致する案件は見つかりませんでした' });
    }   
    
    res.status(200).json(dataValues);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

// Change work data (update work record)
const changeWork = async (req, res) => {
  try {
    const { id, work_name, flat_name, room_num, start_time, end_time } = req.body;

    // Check if the work ID is provided
    if (!id) {
      return res.status(400).json({ message: '案件IDは必須です' });
    }

    // Find the work record by primary key (id)
    const changeWork = await Work.findByPk(id);
    if (!changeWork) {
      return res.status(404).json({ message: '案件が見つかりませんでした' });
    }

    // Update the fields of the work record
    changeWork.work_name = work_name;
    changeWork.flat_name = flat_name;
    changeWork.room_num = room_num;
    changeWork.start_time = start_time;
    changeWork.end_time = end_time;

    await changeWork.save();

    logger.logInfo('管理者によって' + changeWork.work_name + '案件が変更されました。', req.id || 'unknown', req.originalUrl || '', req.method, res.statusCode, '', req.ip);

    return res.status(200).json(changeWork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

// Create a new work record
const createWork = async (req, res) => {  
  try {
    const { work_name, flat_name, room_num, start_time, end_time } = req.body;

    // Check if all required fields are provided
    if (!work_name || !flat_name || !room_num || !start_time || !end_time) {
      return res.status(400).json({ message: 'すべての必須フィールドを入力してください' });
    }

    // Create a new work record in the database
    const newWork = await Work.create({ work_name, flat_name, room_num, start_time, end_time });

    logger.logInfo('管理者によって' + newWork.work_name + '案件が登録されました。', req.id || 'unknown', req.originalUrl || '', req.method, res.statusCode, '', req.ip);

    res.status(201).json(newWork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

// Delete a work record
const deleteWork = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the work ID is provided
    if (!id) {
      return res.status(400).json({ message: '案件IDは必須です' });
    }

    // Find the work record by ID
    const WorkToDelete = await Work.findOne({ where: { id } });
    if (!WorkToDelete) {
      return res.status(404).json({ message: '案件が見つかりませんでした' });
    }

    // Destroy the work record (delete it from the database)
    await Work.destroy({ where: { id } });

    logger.logInfo('管理者によって' + WorkToDelete.work_name + '案件が削除されました。', req.id || 'unknown', req.originalUrl || '', req.method, res.statusCode, '', req.ip);

    res.status(204).json({ message: `案件ID ${id} は正常に削除されました` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

module.exports = { 
  getWorkAllData, changeWork, createWork, deleteWork
};
