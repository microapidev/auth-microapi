const mongoose = require('mongoose');
const { required } = require('joi');


const authAttemptSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    state: {
        type: String,
        enum: ['successful','failed'],
        required: true
    },
    type: {
        type: String,
        enum: ['google','local','twitter','facebook'],
        required: true,
        default: 'local'
    }
},{timestamps:true});


authAttemptSchema.statics.record = (user,state) => {

}

module.exports = mongoose.model('AuthAttempt',authAttemptSchema);