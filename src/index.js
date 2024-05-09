const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path=require('path');
const chat=require('./routes/route')
 const socket=require('./socket/connection')
const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('chata',jwtSecret)
const admin = require('firebase-admin');
 const serviceAccount = require('../chatapp-ecf75-firebase-adminsdk-f1kns-7b2b8a9948.json');
require('dotenv').config();

app.use(cors());
app.use(cookieParser());
app.use("/public", express.static(__dirname + "/public/"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/',chat)
app.use(express.urlencoded({ extended: true }));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


module.exports = app;