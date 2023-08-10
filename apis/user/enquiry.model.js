const mongoose  = require('mongoose');

const Schema = mongoose.Schema({
    fullName: {
        type: 'string',
        required: true
    },
    phoneNumber: {
        type: Number,
         required: true
    },
    altPhoneNumber:{
        type: Number,
         required: true
    },
    email: {
        type: String,
         required: true
    },
    education: {
        type: String,
         required: true
    },
    collegeName: {
        type: String,
         required: true
    },
    courseEnrolledIn: {
        type: Array,
        required: true
    },
    contactMessage: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "new"
    }
});

module.exports = mongoose.model('Enquiry', Schema);