const express = require('express')
const app = express();
const cors = require('cors') //>>> to share local apis with other
// const http = require('http').Server(app); ///>>> for socket user
// const io = require('socket.io')(http)

let database = require('./config');


let apis = require('./routes/routes');
app.use(express.json());

app.use(
    cors({
        origin: '*',
    })
);

app.use('/', apis);




var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})


