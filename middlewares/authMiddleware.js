const jwt = require('jsonwebtoken')
const { readAllManagers } = require('../utils')

const authMiddleware = async (req, res, next) => {
	try {
		const authorizationHeader = req.headers.authorization
		const token = authorizationHeader?.split(' ')[1]

		if (!token) {
			return res.status(401).json({ message: 'Authorization token missing' })
		}

		const decoded = jwt.verify(token, 'secret')

		const managers = await readAllManagers()

		const user = managers.find(m => m.id === decoded.id)

		if (!user) {
			return res.status(403).json({ message: 'User not found' })
		}

		req.user = user

		next()
	} catch (error) {
		return res.status(403).json({ message: 'Invalid or expired token' })
	}
}

module.exports = authMiddleware
