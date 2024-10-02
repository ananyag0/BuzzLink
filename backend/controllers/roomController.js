const Room = require('../models/RoomModel')
const mongoose = require('mongoose')

const getRoom = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such room'})
    }

    const room = await Room.findById(id)

    if(!room) {
        return res.status(404).json({error: 'No such room'})
    }
    res.status(200).json(room)
}

const getRooms = async (req, res) => {
  
    const rooms = await Room.find({}).sort({createdAt: -1})

    if(!rooms) {
        return res.status(404).json({error: 'No such room'})
    }

    res.status(200).json(rooms)
}

const createRoom = async (req, res) => {
   
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
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such room'})
    }

    const room = await Room.findOneAndDelete({_id: id})

    if (!room) {
        return res.status(400).json({error: 'No such room'})
    }

    res.status(200).json(room)
}

const updateRoom = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such room'})
    }

    const room = await Room.findOneAndUpdate({_id: id}, {
        ...req.body}, )

    if (!room) {
        return res.status(400).json({error: 'No such room'})
    }

    const updatedRoom = await Room.findById(id)

    res.status(200).json(updatedRoom)
}

module.exports = {
    createRoom, 
    getRooms, 
    getRoom, 
    deleteRoom, 
    updateRoom
}