const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'buzzlink~secretKey~';

/**
 * return a db instance for test
 * */
async function getDb() {
  const myUrl = 'mongodb://localhost:27017';
  const dbName = 'test';
  const client = new mongodb.MongoClient(myUrl);
  await client.connect();
  const db = client.db(dbName);
  return db;
}

/**
 * hash a password and return it
 * @return hashed password
 * */
async function hashPassword(password) {
  const round = 10;
  const hashed = await bcrypt.hash(password, round);
  return hashed;
}

/**
 * verify the password with the hashed password
 * @return boolean indicating if they match
 * */
async function verifyPassword(password, hashed) {
  try {
    const result = await bcrypt.compare(password, hashed);
    return result;
  } catch (err) {
    console.log('error when verifying password with bcrypt: ', err);
    return false;
  }
}

/**
 * <p>This middleware verifies if the request headers contain valid token </p>
 * <p>If it does, parse the content of token and store it in req.tokenBody </p>
 * <p>Otherwise, immediately end the response. </p>
 * The middleware should be used before most APIs that require some authorization.
 * */
function tokenVerifier(req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
  const tokenBody = verifyToken(token);
  if (!tokenBody) {
    res.status(400).send('Invalid token');
  } else {
    req.tokenBody = tokenBody;
    next();
  }
}

/**
 * This middleware checks if the request body contains non-null email and password
 * */
function emailPasswordChecker(req, res, next) {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).send('No email provided');
  } else if (!password) {
    res.status(400).send('No password provided');
  } else {
    next();
  }
}

/**
 * Generate a token that contains the given payload and expires in 1 hour
 * @return the token
 * */
function getToken(payload) {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: '1h',
  });
  return token;
}

function verifyToken(token) {
  try {
    const body = jwt.verify(token, secretKey);
    return body;
  } catch (err) {
    console.log('err: ', err);
    console.log('invalid token: ', token);
    return false;
  }
}

module.exports = {
  getDb,
  hashPassword,
  verifyPassword,
  getToken,
  tokenVerifier,
  emailPasswordChecker,
};