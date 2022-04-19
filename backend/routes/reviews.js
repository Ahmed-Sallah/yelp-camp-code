const express = require('express')
const router = express.Router({mergeParams: true})
const Campground = require('../models/campground')
const Review = require('../models/review')

const checkAuth = require('../middleware/chech-auth')

router.get('/reviews', (req, res, next) => {
  Campground.findById(req.params.id).populate('reviews')
    .then(campground => {
      const reviews = campground.reviews
      res.status(200).json({reviews})
    })
})

router.post('/review', checkAuth, async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review({body: req.body.reviewBody, rating: req.body.reviewRating})
  review.username = req.userData.username
  review.userId = req.userData.userId
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.status(200).json({message: 'Review Added!', review})
})

router.delete("/reviews/:reviewId", checkAuth, async(req, res, next) => {
  await Campground.findByIdAndUpdate(req.params.id, { $pull: {reviews: req.params.reviewId} })
  await Review.findByIdAndDelete(req.params.reviewId)
  res.status(200).json({message: 'Deleted!'})
})


module.exports = router
