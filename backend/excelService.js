const XLSX = require('xlsx');
const fs = require('fs');
const Reservation = require('./models/Reservation');
const Work = require('./models/Work');

function excelDateToTime(excelDate) {
  // Excel serial to JS Date
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
  // Format to HH:mm:ss for Sequelize TIME
  return jsDate.toTimeString().split(' ')[0];
}
function excelSerialToDateOnly(serial) {
  const days = Math.floor(serial);                 // whole days
  const epochDays = days - 25569;                  // days since 1970-01-01
  const ms = epochDays * 86400 * 1000;
  const d = new Date(ms);
  return d.toISOString().slice(0, 10);             // YYYY-MM-DD (UTC)
}

/** Excel serial -> HH:mm:ss from the fractional day (0 if none) */
function excelSerialToTime(serial) {
  const frac = serial - Math.floor(serial);
  const totalSec = Math.round(frac * 86400);
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
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
      flat_name: row["物件名"]?.toString().trim(),
      room_num: Number(row["部屋番号"]),
      work_name: row["案件名"]?.toString().trim(),
      reservation_time:  excelSerialToDateOnly(Number(row["予約日時"])),
      division: row["区分"]?.toString().trim() || "morning",
      status: "pending"
    }));

    // Insert each row into the 'reservations' table
    for (const row of jsonData) {
      await Reservation.create(row);
      await Work.create(row);
    }

    console.log('Data successfully inserted into reservations table.');
    return jsonData;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
}

module.exports = { processExcel };
