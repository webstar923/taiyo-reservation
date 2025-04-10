const { Sequelize,Op } = require('sequelize'); // Import the Op operator from Sequelize
const Flat = require('../models/Flat'); // Your Flat model
const Work = require('../models/Work');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const logger = require('../logger');

// Find Flat by partial match on the name
const findFlat = async (req, res) => {
  try {
    const { name } = req.body; // Extract name from the request body
    console.log('Received name:', name);

    // If no name is provided, return a 400 error
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Use Sequelize's Op.like to search for flats that partially match the name
    const flats = await Flat.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%` // Partial match with wildcards
        }
      }
    });

    if (flats.length === 0) {
      return res.status(404).json({ message: 'No flats found with that name' });
    }
    const dataValues = flats.map(flat => flat.dataValues);
    return res.status(200).json({dataValues}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const findReservation = async (req, res) => {
  try {
    const { reservation_id } = req.body; // Extract name from the request body   

    // If no name is provided, return a 400 error
    if (!reservation_id) {
      return res.status(400).json({ message: 'reservation_id is required' });
    }

    // Use Sequelize's Op.like to search for flats that partially match the name
    const reservations = await Reservation.findAll({
      where: {id: reservation_id }
    });

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found with that id' });
    }
    const dataValues = reservations.map(reservation => reservation.dataValues);
    return res.status(200).json({dataValues}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const findReservationByRoomNum = async (req, res) => {
  try {
    const { flat_name,room_num,work_name} = req.body; // Extract name from the request body   

    // If no name is provided, return a 400 error
    if (!flat_name) {
      return res.status(400).json({ message: 'flat_name is required' });
    }

 
    const reservations = await Reservation.findAll({
      where: {
        flat_name: flat_name,
        room_num: room_num,
        work_name: work_name,
        reservation_time: {
          [Op.gte]: Sequelize.fn('NOW')  // Corrected: Use 'NOW()' instead of 'CURRENT'
        }
      }
    });

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found with that id' });
    }
    const dataValues = reservations.map(reservation => reservation.dataValues);
    return res.status(200).json({dataValues}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const findChangeDate = async (req, res) => {
  try {
    const { reservation_id } = req.body; // Extract reservation_id from the request body   

    if (!reservation_id) {
      return res.status(400).json({ message: 'reservation_id is required' });
    }

    // Fetch the reservation
    const reservation = await Reservation.findOne({
      where: { id: reservation_id }
    });

    if (!reservation) {
      return res.status(404).json({ message: 'No reservation found with that id' });
    }   

    const { room_num, work_name, flat_name } = reservation.dataValues;
    const whereConditions = { flat_name, work_name, room_num };
    
    console.log("Search conditions:", whereConditions);

    // Find matching works
    const works = await Work.findAll({ where: whereConditions });

    if (works.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }

    // Ensure __getDatesBetween function exists
    if (typeof __getDatesBetween !== "function") {
      throw new Error("Function __getDatesBetween is not defined");
    }

    const allDates = works.flatMap(work => 
      __getDatesBetween(work.start_time, work.end_time)
    );

    // Find booked reservations
    const bookedReservations = await Reservation.findAll({ where: whereConditions });

    // Extract reserved dates safely
    const reservedDates = bookedReservations
      .filter(res => res.dataValues.reservation_time)
      .map(res => res.dataValues.reservation_time.toISOString().split('T')[0]);

    // Compute available dates
    const availableDates = allDates.filter(date => !reservedDates.includes(date));
    
    return res.status(200).json({ availableDates });

  } catch (err) {
    console.error("Error in findChangeDate:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatReservation = async (req, res) => {
 
  
  try {
    const { id,reservation_time,division,room_num,work_name,flat_name
    } = req.body; // Extract name from the request body   
    if (!id) {      
      return res.status(400).json({ message: 'id is required' });
    }
    
    const reservation = await Reservation.findByPk(id);    
    if (!reservation) {
      logger.logError('ユーザーから存在しない予約の変更要請がありました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
      return res.status(404).json({ message: 'Reservation not found' });
    }    
    
    reservation.reservation_time = reservation_time || reservation.reservation_time; 
    reservation.division = division || reservation.division;
    reservation.room_num = room_num || reservation.room_num;
    // reservation.user_name = user_name || reservation.user_name;
    reservation.work_name = work_name || reservation.work_name;
    reservation.flat_name = flat_name || reservation.flat_name;

    if (reservation.reservation_time !== reservation_time && reservation.division !== division) {
      logger.logImportantInfo('予約番号'+reservation.id+'の予約が予約日'+reservation_time+'に予約区分が'+division+'に変更されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip); 
      logger.logChangeInfo('予約番号'+reservation.id+'の予約が予約日'+reservation_time+'に予約区分が'+division+'に変更されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip); 
      
    } else if(reservation.reservation_time !== reservation_time && reservation.division === division) {
      logger.logImportantInfo('予約番号'+reservation.id+'の予約が予約日'+reservation_time+'に変更されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip); 
      logger.logChangeInfo('予約番号'+reservation.id+'の予約が予約日'+reservation_time+'に変更されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip); 
      
    }else if(reservation.reservation_time === reservation_time && reservation.division !== division){
      logger.logImportantInfo('予約番号'+reservation.id+'の予約区分が'+division+'に変更されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip); 
      logger.logChangeInfo('予約番号'+reservation.id+'の予約区分が'+division+'に変更されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip); 
    }else{
      logger.logImportantInfo('予約番号'+reservation.id+'の予約が管理者によって変更されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip); 

    }

    
    await reservation.save();

    return res.status(200).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const findWork = async (req, res) => {
  
  try {
    const { room_num, flat_name } = req.body;

    if (!room_num) {
      return res.status(400).json({ message: 'room_num is required' });
    }

    if (!flat_name) {
      return res.status(400).json({ message: 'flat_name is required' });
    }

    // Get the current time in the same format as the database (i.e., TIME type)
    const currentTime = new Date();
    
    // Set the where condition for Sequelize query
    const whereConditions = {
      flat_name: flat_name,
      room_num: room_num,      
    };
    // Query works using Sequelize
    const works = await Work.findAll({
      where: whereConditions,
    });
    
    // Check if no works are found
    if (works.length === 0) {
      return res.status(404).json({ message: 'No works found during the current time' });
    }

    // Return found works
    return res.status(200).json(works);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
const getChangeableDate = async (req, res) => {
  try {
    const {work_name,flat_name,room_num} = req.body; // Extract name from the request body   
    
    const whereConditions = {
      flat_name: flat_name,
      work_name: work_name,
      room_num : room_num,
    };
    
    const works = await Work.findAll({
      where: whereConditions,
    });

    if (works.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }
    const allDates = works.flatMap(work =>
      __getDatesBetween(work.start_time, work.end_time)
    );
    const bookedReservations = await Reservation.findAll({
      where: whereConditions,
    });
    const reservedDates = bookedReservations.flatMap(reservation => 
     reservation.dataValues.reservation_time.toISOString().split('T')[0]
    );
    const availableDates = allDates.filter(date => {
      return !reservedDates.includes(date);
    });
    return res.status(200).json({availableDates}); // Return the found flats as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
function __getDatesBetween(startTime, endTime) {
  const dates = [];
  let currentDate = new Date(); // Start from startTime  
  const end = new Date(endTime);
  while (currentDate.toISOString().split('T')[0] <= end.toISOString().split('T')[0]) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
const createReservation = async (req, res) => {  
  try {
    const {flat_name,room_num,work_name,reservation_time,division} = req.body;
    if (!flat_name || !room_num || !work_name || !reservation_time || !division) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    const newReservation = await Reservation.create({flat_name,room_num,work_name,reservation_time,division});
    logger.logImportantInfo('新しい予約が作成されました。'+'予約番号は'+newReservation.id+'です。', req.id, req.originalUrl, req.method, res.statusCode, "", req.ip); 
    res.status(201).json(newReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getReservations = async (req, res) => {  
  
  try {  
    const {flat_name,room_num} = req.body;
    const bookedReservations = await Reservation.findAll(
        {where:{
            flat_name:flat_name,
            room_num:room_num,
            reservation_time: {
              [Op.gte]: Sequelize.fn('NOW')  // Corrected: Use 'NOW()' instead of 'CURRENT'
            }
          }
        }); 

    const dataValues = bookedReservations.map(reservation => {
      const reservationTime = new Date(reservation.dataValues.reservation_time);
      const formattedDate = reservationTime.toISOString().split('T')[0]; 
      return {
        ...reservation.dataValues,
        reservation_time: formattedDate,
      };
    }); 
    if (dataValues.length === 0) {
      return res.status(404).json({ message: 'No matching works found for the given reservation' });
    }   
    res.status(201).json(dataValues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReservationListData = async (req, res) => {
  try {
    const { startTime, endTime } = req.body; 
    const start = new Date(startTime);
    const end = new Date(endTime);
    const bookedReservations = await Reservation.findAll({
      where: {      
        reservation_time: {
          [Op.between]: [start, end], 
        },
      },
    });
    const dataValues = bookedReservations.map((reservation) => {
      const reservationTime = new Date(reservation.dataValues.reservation_time);
      const formattedDate = reservationTime.toISOString().split('T')[0]; 
      return {
        ...reservation.dataValues,
        reservation_time: formattedDate,
      };
    });

    if (dataValues.length === 0) {
      return res.status(404).json({ message: 'No matching reservations found for the given time range' });
    }
    res.status(201).json(dataValues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.body;
   
    if (!id) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    const reservationToDelete = await Reservation.findOne({ where: { id } });
    if (!reservationToDelete) {
      return res.status(404).json({ message: '予約を見つかりません' });
    }
    await Reservation.destroy({ where: { id } });
    logger.logImportantInfo(reservationToDelete.id+'予約が削除されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
    res.status(200).json({ message: '予約が削除されました', reservation: reservationToDelete });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};
const getDashboardData = async (req, res) => {
  try {
    totalFlatItems = await Flat.count();
    totalWorkItems = await Work.count();
    totalUserItems = await User.count();
    totalReservationItems = await Reservation.count();

    const monthlyReservations = await Reservation.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('reservation_time'), '%Y-%m'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), '予約件数'],
      ],
      where: {
        reservation_time: {
          [Op.gte]: Sequelize.fn('DATE_SUB', Sequelize.fn('CURDATE'), Sequelize.literal('INTERVAL 13 MONTH')), // 現在から過去12ヶ月
          [Op.lte]: Sequelize.fn('CURDATE'), // 現在の日付
        },
      },
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('reservation_time'), '%Y-%m')],
      order: [[Sequelize.literal('month'), 'ASC']],
      raw: true, 
    });
    const todayReservations = await Reservation.findAll({
      where: {
        reservation_time: {
          [Op.eq]: Sequelize.fn('CURDATE'), // Match today's date
        },
      },
      raw: true, 
    });

    res.status(200).json({totalFlatItems,totalWorkItems,totalUserItems,totalReservationItems,monthlyReservations,todayReservations});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

module.exports = { 
  findFlat, findWork, findReservation, findChangeDate, 
  updatReservation,  getChangeableDate, createReservation,
   getReservations,getReservationListData,deleteReservation, 
   getDashboardData,findReservationByRoomNum};
