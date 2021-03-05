const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gamesSchema = new Schema({
  id: Number,
  name: String,
  age_ratings: Array,
  total_rating: Number,
  artworks: Array,
  category: Number,
  cover: Number,
  first_release_date: Number,
  game_modes: Array,
  genres: Array,
  involved_companies:Array,
  keywords: Array,
  platforms: Array,
  similar_games: Array,
  storyline: String,
  summary: String,
  videos: Array,
  url: String,
  screenshots: Array,
  player_perspective: Array
  
});

const Games = mongoose.model('Games', gamesSchema);

module.exports = Games;