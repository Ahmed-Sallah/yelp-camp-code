const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')


const CampgroundSchema = new Schema({
  title: {type: String, required: true},
  price: {type: Number, required: true},
  description: {type: String, required: true},
  location: {type: String, required: true},
  image: {type: String, required: true},
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  creator: {type: Schema.Types.ObjectId, ref: 'User'},
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
  if(doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})


module.exports = mongoose.model('Campground', CampgroundSchema)
