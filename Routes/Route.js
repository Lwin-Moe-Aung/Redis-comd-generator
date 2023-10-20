const express = require("express")
const router = express.Router();
const fs = require('fs');
const roomRoutes = require('./room.js')

const roomMemberRoutes = require('./roomMember.js')
const memberAllListRoutes = require('./memberAllList.js')
const memberListRoutes = require('./memberList.js')


// Redis
router.use(roomRoutes)
router.use(roomMemberRoutes)
router.use(memberAllListRoutes)
router.use(memberListRoutes)


module.exports = router;