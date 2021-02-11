const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890', 5);

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

// WebSocket event handling
let clients = {}

wss.on('connection', ws => {
    console.log(`New connection`);

    ws.on('message', data => {
        const parsed = JSON.parse(data);

        // client registered
        if (parsed.type == 100) clients[parsed.userId] = ws;
        
        // client sent a text message. For now, broadcast message to all other clients.
        if (parsed.type == 200) {
            for (const [id, socket] of Object.entries(clients)) {
                if (id != parsed.userId) socket.send(data);
            }
        }
    });

});

