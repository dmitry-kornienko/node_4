const { readFile, writeFile, updateMoviePosition } = require('../utils')
const { createMovieValidator, updateMovieValidator } = require('../validator')

module.exports = filmsController = {
	readAll: (req, res) => {
		try {
			const movies = readFile()
			res.json(movies)
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
		}
	},

	read: (req, res) => {
		try {
			const { id } = req.body
			const movies = readFile()
			const targetMovie = movies.find(m => m.id === id)

			if (!targetMovie) {
				res.status(404).json({ error: 'Movie not found' })
				return
			}

			res.json(targetMovie)
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
		}
	},

	create: (req, res) => {
		console.log('create1')
		try {
			const { isValid, errors } = createMovieValidator(req.body)

			if (!isValid) {
				res.status(400).json({ errors })
				return
			}

			const newMovie = { ...req.body, id: Date.now() }
			let movies = readFile()
			const samePositionMovieIndex = movies.findIndex(
				m => m.position === newMovie.position
			)

			if (samePositionMovieIndex !== -1) {
				console.log('create2')
				movies.splice(samePositionMovieIndex, 0, newMovie)
				for (let i = samePositionMovieIndex + 1; i < movies.length; i++) {
					movies[i].position += 1
				}
				writeFile(movies)
				res.status(201).json(newMovie)
				return
			}

			if (movies.length < newMovie.position) {
				newMovie.position = movies.length + 1
				movies.push(newMovie)
				writeFile(movies)
				res.status(201).json(newMovie)
				return
			}
			console.log('create4')
		} catch (error) {
			res.status(500).send('Server error')
		}
	},

	update: (req, res) => {
		try {
			const data = req.body
			const { isValid, errors } = updateMovieValidator(data)

			if (!isValid) {
				res.status(400).json({ errors })
				return
			}

			let movies = readFile()
			const targetMovie = movies.find(m => m.id === data.id)

			if (!targetMovie) {
				res.status(404).json({ message: 'Movie not found' })
				return
			}

			const updatedMovie = { ...targetMovie, ...data }

			if (targetMovie.position !== updatedMovie.position) {
				movies = updateMoviePosition(data.id, updatedMovie.position)
				writeFile(movies)
				res.status(200).json(updatedMovie)
				return
			}

			const updatedMovieIndex = movies.findIndex(m => m.id === data.id)
			movies[updatedMovieIndex] = { ...updatedMovie }
			writeFile(movies)
			res.status(200).json(updatedMovie)
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
		}
	},

	delete: (req, res) => {
		try {
			const { id } = req.body

			let movies = readFile()

			const targetMovieIndex = movies.findIndex(m => m.id === id)

			if (targetMovieIndex === -1) {
				res.status(404).json({ message: 'Movie not found' })
				return
			}

			const deletedMovie = movies[targetMovieIndex]
			movies.splice(targetMovieIndex, 1)

			if (deletedMovie.position < movies.length + 1) {
				movies = movies.map(movie => {
					if (movie.position > deletedMovie.position) {
						movie.position -= 1
					}
					return movie
				})
			}

			writeFile(movies)

			res.status(200).json({ message: 'Movie is deleted' })
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
		}
	},
}
