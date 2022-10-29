const express = require('express');
const colors = require('colors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { readFileSync, writeFileSync } = require('fs');
const { isObject } = require('util');

// init express
const app = express();

// create express server to raw server
const httpServer = createServer(app);

// socket server init
const io = new Server(httpServer);

// create a connection
io.on('connection', (socket) => {
    
    let latestChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')).toString());
    io.sockets.emit('latestChat', latestChat);

    socket.on('chat', ({ name, photo, msg }) => {
        let oldChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')));
        oldChat.push({ name, photo, msg });
        writeFileSync(path.join(__dirname, 'db/chat.json'), JSON.stringify(oldChat));

        let latestChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')).toString());
        io.sockets.emit('latestChat', latestChat);
    })

})


// static folder 
app.use(express.static(path.join(__dirname, '')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth/register.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'client.html'));
});

httpServer.listen(5050, () => {
    console.log(`server is running on port 5050`.bgCyan.black);
});