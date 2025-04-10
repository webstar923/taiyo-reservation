const mysql = require('mysql2');
const Log = require('./models/Log');

const insertLog = async(level, message, req_id, originalUrl, method, statusCode, user_id, ip)=> {
    const logo = await Log.create({ level, message,request_id:req_id,endpoint:originalUrl,method:method,status_code:statusCode,user_id:user_id,ip_address:ip });
}

function logError(message,id,originalUrl,method,statusCode,user_id ,ip) {
  insertLog('error', message, id, originalUrl, method, statusCode, user_id, ip);
}

function logInfo(message,id,originalUrl,method,statusCode,user_id ,ip) {
  insertLog('info', message, id, originalUrl, method, statusCode, user_id, ip);
}
function logImportantInfo(message,id, originalUrl, method, statusCode, user_id, ip) {
  insertLog('important', message, id, originalUrl, method, statusCode, user_id, ip);
}
function logChangeInfo(message, id, originalUrl, method, statusCode, user_id, ip) {
  insertLog('change', message, id, originalUrl, method, statusCode, user_id, ip);
}
module.exports = {
  logError,
  logInfo,
  logImportantInfo,
  logChangeInfo,
};
