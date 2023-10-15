const mongoose  = require('mongoose');

const Schema = mongoose.Schema({
    firstname: {
        type: 'string',
        required: true
    },
    lastname: {
        type: 'string',
        required: true
    },
    email: {
        type: String,
         required: true
    },
    mobno: {
        type: Number,
         required: true
    },
    education: {
        type: String,
    },
    collegeName: {
        type: String,
    },
    courseEnrolledIn: {
        type: Array,
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