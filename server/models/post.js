var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;
var volunteerSchema = new Schema({
    name: String,
    email: String,
    phone: Number,
    position: String
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
    home: {
        type: Boolean,
        required: true
    },
    gameSite: {
        type: String,
        required: true
    },
    display: Boolean,
    volunteers: [volunteerSchema]
});
volunteerSchema.index({
    email: 1
}, {
    unique: true
})
volunteerSchema.plugin(uniqueValidator)
PostSchema.plugin(uniqueValidator)
var Post = mongoose.model("Game", PostSchema);
module.exports = Post;
