const express = require('express'); //what allows to inittiate http
const { Mongoose } = require('mongoose');
const router = express.Router();
const Games = require('../models/games-model');
const mongoose = require('mongoose');
const fileUpload = require('../configs/cloudinary');
const axios = require('axios');

//to test the code from postman
router.get('/testAPI', (req, res) => {
  
  let data = 'fields name,category,platforms;\nwhere category = 0 & platforms = {48,6};';

  let config = {
    method: 'post',
    url: 'https://api.igdb.com/v4/games',
    headers: { 
      'Client-ID': '5ztmok1qdrkq8a80yj0o1nlq72hg2u', 
      'Authorization': 'Bearer 45gn9eihkqq1yok97jug91ftwk6s29', 
      'Content-Type': 'text/plain'
    },
    data : data
  };

  axios(config).then((response) => {
    res.json(response.data);
  })
})



//one route to get Games
    //Read

router.get('/games', (req, res) => {
    Games.find()
    .then((allGamesFromDB) => {
      res.status(200).json(allGamesFromDB); 
    }).catch((error) => {
      res.status(500).json(`Error occurred ${error}`);
    })
});

router.post('/games', (req, res) => {
    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      res.status(400).json('Missing fields');
      return;
    }

    Games.create({
      id,
      name,
      age_ratings,
      total_rating,
      artworks,
      category,
      cover,
      first_release_date,
      game_modes,
      genres,
      involved_companies,
      keywords,
      platforms,
      similar_games,
      storyline,
      summary,
      videos,
      url,
      screenshots,
      player_perspective
    }).then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      res.status(500).json(`Error occurred ${error}`);
    });
});

//delete
router.delete('/games/:id',(req, res) => {
  Games.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(200).json(`Game with id ${req.params.id} was deleted`);
  }).catch((error) => {
    res.status(500).json(`Error occurred ${error}`);
  });
});

//get game from id
router.get('/games/:id', (req, res) => {
  //validation is the if
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json('Specified id is not valid');
    return;
  }
  Games.findById(req.params.id)
  .then((theGameFromDB) => {
  res.status(200).json(theGameFromDB);
}).catch((error) => {
  res.status(500).json(`Error occurred ${error}`);
});
})

//update - use id because we want to know what game we will update
router.put('/games/:id', (req, res) => {
    const gameWithNewData = req.body;

    Games.findByIdAndUpdate(req.params.id, gameWithNewData)
    .then(() => {
      res.status(200).json(`Game with id ${req.params.id} was updated`);
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