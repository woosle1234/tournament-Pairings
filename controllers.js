const multer = require('multer');
const Pairing = require('./pairing');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadFile = multer({storage: storage}).single('file');


// getPairings function for post tea route
const getPairings = (req, res, next) => {
    Pairing.find({},(err,data)=>{
        if(err)
            res.json({"Error": err})
            else
        res.render(path.join(__dirname, 'html','home.html'),{data: data});
    }).sort('tableNum')
};

const newPairings = (req, res, next) => {
    let data =[];
    fs.createReadStream(path.resolve(__dirname , 'uploads', req.file.filename))
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', row => data.push([row[0],row[1],row[3]]))
    .on('end', rowCount => {
        data.splice(0,1);
        console.log(data);
        Pairing.deleteMany({}).then(r=>{
            for(let i=0;i<data.length;i++){
                const newPairings = new Pairing({
                    tableNum: data[i][0],
                    Player1: data[i][1],
                    Player2: data[i][2],
                    Round: req.body.Round
                })
                newPairings.save((err,d)=>{
                    if(err){
                        res.json({"Error": err});
                    }
                })
            }
            res.json({Message: "Pairings Successfully Submitted ",data: data});
        })
    });
};

const newUpload = (req, res, next) => {
    res.render(path.join(__dirname, 'html','upload.html'));
};

module.exports = {
    getPairings,
    newPairings,
    newUpload,
    uploadFile
};
