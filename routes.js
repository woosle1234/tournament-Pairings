const express = require('express'); //import express
const multer = require('multer');
const upload = multer();

const router  = express.Router(); 
// 2.
const tournamentController = require('./controllers'); 

router.get('/', tournamentController.getPairings); 

router.get('/upload', tournamentController.newUpload); 

router.post('/upload', tournamentController.uploadFile, tournamentController.newPairings); 
 
module.exports = router; // export to use in server.js
