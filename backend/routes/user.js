const express = require('express')
const router = express.Router({mergeParams: true})
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const User = require('../models/user')
const user = require('../models/user')

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hash
      })
      console.log(user)
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created!',
            result: result
          })
        }).catch(err => {
          res.status(500).json({message: 'Invalid authentication credentials!' })
        })
    })
})

router.post("/login", (req, res, next) => {
  let fetchedUser
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        return res.status(401).json({message: 'Auth Failed'})
      }
      fetchedUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if(!result) {
        return res.status(401).json({message: 'Auth Failed'})
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id, username: fetchedUser.username},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
      )
      res.status(200).json({token: token, expiresIn: 3600, userId: fetchedUser._id})
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({message: 'Invalid authentication credentials!'})
    })
})

module.exports = router