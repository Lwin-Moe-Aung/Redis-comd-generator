const express = require("express");
const roomRoutes = express.Router();
const fs = require('fs').promises; // Use promises-based file system

const dataPath = './RedisOutput/memberAllList.txt';
const roomPath = './db/room.json';
const roomMemberPath = './db/room-member.json';

// Function to find room members based on roomId
function findRoomMembers(roomId, memberData) {
    return memberData.filter(member => member.roomId.$oid === roomId);
}

// Async function to handle the route
roomRoutes.get('/room/addroommembersalllist', async (req, res) => {
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
            let md = `SADD room:${roomId}:allList`;

            // Read the room member data with encoding specified
            

            // Find room members based on roomId
            const roomMembers = findRoomMembers(roomId, jsonMemberData);
            
            for (const member of roomMembers) {
                md += " " +member.userId;
            }
            roomMemberData += md+ '\n\n';
        }

        // Write roomMemberData to the file without specifying an encoding
        await fs.writeFile(dataPath, roomMemberData);

        res.json({ success: true, msg: 'Member All List data added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, msg: 'An error occurred' });
    }
});

module.exports = roomRoutes;
