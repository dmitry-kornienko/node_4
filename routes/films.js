const express = require('express')
const filmsController = require('../controllers/films')

const filmsRouter = express.Router()

filmsRouter.get('/readall', filmsController.readAll)
filmsRouter.get('/read', filmsController.read)

module.exports = filmsRouter
