const express = require('express');
const sequelize = require('./config');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const flatRoutes = require('./routes/flatRoutes');
const workRoutes = require('./routes/workRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');
const { authenticate, authorizeRole } = require('./middleware/authMiddleware'); // Correct import
const { v4: uuidv4 } = require('uuid');

const cors = require('cors');
const multer = require('multer');
const { processExcel } = require('./excelService');
const app = express();
let tempFileNmae = "";
app.use(cors());
// Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    tempFileNmae = uniqueName;
    cb(null, uniqueName);  // This is where the server-stored filename is set
  },
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {  
  
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  if (path.extname(req.file.originalname)=== '.xlsx') {
    try {
      console.log("-----------------",req.file.path);
      
      const data = await processExcel(req.file.path);
      return res.json({ message: 'File processed successfully', data });
    } catch (error) {
      res.status(500).json({ message: 'Error processing file', error });
    }
  }  
});
app.post('/uploadFlatInfoFile', upload.single('file'), async (req, res) => {  
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  return res.status(200).json({
    message: 'File uploaded successfully',
    storedFileName: req.file.filename,
    filePath: path.join('uploads', req.file.filename)
  });
});
app.use((req, res, next) => {
  req.id = uuidv4(); // Generate a unique request ID
  next();
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/reservation',reservationRoutes);
app.use('/api/flat',flatRoutes);
app.use('/api/work',workRoutes);
app.use('/api/user',userRoutes);
app.use('/api/log',logRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


sequelize.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
