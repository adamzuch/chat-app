const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server: server});
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/id', (req, res) => {
    res.status(200).send({id: nanoid()});
});

server.listen(PORT, () => console.log(`chat-app server listening on port ${PORT}`));

wss.on('connection', ws => {
    console.log(`New connection`);
    
    ws.on('message', data => {

        console.log(data);

        ws.send(`You said: ${data}`);
    });

});

