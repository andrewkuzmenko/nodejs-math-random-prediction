const fs = require('fs');
const seq = Array.from(Array(500), ()=> Math.random());
fs.writeFileSync('seq.json', JSON.stringify({seq}));