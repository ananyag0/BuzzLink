const express = require('express');
const cors = require('cors');
const auth = require('./auth');

const app = express();

const port = 8001;

app.use(cors());
app.use(express.json());

async function runServer() {

  const db = await auth.getDb();
  const users = db.collection('users');

  app.post('/register', auth.emailPasswordChecker, async (req, res) => {

    // request body may be something like this
    const { email, password, nickname } = req.body;

    if (!nickname) {
      res.status(400).send('No nickname provided');
      return;
    }

    // Check if there exists an account with the same email
    const found = await users.findOne({ email });
    if (found) {
      res.status(400).send('Email already exists');
      return;
    }

    // hash the password and then insert into db
    const hashed = await auth.hashPassword(password);
    const insertBody = {
      email,
      password: hashed,
      nickname
    };

    try {
      await users.insertOne(insertBody);
      res.send('Register succeeds');
    } catch (err) {
      console.log('error when trying to insert: ', insertBody);
      console.log('err: ', err);
      res.status(400).send('Register fails');
    }

  });

  app.post('/login', auth.emailPasswordChecker, async (req, res) => {
    const { email, password } = req.body;
    const found = await users.findOne({ email });

    // if not such email
    if (found === null) {
      res.status(400).send('The email is not registered');
      return;
    }

    // If the password is incorrect, end there
    // Otherwise, generate and send back the token
    const match = await auth.verifyPassword(password, found.password);
    if (!match) {
      res.status(400).send('The password is incorrect');
      return;
    }

    const tokenPayload = {
      id: found._id,
      nickname: found.nickname,
      email: found.email,
    };
    const token = auth.getToken(tokenPayload);
    res.send(token);

  });

  app.post('/reset-password', auth.tokenVerifier, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      res.status(400).send('No new password provided');
      return;
    } 

    // hash the new password and then update the db
    const newHashedPassword = await auth.hashPassword(newPassword);
    try {
      await users.updateOne({
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

  app.get('/hello', (req, res) => {
    res.send('The answer for hello!');
  });

  app.listen(port, () => {
    console.log('the server is running at: ', port);
  });
}

runServer();



