const express = require("express")
const router = express.Router();
const fs = require('fs');
const accountRoutes = require('./account.js')
const roomRoutes = require('./room.js')


router.use(accountRoutes)
// Redis
router.use(roomRoutes)
module.exports = router;