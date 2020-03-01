var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var volunteerSchema = new Schema({
    name: String,
    email: String,
    phone: Number
})
var PostSchema = new Schema({
    team1: {
        type: String,
        required: true
    },
    team2: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    gameSite: {
        type: String,
        required: true
    },
    display: Boolean,
    volunteers: [volunteerSchema]
});

var Post = mongoose.model("Game", PostSchema);
module.exports = Post;
