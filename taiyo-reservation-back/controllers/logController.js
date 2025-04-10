const { Op } = require('sequelize'); // Import the Op operator from Sequelize
const Log = require('../models/Log');
const limit = 10; 

const getErrorData = async (req, res) => {  
  try {  
    const ErrorData = await Log.findAll({
        where: {
          level: 'error'
        },
        attributes: ['id', 'level', 'message', 'timestamp'],
      });    

    const dataValues = ErrorData.map(error => error.dataValues);
    if (dataValues.length === 0) {
      return res.status(404).json({ message: '指定された条件に一致するエラーログは見つかりませんでした' }); // No matching error logs found
    }   
    
    res.status(201).json(dataValues);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

const getChangeData = async (req, res) => {  
  try {  
    const ChangeData = await Log.findAll({
        where: {
          level: 'change'
        },
        attributes: ['id', 'level', 'message', 'timestamp'],
      });    

    const dataValues = ChangeData.map(data => data.dataValues);
    if (dataValues.length === 0) {
      return res.status(404).json({ message: '指定された条件に一致する変更ログは見つかりませんでした' }); // No matching change logs found
    }   
    
    res.status(201).json(dataValues);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

const getApiLogData = async (req, res) => {  
  const { pageNum, searchTerm } = req.params;
  const limit = 10;  // Or you can pass it as a query parameter
  const offset = (pageNum - 1) * limit;
  try {
    let apiLogData;
    let totalItems;

    if (searchTerm === "!allData!") {
      // If searchTerm is '!allData!', return all logs without filtering
      apiLogData = await Log.findAll({
        attributes: ['id', 'level', 'message', 'timestamp','readStatus','endpoint','method','status_code','user_id','ip_address','request_id' ],
        limit: limit,
        offset: offset,
      });
      totalItems = await Log.count();  // Get total count of logs without search filter
    } else {
      // Otherwise, filter by searchTerm
      apiLogData = await Log.findAll({
        where: {
          message: {
            [Op.like]: `%${searchTerm}%`, // Partial match with wildcards
          },
        },
        attributes: ['id', 'level', 'message', 'timestamp','readStatus','endpoint','method','status_code','user_id','ip_address','request_id' ],
        limit: limit,
        offset: offset,
      });
      totalItems = await Log.count({
        where: {
          message: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      });  // Get count for logs matching search term
    }

    const totalPages = Math.ceil(totalItems / limit);
    const dataValues = apiLogData.map(data => data.dataValues);

    if (dataValues.length === 0) {
      return res.status(404).json({ message: '指定された条件に一致するAPIログは見つかりませんでした' }); 
    }

    res.status(200).json({
      data: dataValues,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: totalItems,
      },
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

const getNotificationNum = async (req, res) => {  
  try {  
    const NotificationNum = await Log.count({
      where: {
        level: 'important',
        readStatus:'unread'
      }
    });
    const MessageNum = await Log.count({
      where: {
        level: 'info',
        readStatus:'unread'
      }
    });        

    res.status(201).json({NotificationNum, MessageNum});
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

const getNotificationData = async (req, res) => {  
  try {  
    const notificationData = await Log.findAll({
      where: {
        level: 'important',
        readStatus: 'unread'
      },
      attributes: ['id', 'level', 'message', 'timestamp'],
    });

    res.status(200).json({ notificationData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

const getNotificationUpdate = async (req, res) => {  
  try {  

    const Notification = await Log.findByPk(req.params.id);
    Notification.readStatus = "read";
    await Notification.save();
    res.status(200).json({ Notification });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' }); 
  }
};

module.exports = { 
    getErrorData, getChangeData, getApiLogData, getNotificationNum, getNotificationData, getNotificationUpdate
};
