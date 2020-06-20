const UserModel = require('../models/user')
const { User } = require('../models') 
const JWT = require('jsonwebtoken');
const JWT_SECRET = 'secrt' 
 

const signToken = user => {
    return JWT.sign({
      iss: 'CodeWorkr',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET);
  }



module.exports = {
    SignUp : async  (req,res) => {
        try {
            const { email, username , password , IsAdmin} = req.body
            const foundUser = await User.findOne({ "email": email });
            if (foundUser) { 
                return res.status(403).json({ error: 'Email is already in use'});
            } 
            const newUser = new User({ email ,  password , username ,IsAdmin });
            await newUser.save();   

            // Generate the token
            const token = signToken(newUser);
            // Respond with token
            res.status(200).json({ token }); 
        } catch (error) {
            console.log(error)   
        } 
    }
}