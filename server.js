const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Folder ki static files (index.html, style.css, script.js) serve karne ke liye
app.use(express.static(__dirname));

let players = {};
let turn = 'X';

io.on('connection', (socket) => {
    // Sirf 2 players ko allow karein
    if (Object.keys(players).length < 2) {
        const symbol = Object.keys(players).length === 0 ? 'X' : 'O';
        players[socket.id] = symbol;
        socket.emit('playerAssigned', { symbol, turn });

        if (Object.keys(players).length === 2) {
            io.emit('gameStart', { message: 'Game Started! X turn' });
        }
    } else {
        socket.emit('full', 'Room full hai! Do log pehle se khel rahe hain.');
    }

    // Jab koi player box par click kare
    socket.on('makeMove', (data) => {
        turn = turn === 'X' ? 'O' : 'X';
        io.emit('moveMade', { index: data.index, symbol: data.symbol, nextTurn: turn });
    });

    // Player disconnect hone par
    socket.on('disconnect', () => {
        delete players[socket.id];
        turn = 'X';
        io.emit('playerLeft', 'Opponent disconnected.');
    });
});

server.listen(3000, () => {
    console.log('Online Server running on http://localhost:3000');
});

