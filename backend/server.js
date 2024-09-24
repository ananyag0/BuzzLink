const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const port = 8001;

//Connect to MongoDB
mongoose.connect('mongodb+srv://krishkp00:urFavMRfZYDYF0Ez@buzzlinkcluster.7figs.mongodb.net/?retryWrites=true&w=majority&appName=BuzzLinkCluster');

mongoose.connection.once("open", function() {
  console.log("MongoDB connection established");
});

const usersSchema = new mongoose.Schema({
  displayName: String,
  email: Boolean,
  password: String,
});

const roomsSchema = new mongoose.Schema({
  roomName: String,
  roomType: String,
  particpantLimit: Number,
  participants: [{ type: app.mongoose.Schema.ObjectId, ref: 'Users'}]
});

const sessionsSchema = new mongoose.Schema({
  
});

const Users = mongoose.model('Users', usersSchema);
const Rooms = mongoose.model('Rooms', roomsSchema);
const Sessions = mongoose.model('Sessions', sessionsSchema);


app.use(cors());

app.get('/hello', (req, res) => {
  res.send('The answer for hello!');
});

app.listen(port, () => {
  console.log('the server is running at: ', port);
});



