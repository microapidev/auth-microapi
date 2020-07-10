const authAttempt = require('../models/authAttempt');


const recordAttempt = async (user,state,type) => {
  let newAttempt = new authAttempt({
    user_id: user.id,
    state: state || 'fail',
    type
  });

  let attempt = await newAttempt.save();
  if(!attempt){
    console.log('could not save attempt at this time', new Date().now);
  }
};


module.exports = {
  recordAttempt
};
