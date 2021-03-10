const express = require('express'); //what allows to inittiate http
const { Mongoose } = require('mongoose');
const router = express.Router();
const Anime = require('../models/anime-model');
const mongoose = require('mongoose');
const fileUpload = require('../configs/cloudinary');
const Kitsu = require('kitsu') 
const User = require('../models/user-model.js')
const api = new Kitsu()

//one route to get Anime - the list with all, so the route will be animes
    //Read
router.get('/animes', (req, res) => {
     
      api.get('anime')
       .then(response => { 
            res.json(response.data)
        })
       .catch(error => { 
           console.log(error)
        })

 })

 router.put('/animes/favorite/:id', (req, res) => {
     const animeId = req.params.id;
     const userId = req.user._id;
     let existingFavoriteAnimes = [];
     User.findById(userId).then((userFromDB) => {
        existingFavoriteAnimes = userFromDB.favoriteAnimes;  
        if (existingFavoriteAnimes.indexOf(animeId) > -1) {
            existingFavoriteAnimes.splice(existingFavoriteAnimes.indexOf(animeId), 1);
        } else {
            existingFavoriteAnimes = existingFavoriteAnimes.concat(animeId)
        }

        User.findByIdAndUpdate(userId,  { favoriteAnimes: existingFavoriteAnimes }, { new: true }).then((updatedUser) => {
            res.status(200).json(updatedUser.favoriteAnimes); 
        })
     })
 })

 router.get('/animes/user', (req, res) => {
    const userId = req.user._id;
    User.findById(userId).then((userFromDB) => {
        res.status(200).json(userFromDB.favoriteAnimes); 
    });
 });


router.get('/animes', (req, res) => {
    Anime.find()
    .then((allAnimesFromDB) => {
      res.status(200).json(allAnimesFromDB); 
    }).catch((error) => {
      res.status(500).json(`Error occurred ${error}`);
    })
});


//create
router.post('/animes', (req, res) => {
   
   //api.create('post', {
   //    content: ''   -> on doc they have 'some content'
   //})
   
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
  // api.remove('post', 1) sendo que um ha-de ser o id
  
    Anime.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(200).json(`Anime with id ${req.params.id} was deleted`);
  }).catch((error) => {
    res.status(500).json(`Error occurred ${error}`);
  });
});

//get an anime from id
router.get('/animes/:id', (req, res) => {
    api.get(`anime/${req.params.id}`)
    .then(response => { 
         res.json(response.data)
     })
    .catch(error => { 
        console.log(error)
     })
})

//update - use id because we want to know what Anime will be update
router.put('/animes/:id', (req, res) => {
   
  // api.update ('posts', {
  //     id: '',
  //     content: ''
  //  }
  // }) usei empty strings, no exemplo tem '1' e 'new content'
   
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