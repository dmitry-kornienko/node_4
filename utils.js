const fs = require('fs')
const path = require('path')
const axios = require('axios')

const filePath = path.join(__dirname, 'top250.json')

async function fetchTopMovies() {
	try {
		const response = await axios({
			method: 'get',
			url: 'https://api.kinopoisk.dev/v1.4/movie?limit=250&lists=top250&selectFields=id&selectFields=name&selectFields=rating&selectFields=year&selectFields=budget&selectFields=fees&selectFields=poster&selectFields=top250',
			headers: {
				'X-API-KEY': '899AWW2-H8ZMT3B-MYACQP4-F28YWA8',
			},
		})

		const movies = response.data.docs

		const movieList = movies.map(item => ({
			id: item.id,
			title: item.name,
			rating: item.rating.kp,
			year: item.year,
			budget: item.budget && item.budget.value ? item.budget.value : null,
			gross:
				item.fees && item.fees.world && item.fees.world.value
					? item.fees.world.value
					: null,
			poster: item.poster.url,
			position: item.top250,
		}))

		movieList.sort((a, b) => a.position - b.position)

		fs.writeFileSync(filePath, JSON.stringify(movieList, null, 2))
	} catch (error) {
		console.error('Error fetching movies:', error)
	}
}

const readFile = () => {
	try {
		const fileContent = fs.readFileSync(filePath, 'utf-8')
		const movies = JSON.parse(fileContent)

		return movies
	} catch (error) {
		throw new Error('Failed to read file')
	}
}

const writeFile = data => {
	try {
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
	} catch (error) {
		throw new Error('Failed to write file')
	}
}

const updateMoviePosition = (movieId, newPosition) => {
	let movies = readFile()
	const targetMovieIndex = movies.findIndex(m => m.id === movieId)
	if (targetMovieIndex === -1) {
		return { error: 'Movie not found' }
	}

	const targetMovie = movies[targetMovieIndex]
	const oldPosition = targetMovie.position

	if (oldPosition === newPosition) {
		return movies
	}

	movies.splice(targetMovieIndex, 1)
	targetMovie.position = newPosition

	if (newPosition < oldPosition) {
		movies = movies.map(movie => {
			if (movie.position >= newPosition && movie.position < oldPosition) {
				movie.position += 1
			}
			return movie
		})
	} else {
		movies = movies.map(movie => {
			if (movie.position > oldPosition && movie.position <= newPosition) {
				movie.position -= 1
			}
			return movie
		})
	}

	movies.splice(newPosition - 1, 0, targetMovie)

	return movies
}

const readAllManagers = () => {
	try {
		const managersContent = fs.readFileSync(
			path.join(__dirname, 'managers.json'),
			'utf-8'
		)
		const managers = JSON.parse(managersContent)

		return managers
	} catch (error) {
		throw new Error('Failed to read managers')
	}
}

const registerNewManager = manager => {
	try {
		const managers = readAllManagers()
		managers.push(manager)
		fs.writeFileSync(
			path.join(__dirname, 'managers.json'),
			JSON.stringify(managers, null, 2)
		)
	} catch (error) {
		throw new Error('Failed to write new manager')
	}
}

module.exports = {
	fetchTopMovies,
	readFile,
	writeFile,
	updateMoviePosition,
	readAllManagers,
	registerNewManager,
}
