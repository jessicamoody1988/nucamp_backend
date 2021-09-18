const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionDelegate = (req, cb) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    cb(null, corsOptions);
};

// cors() returns a middleware function configured to set a CORS header of
// Access-Control-Allow-Origin on a response object, with a wild card as its value
// Which means that it will allow CORS for all origins
exports.cors = cors(); 

// cors() returns a middleware function that will check to see if the incoming
// requests belongs to one of the whitelisted origins
exports.corsWithOptions = cors(corsOptionDelegate);
