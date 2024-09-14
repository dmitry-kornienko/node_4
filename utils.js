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

module.exports = {
	fetchTopMovies,
}
