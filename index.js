const express = require('express')
const app = express()
const filmsRouter = require('./routes/films')
const authRouter = require('./routes/auth')
const authMiddleware = require('./middlewares/authMiddleware')

// const { fetchTopMovies } = require('./utils')

app.use(express.json())

// app.use(authMiddleware)

app.use('/api/films', authMiddleware, filmsRouter)
app.use('/api/auth', authRouter)

app.listen(3000, async () => {
	console.log('Example app listening on port 3000!')

	// try {
	// 	await fetchTopMovies()
	// } catch (error) {
	// 	console.error('Failed to fetch Top 250 movies on startup:', error.message)
	// }
})
