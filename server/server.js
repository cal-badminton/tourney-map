const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const getSecret = require('./secrets.js');
const btoa = require('btoa');
const Tourney = require('./models/Tourney.js');

mongoose.connect(getSecret('db'));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb!');
});

app.get('/', (req, res) => {
  res.send("server connection established!");
});

var times = {};
var intervals = {};

io.on('connection', function(socket) {
  console.log('user connected!');

  // BEGIN HANDLING SOCKET.IO CALLS //

  // Handle making a tourney
  socket.on('create tourney', function(data) {
    console.log("creating a tourney!");
    console.log(data);
    Tourney.findOne({name: data.name}, (err, tourney) => {
      if (tourney === null || tourney === undefined) {
        const tourney = new Tourney();
        tourney.name = data.name;
        tourney.password = data.password;
        tourney.map = new Array(10).fill(new Array(18).fill(new Array(4).fill("")));
        tourney.save();
        socket.emit('tourney', btoa(tourney.name));
        socket.join(data.name);
        console.log('made a tournament!');
      } else {
        socket.emit('warning', 'A tournament with this name already exists!');
        console.log('tournament already exists!');
      }
    });
  });

  // Handle editing a tourney
  socket.on('manage tourney', function(data) {
    Tourney.findOne({name: data.name}, (err, tourney) => {
      if (tourney === null || tourney === undefined) {
        socket.emit('warning', 'That tournament does not exist!');
      } else if (tourney.password === data.password){
        socket.emit('tourney', btoa(tourney.name));
        socket.join(tourney.name);
      } else {
        socket.emit('warning', 'Incorrect password!');
      }
    });
  });

  // Sends updated tournament to client when requested
  socket.on('get tourney', function(data) {
    Tourney.findOne({name: data.name}, (err, tourney) => {
      if (tourney === null || tourney === undefined) {
        socket.emit('warning', 'asdfThat tournament does not exist!');
      } else {
        socket.join(tourney.name);
        socket.emit('load tourney', {map: tourney.map});
      }
    });
  });

  // Update the map of a tourney
  socket.on('map switch', function(data) {
    Tourney.findOne({name: data.id}, (err, tourney) => {
      if (tourney === null || tourney === undefined) {
        socket.emit('warning', 'That tournament does not exist!');
      } else {
        tourney.update(
          {$set: {["map." + data.a + "." + data.b]: tourney.map[data.c][data.d],
                  ["map." + data.c + "." + data.d]: tourney.map[data.a][data.b]}},
          {upsert: false},
          function(err, updated) {
            if (updated === null) {
              socket.emit('warning', 'Unable to update!');
            } else {
              let copy = tourney.map[data.a][data.b];
              tourney.map[data.a][data.b] = tourney.map[data.c][data.d];
              tourney.map[data.c][data.d] = copy;
              io.to(data.id).emit('load tourney', {map: tourney.map});
            }
          }
        );
      }
    });
  });

  socket.on('map tile', function(data) {
    var location = "map." + data.row + "." + data.col;
    Tourney.findOneAndUpdate(
      {name: data.id},
      {$set: {["map." + data.row + "." + data.col]: [data.type, data.title, data.info, data.highlight]}},
      {upsert: false, new: true},
      function(err, tourney) {
        if (tourney === null || tourney === undefined) {
          socket.emit('warning', 'Unable to update!');
        } else {
          io.to(data.id).emit('load tourney', {map: tourney.map});
        }
      }
    );
  });

  socket.on('toggle timer', function(data) {
    var key = "" + data.row + data.name + data.col;
    console.log(key);
    if (key in intervals) {
      clearTimeout(intervals[key]);
      delete intervals[key];
    } else {
      if (!(key in times)) {
        times[key] = 0;
      }
      intervals[key] = setInterval(function(){
        times[key]++;
        io.to(data.name).emit('update timer', {key: key, time: times[key]});
      }, 1000);
    }
  });

  socket.on('reset timer', function(data) {
    var key = data.row + data.name + data.col;
    if (key in times) {
      delete times[key];
      io.to(data.name).emit('update timer', {key: key, time: 0});
    }
    if (key in intervals) {
      clearTimeout(intervals[key]);
      delete intervals[key];
    }
  });

  socket.on('send message', function(data) {
    io.to(data.name).emit('receive message', {message: data.message});
  });

  socket.on('disconnect', function() {
    console.log('user disconnected!');
  });
});

http.listen(process.env.PORT || 5000, () => console.log('Listening on port 8000!'));
