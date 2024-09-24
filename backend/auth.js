const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'buzzlink~secretKey~';

/**
 * return a testing db instance
 * @return db
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
 * hash a password and return the hashed result
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
 * <p>This middleware verifies if the request headers contain valid token. </p>
 * <p>If it does, parse the content of token and store it in req.tokenBody. </p>
 * <p>Otherwise, immediately end the response with status 400. </p>
 * The middleware should be used before most APIs that require some authorization.
 * */
function tokenVerifier(req, res, next) {
  try {
    var token = req.headers['authorization'].split(' ')[1];
  } catch (err) {
    console.log('err when reading spliting authorization header, the headers are ', req.headers);
    console.log('err: ', err);
    res.status(400).send('Invalid token');
    return;
  }
  const tokenBody = verifyToken(token);
  if (!tokenBody) {
    console.log('invalid token');
    res.status(400).send('Invalid token');
  } else {
    req.tokenBody = tokenBody;
    next();
  }
}

/**
 * <p>This middleware checks if the request body contains non-null email </p>
 * <p>If the email is absent, the response is sent back with status 400 </p>
 * */
function emailChecker(req, res, next) {
  if (!req.body.email) {
    res.status(400).send('No email provided');
  } else {
    next();
  }
}

/**
 * <p>This middleware checks if the request body contains non-null password </p>
 * <p>If the password is absent, the response is sent back with status 400 </p>
 * */
function passwordChecker(req, res, next) {
  if (!req.body.password) {
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

/**
 * a helper function used in tokenVerifier
 * @param token to verify
 * @return the token body if succeeds or false otherwise
 * */
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
  emailChecker,
  passwordChecker,
};
