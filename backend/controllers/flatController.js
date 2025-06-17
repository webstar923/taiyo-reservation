const { Op } = require('sequelize'); 
const Flat = require('../models/Flat');
const Work = require('../models/Work'); 
const logger = require('../logger');
const FlatDetailInfo = require('../models/Flat_detail_info');

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
    
    await FlatDetailInfo.destroy({where:{flat_id:id}});
    await Flat.destroy({ where: { id } });
    logger.logInfo(`${flatToDelete.name} 物件が削除されました。`, req.id, req.originalUrl, req.method, res.statusCode, req.user ? req.user.id : null, req.ip);
    res.status(200).json({ message: '物件が削除されました', flat: flatToDelete }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

const changeFlatDetailInfo = async (req, res) => {
  try {
    const {
      flat_id,
      parking_location,
      water_tap_location,
      building_structure,
      auto_lock_number,
      key_box_exists,
      key_box_location,
      manager_work_days,
      start_time,
      end_time,
      tel_number,
      fax_number,
      machine_location,
    } = req.body;
    
    if (!flat_id) {
      return res.status(400).json({ message: '物件IDが必要です' });
    }

    let flatDetailInfo = await FlatDetailInfo.findOne({ where: { flat_id } });
    
    if (!flatDetailInfo) {
      // Create new record if not found
      flatDetailInfo = await FlatDetailInfo.create({
        flat_id,
        parking_location,
        water_tap_location,
        building_structure,
        auto_lock_number,
        key_box_exists,
        key_box_location,
        manager_work_days,
        start_time,
        end_time,
        tel_number,
        fax_number,
        machine_location,
      });

      logger.logInfo(`新しい物件詳細情報が作成されました。`, req.id, req.originalUrl, req.method, 201, req.user ? req.user.id : null, req.ip);
      return res.status(201).json({ message: '物件詳細情報が作成されました', flatDetailInfo });
    }

    // Update existing record
    flatDetailInfo.parking_location = parking_location;
    flatDetailInfo.water_tap_location = water_tap_location;
    flatDetailInfo.building_structure = building_structure;
    flatDetailInfo.auto_lock_number = auto_lock_number;
    flatDetailInfo.key_box_exists = key_box_exists;
    flatDetailInfo.key_box_location = key_box_location;
    flatDetailInfo.manager_work_days = manager_work_days;
    flatDetailInfo.start_time = start_time;
    flatDetailInfo.end_time = end_time;
    flatDetailInfo.tel_number = tel_number;
    flatDetailInfo.fax_number = fax_number;
    flatDetailInfo.machine_location = machine_location;
    await flatDetailInfo.save();

    logger.logInfo(`物件詳細情報が更新されました。`, req.id, req.originalUrl, req.method, 200, req.user ? req.user.id : null, req.ip);
    res.status(200).json({ message: '物件詳細情報が更新されました', flatDetailInfo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

const getFlatDetailInfoByflatId = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!id) {
      return res.status(400).json({ message: '物件IDが必要です' });
    }

    // 2. Fetch flat detail info from DB
    const flatDetailInfo = await FlatDetailInfo.findOne({
      where: { flat_id: id },
    });

    // 3. If not found, return "created" message, even though it doesn't actually insert
    if (!flatDetailInfo) {
      logger.logInfo(
        `物件詳細情報が存在しません。`,
        req.id,
        req.originalUrl,
        req.method,
        201,
        req.user ? req.user.id : null,
        req.ip
      );
      return res.status(201).json({
        message: '物件詳細情報が存在しません（新規作成可能）',
        flatDetailInfo: null,
      });
    }

    // 4. If found, return data
    return res.status(200).json({
      message: '物件詳細情報が取得されました',
      flatDetailInfo,
    });
  } catch (err) {
    console.error('[getFlatDetailInfoByflatId] Error:', err);

    // Handle Sequelize DB column error specifically
    if (err.name === 'SequelizeDatabaseError' && err.parent?.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        message: `データベースエラー：存在しないカラムにアクセスしています（例：'manager_days'）`,
        detail: err.message,
      });
    }

    return res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};



module.exports = { 
    getFlatAllData, changeFlat, createFlat, deleteFlat,changeFlatDetailInfo,getFlatDetailInfoByflatId
};
