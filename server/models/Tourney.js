const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TourneySchema = new Schema({
  name: String,
  password: String,
  map: [[[String, String, String, String]]]
});

module.exports = mongoose.model('Tourney', TourneySchema);
