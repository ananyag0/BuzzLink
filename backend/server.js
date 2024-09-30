const express = require('express');
const cors = require('cors');
const { getToken, emailChecker, hashPassword, passwordChecker, tokenVerifier, verifyPassword } = require('./auth');
const mongoose = require('mongoose');

const app = express();

const port = 8001;

/**
 * The async function initialize the mongodb and returns its models
 * */
async function initMongodb() {

  //Connect to MongoDB

  // url_test is the url of the tesing database
  const url_buzzlink = 'mongodb+srv://krishkp00:urFavMRfZYDYF0Ez@buzzlinkcluster.7figs.mongodb.net/BuzzLink?retryWrites=true&w=majority&appName=BuzzLinkCluster'
  const url_test = 'mongodb+srv://krishkp00:urFavMRfZYDYF0Ez@buzzlinkcluster.7figs.mongodb.net/?retryWrites=true&w=majority&appName=BuzzLinkCluster'

  await mongoose.connect(url_buzzlink);

  console.log('MongoDB connection established');

  const usersSchema = new mongoose.Schema({
    displayName: String,
    email: String, // this was Boolean. I assume it is a typo
    password: String,
  }, {
    collection: 'Users'
  });

  const roomsSchema = new mongoose.Schema({
    roomName: String,
    roomType: String,
    particpantLimit: Number,
    //participants: [{ type: app.mongoose.Schema.ObjectId, ref: 'Users'}]
  }, {
    collection: 'Rooms'
  });

  const sessionsSchema = new mongoose.Schema({
  
  }, {
    collection: 'Sessions'
  });

  const Users = mongoose.model('Users', usersSchema);
  const Rooms = mongoose.model('Rooms', roomsSchema);
  const Sessions = mongoose.model('Sessions', sessionsSchema);

  return { Users, Rooms, Sessions };
}


app.use(cors());

app.use(express.json()); // store request body in req.body

async function runServer() {

  const { Users } = await initMongodb();

  app.post('/register', emailChecker, passwordChecker, async (req, res) => {

    // request body may be something like this
    const { email, password, displayName } = req.body;

    if (!displayName) {
      res.status(400).send('No displayName provided');
      return;
    }

    // Check if there exists an account with the same email
    const found = await Users.findOne({ email });
    if (found) {
      res.status(400).send('Email already exists');
      return;
    }

    // hash the password and then insert into db
    const hashed = await hashPassword(password);
    const insertBody = {
      email,
      password: hashed,
      displayName
    };

    try {
      await Users.create(insertBody);
      res.send('Register succeeds');
    } catch (err) {
      console.log('error when trying to insert: ', insertBody);
      console.log('err: ', err);
      res.status(400).send('Register fails');
    }
  });

  app.post('/login', emailChecker, passwordChecker, async (req, res) => {
    const { email, password } = req.body;
    // const found = await users.findOne({ email });
    const found = await Users.findOne({ email });

    // if not such email
    if (found === null) {
      res.status(400).send('The email is not registered');
      return;
    }

    // If the password is incorrect, end there
    // Otherwise, generate and send back the token
    const match = await verifyPassword(password, found.password);
    if (!match) {
      res.status(400).send('The password is incorrect');
      return;
    }

    const tokenPayload = {
      id: found._id,
      displayName: found.displayName,
      email: found.email,
    };
    const token = getToken(tokenPayload);
    res.send(token);
  });

  app.post('/reset-password', tokenVerifier, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      res.status(400).send('No new password provided');
      return;
    }

    // hash the new password and then update the db
    const newHashedPassword = await hashPassword(newPassword);
    try {
      await Users.updateOne({
        email: req.tokenBody.email
      }, {
        $set: { password: newHashedPassword }
      });
      res.send('Update succeeds');
    } catch (err) {
      console.log('error when updating: ', req.tokenBody);
      console.log('err: ', err);
      res.status(400).send('Update fails');
    }
  });

  app.get('/test', tokenVerifier, async (req, res) => {
    // a test endpoint to get data for a user
    try {
      const result = await Users.findOne({
        email: req.tokenBody.email
      });
      res.send(result);
    } catch (err) {
      console.log('err: ', err);
      res.status(400).send('err ');
    }
  });

  app.get('/hello', (req, res) => {
    res.send('The answer for hello!');
  });

  app.listen(port, () => {
    console.log('the server is running at: ', port);
  });
}

runServer();



