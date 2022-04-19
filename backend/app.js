const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require('mongoose')

const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')

mongoose.connect('mongodb://localhost:27017/yelp-camp').then(() => {
  console.log('Database Connected')
}).catch(err => {
  console.log(err)
})

app.use(express.json())
app.use(cors())
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id', reviewsRoutes)
app.use('', userRoutes)

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT')
  next()
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})
