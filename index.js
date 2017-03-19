var express = require('express');
var cors = require('cors');
var app = express();
var port = 3030;
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ucat');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var songs = require('./routes/song.js')(app);

app.get('/', function(req, res) {
    // res.send('Hello World!');
    res.json({hello: 'world'});
});

var server = app.listen(port, function() {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
