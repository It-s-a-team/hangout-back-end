'use strict';

/* REQUIRE */
// jwt - JSON Web Token package
// pronounced: 'jot'
const jwt = require('jsonwebtoken');

// jwks - JSON Web Key Set package
// (pronounced Ja-wicks)
const jwksClient = require('jwks-rsa');

// don't forget to 'npm i jsonwebtoken jwks-rsa

// the jwks uri comes from Auth0 account page -> advanced settings -> Endpoints -> 0auth -> JSON Web Key Set
const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

// this function will process the key and do the magic for us
// function is from the jsonwebtoken docs
// https://www.npmjs.com/package/jsonwebtoken
// (search for auth0)
function getKey(header, callback)
{
  client.getSigningKey(header.kid, function (err, key)
  {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// function to verify's token
// this is just how we do it
// errorFirstOrUserCallback is a callback function to just deny a request if the requester isn't who they say they are without even trying to run the function
function verifyUser(token, errorFirstOrUserCallback)
{
  try
  {
    // get the auth0/jwt token from the client's request
    // the `.verify()` method is from the jwt package we imported/required
    // `getKey` is the function above this one, from the jwt docs
    // go to https://www.npmjs.com/package/jsonwebtoken
    // use `ctrl+f` and search for: `Verify using getKey callback` to get an example
    jwt.verify(token, getKey, {}, errorFirstOrUserCallback);
  }
  catch (error)
  {
    errorFirstOrUserCallback('Your token is bunk, my friend');
  }
}

// export our 'verifyUser' function to use when a client attempts to connect to a socket
module.exports = verifyUser;
