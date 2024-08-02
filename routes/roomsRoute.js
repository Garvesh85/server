const express=require("express");
const router=express.Router();

const Room=require('../models/room')

router.get("/getallrooms",async(req,res)=>{
    try
    {
        const rooms=await Room.find({})
        res.send(rooms);
    }
    catch(error)
    {
        return res.status(400).json({message:error});
    }
});

router.post("/getroombyid", async (req, res) => {
    console.log("Request received:", req.body);
    const { roomid } = req.body;
    try {
        const room = await Room.findOne({ _id: roomid });
        if (room) {
            res.send(room);
        } else {
            res.status(404).json({ message: "Room not found" });
        }
    } catch (error) {
        console.error("Error finding room:", error);
        return res.status(400).json({ message: error.message });
    }
});

router.post("/addroom",async(req,res)=>{
    try {
        const newroom=new Room(req.body)
        await newroom.save()

        res.send('New Room Added Successfully')
    } 
    catch (error) {
        return res.status(400).json({error})
    }
})
module.exports=router