const express = require('express')
const app = express()
const filmsRouter = require('./routes/films')

const { fetchTopMovies } = require('./utils')

app.use(express.json())

app.use('/api/films', filmsRouter)

app.listen(3000, async () => {
	console.log('Example app listening on port 3000!')

	try {
		await fetchTopMovies()
	} catch (error) {
		console.error('Failed to fetch Top 250 movies on startup:', error.message)
	}
})
