// const http = require('http');
// const app = require("./src/index");
// // const { sequelize } = require("./models"); 
// const {createSocketServer} = require("./src/socket/connection")
// require('dotenv').config();
// const port = process.env.PORT || 1000;
// const server = http.createServer(app);
// const setupSocket = require('./src/socket/connection');
// createSocketServer(server);

// setupSocket(server);
// process.on('uncaughtException', (err) => {
//     console.error('There was an uncaught error', err);
//     process.exit(1);
// });

// server.listen(port, async () => {
//     console.log(`Example app listening at http://localhost:${port}`);
//     console.log('database connected successsfully')
// });



const http = require('http');
const app = require("./src/index");
const { createSocketServer } = require("./src/socket/connection");
const { createGroupSocketServer } = require("./src/socket/groupchat");
require('dotenv').config();

const port = process.env.PORT || 1000;
const server = http.createServer(app);
// createGroupSocketServer(server);
createSocketServer(server);

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});
server.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('database connected successfully');
});
