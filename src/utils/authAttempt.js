const AuthAttempt = require('../models/authAttempt');
const mongoose = require('mongoose');

const recordAttempt = async (user,state,type) => {
  let attemptObj = {
    state: state || 'failed',
    type
  };

  if(mongoose.Types.ObjectId.isValid(user.id)){
    attemptObj.user_id = user.id
  }
  let newAttempt = new AuthAttempt(attemptObj);

  let attempt = await newAttempt.save();
  if(!attempt){
    console.log('could not save attempt at this time', new Date().now);
  }
  console.log('Attempt recorded')
};


module.exports = {
  recordAttempt
};
