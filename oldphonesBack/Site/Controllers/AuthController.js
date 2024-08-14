const {
  models : {
    Users
  }
} = require('../Models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {userRegisterSchema} = require('../Helpers/joiSchemas');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const { use } = require('passport');
const client = new OAuth2Client(process.env.CLIENT_ID);

exports.signup = async (req, res) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
      const user = await Users.findOne({email : req.body.email})
      if(user){
        return  res.status(409).send({msg : "Account already exists! Please Login."});
      }
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const userDetails = {
        name,
        email,
        gender,
        dob,
        phone
      } = req.body;
      userDetails["password"] = hashedPassword;
      await Users.create(userDetails);
      res.status(200).send({
        status : 200,
        msg : "success"
      })
  }
  catch(err){
    res.status(500).send({msg : err.message});
  }
}

exports.login = async (req, res) => {
  try {

    if (req.body.email && req.body.email.trim() !== "") {
      const user = await Users.findOne({ email: { $regex: new RegExp(req.body.email, 'i') } });
      if (user && !user.googleId) {
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (valid == true) {  
          const token = jwt.sign(
            { 
              email : user.email,
              _id : user._id,
              name: user.name
            },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
          );
          const refreshToken = jwt.sign({
            name: user.name,
            _id : user._id,
            email : user.email
          }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
          res.cookie('jwt', refreshToken, {
              httpOnly: true,
              sameSite: 'None', secure: true,
              maxAge: 24 * 60 * 60 * 1000
          });
          res
          .status(200)
          .json({ token, msg: "Token alloted successfully!" });
        }
        else {
          res
          .status(400)
          .send({ error: " Password did not match!"});
        }
      }
      else if (user && user.googleId) {
				res
				  .status(400)
				  .json({ error: "No account found with this Email! SignUp" });
			}
      else if(!user) {
        res
          .status(400)
          .send({ error: "No account found with this Email! SignUp" });
      }
    }
  else {
    res.status(400).json({error: "Email is required and cannot be empty."});
  }
  }
  catch(err){
    res.status(500).send({msg : err.message});
  }
}

exports.refresh = async (req, res) => {
  try {
    if (req.cookies?.jwt) {
      const refreshToken = req.cookies.jwt;
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
              if (err) {
                  return res.status(406).json({message : 'Unauthorized'});
              }
              else {
                  const accessToken = jwt.sign({
                      username : userCredentials.username,
                      email : userCredentials.email
                  }, process.env.ACCESS_TOKEN_SECRET, {
                      expiresIn : '10m'
                  });
                  return res.json({accessToken});
              }
           })
    }
    else {
        return res.status(406).json({ message: 'Unauthorized' });
    }
  }
  catch(err){
    res.status(500).send(err.message)
  }
}
 
exports.oAuthRedirect = async (req, res) => {
  try {
        const { accessToken }  = req.body
        const ticket = await client.verifyIdToken({
            idToken : accessToken,
            audience : process.env.CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { name, email, sub : googleId, birthday, phoneNumber } = payload;
        let user = await Users.findOneAndUpdate(
            { email : email },
            { name, email, googleId },
            { new : true, upsert : true } 
        );
        const jwtToken = jwt.sign({ 
          name : user.name,
          _id : user._id,
          email : user.email
         }, process.env.SECRET_KEY, { expiresIn : '1h' });
        res.status( 201 ).json( jwtToken );
    } catch ( error ) {
        res.status( 500 ).json({ error : 'Failed to authenticate with Google' });
    }
}
