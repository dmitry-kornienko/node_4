const { registerNewManager, readAllManagers } = require('../utils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = authController = {
	register: async (req, res) => {
		try {
			const { email, password } = req.body

			if (!email || !password) {
				return res
					.status(400)
					.json({ message: 'Email and password are required' })
			}

			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(password, salt)

			const newManager = {
				id: Date.now(),
				email,
				password: hashedPassword,
				super: false,
			}

			registerNewManager(newManager)

			res.status(201).json(newManager)
		} catch (error) {
			res.status(500).send('Server error')
		}
	},

	login: async (req, res) => {
		try {
			const { email, password } = req.body

			const managers = await readAllManagers()

			const manager = managers.find(m => m.email === email)

			const isPasswordCorrect =
				manager && (await bcrypt.compare(password, manager.password))

			const secret = 'secret'

			if (manager && isPasswordCorrect && secret) {
				const token = jwt.sign(
					{ id: manager.id, email: manager.email },
					secret,
					{
						expiresIn: '5m',
					}
				)
				res.status(200).json(token)
				return
			} else {
				res.status(400).send('Bad credentials')
			}
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
		}
	},
}
