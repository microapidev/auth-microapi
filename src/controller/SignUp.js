const UserModel = require('../models/user')
const { User } = require('../models') 

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
            // console.log(res.status)
            return res.json('inserted')  
        } catch (error) {
            console.log(error)   
        } 
    }
}