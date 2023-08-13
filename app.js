const express = require('express');
const http = require('http');

const initializeSocket = require('./socket');

const app = express();
const serverApp = http.createServer(app);

//apis -------------
const cors = require('cors')
const bodyParser = require('body-parser');
let database = require('./config');
let apis = require('./routes/routes');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: '*',
    })
);

app.use('/', apis);

//socket -------------------
// Initialize and use the socket instance
const io = initializeSocket(serverApp);





// listening ---------------------
var server = serverApp.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})


