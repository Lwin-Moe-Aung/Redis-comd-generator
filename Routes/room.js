const express = require("express")
const roomRoutes = express.Router();
const fs = require('fs');

const dataPath = './RedisOutput/room.txt' 
const filePath = './db/room.json'
//room set
roomRoutes.get('/room/addroominfo', (req, res) => {
   

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          return;
        }
      
        try {
            const jsonData = JSON.parse(data);
            let roomData = '';
            jsonData.forEach((room, index) => {
                const showNewMemberMessage = room.isShowNewMemberMessage == 0 ? false : true;
                const talk = (room.talkTime == null || room.talkTime == 0) ? true : false;
                roomData += `HSET room:${room._id.$oid}:info:map "\\"name\\"" "\\"${room.name}\\"" "\\"showNewMemberMessage\\"" "${showNewMemberMessage}" "\\"userSize\\"" "${room.userSize}" "\\"talk\\"" "${talk}"\n`;
            });
            fs.writeFileSync(dataPath, roomData)
            
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
        }
    });
    res.send({success: true, msg: 'Room info data added successfully'})
})

module.exports = roomRoutes