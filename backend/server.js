const WebSocket = require('ws');

const port = process.env.PORT || 3000;
const wss = new WebSocket.Server({port: port});

wss.on('connection', ws => {
    console.log(`New connection`);
    
    ws.on('message', data => {

        console.log(data);

        ws.send('Server says hi');
    });

});

