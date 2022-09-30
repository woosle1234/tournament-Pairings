const express = require('express'); //import express
const multer = require('multer');
const upload = multer();

const router  = express.Router(); 
// 2.
const tournamentController = require('./controllers'); 

router.get('/', tournamentController.getHome); 

router.get('/yugioh', tournamentController.getYugiohPairings); 

router.get('/yugioh/standing', tournamentController.getYugiohStanding); 

router.get('/weiss', tournamentController.getWeissPairings); 

router.get('/weiss/standing', tournamentController.getWeissStanding); 

router.get('/upload', tournamentController.newUpload); 

router.post('/uploadYugioh/:type', tournamentController.uploadFile, tournamentController.newYugioh); 

router.post('/uploadWeiss/:type', tournamentController.uploadFile, tournamentController.newWeissPairings); 

router.get('/deleteYugiohPairings',tournamentController.deleteYugiohPairings);

router.get('/deleteYugiohStandings',tournamentController.deleteYugiohStandings);
 
module.exports = router; // export to use in server.js
