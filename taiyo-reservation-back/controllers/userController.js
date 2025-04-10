const User = require('../models/User');
const logger = require('../logger');

// Get all user data
const getUserAllData = async (req, res) => {  
  try {  
    const userData = await User.findAll();    
    const dataValues = userData.map(user => user.dataValues);
    
    // If no user data is found, return a 404 response
    if (dataValues.length === 0) {
      return res.status(404).json({ message: '指定された予約に一致するユーザーは見つかりませんでした' });
    }   
    
    res.status(200).json(dataValues);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

// Change user data (update user record)
const changeUser = async (req, res) => {
  try {
    const { id, name, email, phoneNum, address, role, permissionStatus } = req.body;

    // Check if the user ID is provided
    if (!id) {
      return res.status(400).json({ message: 'ユーザーIDは必須です' });
    }

    // Find the user record by primary key (id)
    const user = await User.findByPk(id);  

    // If user not found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
    }

    // Update the user fields
    user.name = name; 
    user.email = email; 
    user.phoneNum = phoneNum; 
    user.address = address; 
    user.role = role; 
    user.permissionStatus = permissionStatus === "許可" ? 1 : 0 ;

    // Save the updated user
    await user.save();

    logger.logInfo(req.user.useremail + ' 管理者によって ' + user.email + ' ユーザーの情報が変更されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user ? req.user.id : null, req.ip);

    // Return the updated user data in response
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, password, email, phoneNum, address, role } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !phoneNum || !address || !role) {
      return res.status(400).json({ message: 'すべての必須フィールドを入力してください' });
    }

    // Create a new user record
    const newUser = await User.create({ name, password, email, phoneNum, address, role });

    logger.logInfo(req.user.useremail + ' 管理者によって新しい ' + newUser.email + ' ユーザーが登録されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user ? req.user.id : null, req.ip);

    // Return the newly created user in response
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

// Delete a user record
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the user ID is provided
    if (!id) {
      return res.status(400).json({ message: 'ユーザーIDは必須です' });
    }

    // Find the user to delete by ID
    const UserToDelete = await User.findOne({ where: { id } });

    // If user not found, return a 404 response
    if (!UserToDelete) {
      return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
    }

    // Destroy the user record (delete it from the database)
    await User.destroy({ where: { id } });

    logger.logInfo(req.user.useremail + ' 管理者によって ' + UserToDelete.email + ' ユーザーが削除されました。', req.id, req.originalUrl, req.method, res.statusCode, req.user ? req.user.id : null, req.ip);

    // Return a success response
    res.status(200).json({ message: 'ユーザーは正常に削除されました', User: UserToDelete });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

module.exports = { 
  getUserAllData, changeUser, createUser, deleteUser
};
