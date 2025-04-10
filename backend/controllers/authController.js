const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const JWT_SECRET = 'your_secret_key'; // Store in an environment variable for production
const JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';
const logger = require('../logger');
// Register a new user
const register = async (req, res) => {
  try {
    const { name, phoneNum, email, password, address } = req.body;
    const existingUser = await User.findOne({ where: { email } });    
    if (existingUser) {
      logger.logError('存在している'+email+'で会員登録を試みました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
      return res.status(400).json({ message: 'ユーザーは既に存在します' });
    }
    
    if (!name || !phoneNum || !email || !password || !address) {
      return res.status(400).json({ message: '必須項目はすべて入力してください' });
    }
    
    const newUser = await User.create({ name, password, phoneNum,email,address});
    logger.logImportantInfo('新しい'+email+'会員登録に成功しました。許可を待っています。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
    res.status(201).json({ message: 'ユーザーが正常に作成されました' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

// Login user and generate a JWT token
const login = async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.logError('録されていない'+email+'でログインしようとしました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
      return res.status(400).json({ message: 'ユーザーが見つかりません' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.logError(email+'ユーザーがログインしようとしましたが、パスワードが一致しなかったため、ログインに失敗しました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
      return res.status(400).json({ message: '入力したパスワードが正しくありません。' });
    }
    
    if (user.permissionStatus === "inpermission") {
      logger.logError(email+'ユーザーがログインしようとしましたが、管理者から許可されていないため、ログインに失敗しました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
      return res.status(400).json({ message: 'あなたのアカウントは許可されていません。管理部が許可するまでしばらくお待ちください。' });
    }
    logger.logInfo(user.email+'加入者がログインに成功しました。', req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
    
    const accessToken  = jwt.sign({ id: user.id, useremail:user.email, username: user.name, role: user.role }, JWT_SECRET,{expiresIn:'10h'});
    const refreshToken  = jwt.sign({ id: user.id,useremail:user.email, username: user.name, role: user.role }, JWT_REFRESH_SECRET,{expiresIn:'10h'});
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    res.json({ message: 'ログインに成功しました', accessToken ,refreshToken,role:user.role });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.logError("存在しない"+email+"のパスワードリセット要請がありました。", req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
      return res.status(400).json({ message: 'ユーザーが見つかりません' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;  
    logger.logInfo(email+"のパスワードが"+password+"にリセットされました。", req.id, req.originalUrl, req.method, res.statusCode, req.user?req.user.id : null, req.ip);
    await user.save();  

    res.json({ message: 'パスワードのリセットに成功しました!' });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};


// Login user and generate a JWT token
const logout = async (req, res) => {
  try {
    // Clear the cookies by setting them with max-age = 0
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/', // Ensures the cookie is deleted from the root domain
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    res.json({ message: 'ログアウトに成功しました' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
};



module.exports = { register, login, resetPassword, logout };
