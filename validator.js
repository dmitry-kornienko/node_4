const createMovieValidator = ({
	title,
	rating,
	year,
	budget,
	gross,
	poster,
	position,
}) => {
	const errors = []

	if (typeof title !== 'string' || title.trim() === '') {
		errors.push('The “title” field must be a non-empty string.')
	}

	if (typeof rating !== 'number' || rating < 0 || rating > 10) {
		errors.push('The “rating” field must be a number between 0 and 10.')
	}

	if (
		typeof year !== 'number' ||
		year < 1888 ||
		year > new Date().getFullYear()
	) {
		errors.push(
			'The “year” field should be a number corresponding to the year of issue (1888 and later).'
		)
	}

	if (typeof budget !== 'number' || budget < 0) {
		errors.push('The “budget” field must be a non-negative number.')
	}

	if (typeof gross !== 'number' || gross < 0) {
		errors.push('The “gross” field must be a non-negative number.')
	}

	if (typeof poster !== 'string' || !poster.startsWith('http')) {
		errors.push('The “poster” field must be a string and contain a valid URL.')
	}

	if (typeof position !== 'number' || position < 1) {
		errors.push('The “position” field must be a positive integer.')
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}
const updateMovieValidator = ({
	id,
	title,
	rating,
	year,
	budget,
	gross,
	poster,
	position,
}) => {
	const errors = []

	if (!id) {
		errors.push('Id is required.')
	}

	if (title && typeof title !== 'string') {
		errors.push('Title must be a string.')
	}

	if (rating && (typeof rating !== 'number' || rating < 0 || rating > 10)) {
		errors.push('Rating must be a number between 0 and 10.')
	}

	if (
		year &&
		(typeof year !== 'number' || year < 1888 || year > new Date().getFullYear())
	) {
		errors.push(
			`Year must be a number between 1888 and ${new Date().getFullYear()}.`
		)
	}

	if (budget && (typeof budget !== 'number' || budget < 0)) {
		errors.push('Budget must be a positive number.')
	}

	if (gross && (typeof gross !== 'number' || gross < 0)) {
		errors.push('Gross must be a positive number.')
	}

	if (poster && typeof poster !== 'string') {
		errors.push('Poster must be a valid URL string.')
	}

	if (position && (typeof position !== 'number' || position < 1)) {
		errors.push('Position must be a positive integer.')
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

module.exports = {
	createMovieValidator,
	updateMovieValidator,
}
