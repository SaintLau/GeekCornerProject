const express = require('express'); //what allows to inittiate http
const { Mongoose } = require('mongoose');
const router = express.Router();
const Anime = require('../models/anime-model');
const mongoose = require('mongoose');
const fileUpload = require('../configs/cloudinary');

//one route to get Anime - the list with all, so the route will be animes
    //Read
router.get('/animes', (req, res) => {
    Anime.find()
    .then((allAnimesFromDB) => {
      res.status(200).json(allAnimesFromDB); 
    }).catch((error) => {
      res.status(500).json(`Error occurred ${error}`);
    })
});

router.post('/animes', (req, res) => {
    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      res.status(400).json('Missing fields');
      return;
    }

    Anime.create({
        createdAt,
        synopsis,
        coverImageTopOffset,
        titles, 
        canonicalTitle,
        averageRating,
        startDate,
        endDate,
        popularityRank,
        ratingRank,
        ageRatingGuide,
        subtype,
        status,
        posterImage,
        episodeCount,
        episodeLength,
        nsfw
    }).then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      res.status(500).json(`Error occurred ${error}`);
    });
});

//delete an anime
router.delete('/animes/:id',(req, res) => {
  Anime.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(200).json(`Anime with id ${req.params.id} was deleted`);
  }).catch((error) => {
    res.status(500).json(`Error occurred ${error}`);
  });
});

//get an anime from id
router.get('/animes/:id', (req, res) => {
  //validation is the if
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json('Specified id is not valid');
    return;
  }
  Anime.findById(req.params.id)
  .then((theAnimeFromDB) => {
  res.status(200).json(theAnimeFromDB);
}).catch((error) => {
  res.status(500).json(`Error occurred ${error}`);
});
})

//update - use id because we want to know what Anime will be update
router.put('/animes/:id', (req, res) => {
    const animeWithNewData = req.body;

    Anime.findByIdAndUpdate(req.params.id, animeWithNewData)
    .then(() => {
      res.status(200).json(`Anime with id ${req.params.id} was updated`);
    }).catch((error) => {
        res.status(500).json(`Error occurred ${error}`);
    });
})

//Route to add pics
router.post('/upload', fileUpload.single('file'), (req, res) => {  
  try {
    res.status(200).json({ fileUrl: req.file.path});
  }
  catch(error) {
    res.status(500).json(`Error occured ${error}`);
  };
  
});

module.exports = router;