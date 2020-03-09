var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var practiceSchema = new Schema({
    date: Date,
    note: ""
})
var memoSchema = new Schema({
    date: Date,
    title: String,
    body: String,
    author: String
})
var PostSchema = new Schema({
    teamName: String,
    coach: String,
    organization: String,
    division: String,
    region: String,
    display: Boolean,
    published: Boolean,
    sport: String,
    blockedDates: Array,
    players: Array,
    practice: [practiceSchema],
    memo: [memoSchema],
    teamPage: {
        coverImage: String,
        featuredImage: String,
        description: String,
        facebook: String,
        instagram: String
    }

});
PostSchema.index({
    teamName: 1
}, {
    unique: true,
});


var Team = mongoose.model("Team", PostSchema);
module.exports = Team;
