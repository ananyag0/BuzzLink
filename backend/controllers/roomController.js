const Room = require('../models/RoomModel')
const mongoose = require('mongoose')

const getRoom = async (req, res) => {
    
}

const getRooms = async (req, res) => {
    console.log("we received a GET request")
    //res.send("We received your get request")

    const rooms = await Room.find({}).sort({createdAt: -1})

    if(!rooms) {
        return res.status(404).json({error: 'No such room'})
    }

    res.status(200).json(rooms)
}

const createRoom = async (req, res) => {
    console.log("we received a POST request")
    console.log("the body of the request is", req.body)
    

    const {roomName, roomType, participantLimit} = req.body

    if(participantLimit <= 0){
        return res.status(400).json({error: 'participantLimit must be greater than 0'})
    }

    //add document to db
    try {
        const room = await Room.create({roomName, roomType, participantLimit})
        res.status(200).json(room)

    }catch (error){
        res.status(400).json({error: error.message})
    }
}
    
const deleteRoom = async (req, res) => {
    
}

const updateRoom = async (req, res) => {
    
}

module.exports = {
    createRoom, 
    getRooms, 
    getRoom, 
    deleteRoom, 
    updateRoom
}