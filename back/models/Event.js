const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String, // e.g., "Lecture", "Exam", "Lab", "Defense"
        required: true
    },
    image: {
        type: String, // URL to the image
        default: 'https://placehold.co/600x400?text=Saepe+Event'
    },
    isTopNews: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Event', eventSchema);