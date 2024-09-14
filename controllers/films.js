const fs = require('fs')
const path = require('path')
const { readFile } = require('../utils')

const filePath = path.join(__dirname, '../top250.json')

module.exports = filmsController = {
	readAll: (req, res) => {
		try {
			const movies = readFile()

			res.json(movies)
		} catch (error) {
			console.error('Ошибка при чтении файла:', error)
			res.status(500).send('Внутренняя ошибка сервера')
		}
	},

	read: async (req, res) => {
		try {
			const { id } = req.body

			const movies = readFile()

			const targetMovie = movies.find(m => m.id === id)

			res.json(targetMovie)
		} catch (error) {
			console.error('Ошибка при чтении файла:', error)
			res.status(500).send('Внутренняя ошибка сервера')
		}
	},
}
