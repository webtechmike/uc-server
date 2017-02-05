var _ = require('lodash');
var Song = require('../song_model.js');

module.exports = function(app) {
    _songs = [];

    /* Create */
    app.post('/song', function(req, res){
        var newSong = new Song(req.body);
        newSong.save(function(err){
            if(err){
                res.json({info: 'error during song create', error: err});
            }
            res.json({info: 'song created successfully'});
        });
    });

    /* Read */
    app.get('/artists', function(req, res){

        Song.aggregate([
            {
                $group: {
                    _id: "$album_artist",
                    songs: {$push: "$track_name"},
                    song_count: {$sum: 1}
                }
            },
            {
                $sort: {
                    "artist": 1
                }
            }
        ], function(err, artists){
            res.json({info: 'artists found successfully', data: artists});
        });

        // Song.find(function(err, songs){
        //     var artists = [];
        //
        //     if(err) {
        //         res.json({info: 'error during find songs', error: err});
        //     }
        //
        //     songs.forEach(function(song){
        //         artists.push( song.album_artist );
        //     });
        //
        //     var unique = artists.filter(function(v,i,a){
        //         if(v!="") return a.indexOf(v) === i;
        //     });
        //
        //     res.json({info: 'songs found successfully', data: unique});
        // });
    });

    app.get('/', function(req, res){
        Song.find(function(err, songs){
            if(err) {
                res.json({info: 'error during find songs', error: err});
            }
            res.json({info: 'songs found successfully', data: songs});
        });
    });

    app.get('/:searchTerm', function(req, res){
        Song.find({$text: {$search: "\"" + req.params.searchTerm + "\"" }},
            function(err, found){
                res.json({info: 'Search term found successfully', data: found});
            });
    });

    app.get('/song/:id', function(req, res){
        Song.findById(req.params.id, function(err, song){
            if(err){
                res.json({info: 'error during find song', error: err});
            }
            if(song) {
                res.json({info: 'song found successfully', song: song});
            } else {
                res.json({info: 'song not found'});
            }
        });
    });

    /* Update */
    app.put('/song/:id', function(req, res) {
        Song.findById(req.params.id, function(err,song){
            if(err){
                res.json({info: 'error during find song', error: err});
            }
            if(song){
                _.merge(song, req.body);
                song.save(function(err){
                    if(err) {
                        res.json({info: 'error during song update', error: err});
                    }
                    res.json({info: 'song updated successfully', song: song});
                });
            } else {
                res.json({info: 'song not found'});
            }
        });
    });

    /* Delete */
    app.delete('/song/:id', function(req, res) {
    Song.findByIdAndRemove(req.params.id, function(err) {
            if(err) {
                res.json({info: 'error during remove song', error: err});
            }
            res.json({info: 'song removed successfully'});
        });
    });
}
