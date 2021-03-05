const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animeSchema = new Schema({
   createdAt: String,
   synopsis: String,
   coverImageTopOffset: Number,
   titles: Object, //[en, en_jp, ja_jp]
   canonicalTitle: String,
   averageRating: String,
   startDate: String,
   endDate: String,
   popularityRank: Number,
   ratingRank: Number,
   ageRatingGuide: String,
   subtype: String, //enum
   status: String, //enum
   posterImage: String, //object
   episodeCount: Number,
   episodeLength: Number,
   nsfw: Boolean
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;