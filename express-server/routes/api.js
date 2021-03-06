const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/mean-docker';

// Connect to mongodb
mongoose.connect(dbHost);

// create mongoose schema
const hogLog = new mongoose.Schema({
  humidity: Number,
  temperature_f: Number,
  ticks: Number,
  timestamp: Number
});

// create mongoose model
const Hoglog = mongoose.model('Hoglog', hogLog);


/* GET api listing. */
router.get('/', (req, res) => {
        res.send('api works');
});

/* GET all hogLos */
router.get('/hoglogs', (req, res) => {
    Hoglog.find({}, (err, hoglog) => {
        if (err) res.status(500).send(err)

        res.status(200).json(hoglog);
    });
});

/* GET one hogLog */
router.get('/hoglogs/:id', (req, res) => {
    Hoglog.findById(req.param.id, (err, hoglog) => {
        if (err) res.status(500).send(err)

        res.status(200).json(hoglog);
    });
});

/* GET one hogLog */
router.get('/fastest', (req, res) => {
    var query = Hoglog.find({});
    query.limit(1);
    query.sort({ticks: 'desc'});
    query.exec((err, hoglog)=>{        
        if (err) res.status(500).send(err)
        res.status(200).json(hoglog);
    })   
});

router.get('/latest', (req, res) => {
    var query = Hoglog.find({});
    query.sort({timestamp: 'desc'});
    query.limit(1);
    query.exec((err, hoglog)=>{        
        if (err) res.status(500).send(err)
        res.status(200).json(hoglog);
    })   
});
router.get('/hoglogs/timestamp/:timestamp', (req, res) => {
    Hoglog.find({ timestamp: {$gte : req.params.timestamp}}, null, {sort: {timestamp: 'asc'} },(err, hoglog) => {
        if (err) res.status(500).send(err)
        res.status(200).json(hoglog);
    }); 
});

 

/* Create a user. */
router.post('/hoglogs', (req, res) => {
    var time = new Date().getTime();
    let hoglog = new Hoglog({
        humidity: req.body.Humidity,
        temperature_f: req.body.TemperatureF,
        ticks: req.body.Ticks,
        timestamp: time
    });

    hoglog.save(error => {
        if (error) res.status(500).send(error);

        res.status(201).json({
            message: 'Log created successfully'
        });
    });
});

module.exports = router;