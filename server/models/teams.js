var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  teamName: String,
    coach: String,
    organization: String,
    division: String,
    region: String,
    display: Boolean,
    sport: String,
    blockedDates: Array,
    players: Array,
    teamPage: {
        coverImage: String,
        featuredImage: String,
        description: String,
        facebook: String,
        instagram: String       
}
    
});

var Team = mongoose.model("Team", PostSchema);
module.exports = Team;