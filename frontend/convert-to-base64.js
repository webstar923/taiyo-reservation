const fs = require('fs');
const font = fs.readFileSync('NotoSansJP-VariableFont_wght.ttf');
fs.writeFileSync('NotoSansJP-base64.txt', font.toString('base64'));
console.log('Font converted to base64 successfully!');