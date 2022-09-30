const multer = require('multer');
const yugiohPairing = require('./models/yugiohPairing');
const weissPairing = require('./models/weissPairing');
const yugiohStanding = require('./models/yugiohStanding');
const weissStanding = require('./models/weissStanding');
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

const uploadFile = multer({ storage: storage }).single('file');

const getHome = (req, res, next) => {
    res.render(path.join(__dirname, 'html', 'home.html'));
}


// getYugiohPairings function for post tea route
const getYugiohPairings = (req, res, next) => {
    yugiohPairing.find({}, (err, data) => {
        if (err)
            res.json({ "Error": err })
        else {
            console.log(data)
            res.render(path.join(__dirname, 'html', 'yugioh.html'), { data: data });
        }
    }).sort('tableNum')
};

const newYugioh = (req, res, next) => {
    let data = [];
    fs.createReadStream(path.resolve(__dirname, 'uploads', req.file.filename))
        .pipe(csv.parse({ headers: false }))
        .on('error', error => console.error(error))
        .on('data', row => {
            if (req.params.type === "pairings") {
            data.push([row[0], row[1], row[3]])
            }else{
                data.push([row[0], row[1], row[6]])
            }
        })
        .on('end', rowCount => {
            data.splice(0, 1);
            if (req.params.type === "pairings") {
                yugiohPairing.deleteMany({}).then(r => {
                    for (let i = 0; i < data.length; i++) {
                        const newYugiohPairings = new yugiohPairing({
                            tableNum: data[i][0],
                            Player1: data[i][1],
                            Player2: data[i][2],
                            Round: req.body.Round
                        })
                        newYugiohPairings.save((err, d) => {
                            if (err) {
                                res.redirect("/upload?message=Yugioh Pairings Could not be Submitted&success=false");
                            }
                        })
                    }
                    yugiohStanding.deleteMany({}).then(result => {
                        res.redirect("/upload?message=Yugioh Pairings Successfully Submitted&success=true");
                    })

                })
            } else {
                yugiohStanding.deleteMany({}).then(result => {
                    for (let i = 0; i < data.length; i++) {
                        const newYugiohStanding = new yugiohStanding({
                            rank: data[i][0],
                            Player: data[i][1],
                            Points: data[i][2]
                        })

                        newYugiohStanding.save((err,d)=>{
                            if (err) {
                                res.redirect("/upload?message=Yugioh Standings Could not be Submitted&success=false");
                            }
                        })
                    }
                    res.redirect("/upload?message=Yugioh Standings Successfully Submitted&success=true");
                })
            }
        });
};

const getYugiohStanding = (req, res, next) => {
    yugiohStanding.find({}, (err, data) => {
        if (err)
            res.json({ "Error": err })
        else
            res.render(path.join(__dirname, 'html', 'yugiohStanding.html'), { data: data });
    }).sort('rank');
}

const getWeissPairings = (req, res, next) => {
    res.json({ test: "Placeholder" })
}

const newWeissPairings = (req, res, next) => {
    res.json({ test: "Placeholder" })
}

const getWeissStanding = (req, res, next) => {
    weissStanding.find({}, (err, data) => {
        if (err)
            res.json({ "Error": err })
        else
            res.render(path.join(__dirname, 'html', 'yugiohStanding.html'), { data: data });
    }).sort('rank');
}


const newUpload = (req, res, next) => {
    if(req.query!=={}){
        res.render(path.join(__dirname, 'html', 'upload.html'),{message: req.query.message, success:req.query.success});
    }else
    res.render(path.join(__dirname, 'html', 'upload.html'));
};

const deleteYugiohPairings = (req, res, next) => {
    yugiohPairing.deleteMany({}).then(r=>{
        res.redirect("/upload?message=Yugioh Pairings Deleted&success=true");
    })
};

const deleteYugiohStandings = (req, res, next) => {
    yugiohStanding.deleteMany({}).then(r=>{
        res.redirect("/upload?message=Yugioh Standings Deleted&success=true");
    })
};

module.exports = {
    getYugiohPairings,
    newYugioh,
    newUpload,
    uploadFile,
    newWeissPairings,
    getWeissPairings,
    getHome,
    getYugiohStanding,
    getWeissStanding,
    deleteYugiohPairings,
    deleteYugiohStandings
};
