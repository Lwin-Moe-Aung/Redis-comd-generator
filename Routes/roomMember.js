const express = require("express");
const roomRoutes = express.Router();
const fs = require('fs').promises; // Use promises-based file system

const dataPath = './RedisOutput/roomMember.txt';
const roomPath = './db/room.json';
const roomMemberPath = './db/room-member.json';

// Function to find room members based on roomId
function findRoomMembers(roomId, memberData) {
    return memberData.filter(member => member.roomId.$oid === roomId);
}

// Async function to handle the route
roomRoutes.get('/room/addroommembers', async (req, res) => {
    try {
        // Read the room data
        const roomData = await fs.readFile(roomPath, 'utf8');
        const jsonData = JSON.parse(roomData);

        const membersData = await fs.readFile(roomMemberPath, 'utf8');
        const jsonMemberData = JSON.parse(membersData);

        // Prepare roomMemberData
        let roomMemberData = '';
        for (const room of jsonData) {
            const roomId = room._id.$oid;
            const md = [];

            // Read the room member data with encoding specified
            

            // Find room members based on roomId
            const roomMembers = findRoomMembers(roomId, jsonMemberData);

            for (const member of roomMembers) {
                const noPush = member.offlineNoPushMsg != null && member.offlineNoPushMsg > 0;
                md.push(`HSET room:${roomId}:members:${member.userId}:map "\\"nickname\\"" "\\"${member.nickname}\\"" "\\"vip\\"" "${member.vip}" "\\"role\\"" "${member.role}" "\\"noPush\\"" "${noPush}" "\\"talkTime\\"" "\\"${member.talkTime}\\""`);
            }

            roomMemberData += md.join('\n') + '\n\n';
        }

        // Write roomMemberData to the file without specifying an encoding
        await fs.writeFile(dataPath, roomMemberData);

        res.json({ success: true, msg: 'Room members info data added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, msg: 'An error occurred' });
    }
});

module.exports = roomRoutes;
