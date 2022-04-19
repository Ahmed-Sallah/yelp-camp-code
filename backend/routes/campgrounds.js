const express = require('express')
const router = express.Router()


const Campground = require('../models/campground')

const checkAuth = require('../middleware/chech-auth')

router.get('/', (req, res, next) => {
  const pageSize = +req.query.pageSize
  const currentPage = +req.query.page
  const campgroundQuery = Campground.find()
  let fetchedCampground
  if(pageSize && currentPage) {
    campgroundQuery
      .skip(pageSize * (currentPage-1))
      .limit(pageSize)
  }
  campgroundQuery
    .then(campgrounds => {
      fetchedCampground = campgrounds
      return Campground.count()
    })
    .then(count => {
      res.status(200).json({
        message: "Campgrounds Fetched successfully!",
        campgrounds: fetchedCampground,
        maxCampgrounds: count,
    })
    }).catch(error => {
      res.status(500).json({message: 'Fetching Campground Failed!'})
    })
})

router.get("/:id", (req, res, next) => {
  Campground.findOne({_id: req.params.id}).populate('reviews').populate('creator')
    .then(campground => {
      res.status(200).json({message: 'Campground Was Found', campground})
    })
    .catch(error => {
      res.status(404).json({message: 'Campground Was Not Found'})
    })
})

router.post('/new', checkAuth,  (req, res, next) => {
  const campground = new Campground({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    location: req.body.location,
    image: req.body.image,
    creator: req.userData.userId,

  })

  campground.save().then((result) => {
    res.status(200).json({message: 'Campground Added!', campground})
  }).catch(error => {
    res.status(500).json({message: 'Failed to Create Campground!'})
  })
})

router.put("/:id/edit", checkAuth, (req, res, next) => {
  const campground = new Campground({
    _id: req.body.id,
    title: req.body.campground.editedTitle,
    location: req.body.campground.editedLocation,
    description: req.body.campground.editedDescription,
    price: req.body.campground.editedPrice,
    image: req.body.campground.editedImage,
    creator: req.userData.userId
  })
  Campground.updateOne({_id: req.body.id, creator: req.userData.userId}, campground).then(result => {
    if(result.acknowledged) {
      res.status(200).json({message: 'Edited Successfully'})
    } else {
      res.status(401).json({message: 'Not Authorized'})
    }
  }).catch(error => {
    res.status(500).json({message: "Couldn't update Campground!"})
  })
})

router.delete("/:id/delete", checkAuth, (req, res, next) => {
  Campground.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.deletedCount > 0) {
      res.status(200).json({message: 'Campground Deleted'})
    } else {
      res.status(401).json({message: 'Not Authorized'})
    }
  }).catch(error => {
    res.status(500).json({message: "Couldn'nt Delete Campground!"})
  })

})


module.exports = router
