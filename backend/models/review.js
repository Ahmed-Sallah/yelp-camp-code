const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
  body: {type: String, required: true},
  rating: {type: Number, required: true},
  username: {type: String, required: true},
  userId: {type: String, required: true}
})


module.exports = mongoose.model('Review', ReviewSchema)
