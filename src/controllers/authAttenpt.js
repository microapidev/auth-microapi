const AuthAttempt = require('../models/authAttempt');


const getTotalSuccessful = async (req,res) => {
  const attempts = await AuthAttempt.find({state: 'successful'})
    .populate('user_id');

    if(!attempts.length){
        res.status(200).send({
            message: 'No attempts found',
            success: true
        })
    }

    res.status(200).send({
        message: 'Attempts found',
        success: true,
        data: {
            attempt_count: attempts.length,
            attempts
        }
    })

};


module.exports = {getTotalSuccessful}