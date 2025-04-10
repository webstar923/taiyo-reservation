const XLSX = require('xlsx');
const fs = require('fs');
const Reservation = require('./models/Reservation');

// Function to convert Excel serial date to JavaScript Date
function excelDateToJSDate(excelSerialDate) {
  return new Date((excelSerialDate - 25569) * 86400000);
}

async function processExcel(filePath) {
  try {
    // Read and parse Excel file
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Fix data types
    jsonData = jsonData.map(row => ({
      ...row,
      room_num: Number(row["room_num "]?.toString().trim()),
      reservation_time: excelDateToJSDate(row.reservation_time),
    }));

    // Insert each row into the 'reservations' table
    for (const row of jsonData) {
      await Reservation.create(row);
    }

    console.log('Data successfully inserted into reservations table.');
    return jsonData;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
}

module.exports = { processExcel };
