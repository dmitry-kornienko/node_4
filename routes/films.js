const express = require('express')
const filmsController = require('../controllers/films')

const filmsRouter = express.Router()

filmsRouter.get('/readall', filmsController.readAll)
filmsRouter.get('/read', filmsController.read)
filmsRouter.post('/create', filmsController.create)
filmsRouter.post('/update', filmsController.update)
filmsRouter.post('/delete', filmsController.delete)

module.exports = filmsRouter
