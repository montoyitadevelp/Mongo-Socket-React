const express = require('express')
const { registerUser, loginUser, findUser, allUsers } = require('../controllers/user.controller')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/find/:userId', findUser)
router.get('/', allUsers)

module.exports = router