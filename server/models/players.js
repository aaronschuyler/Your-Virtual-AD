var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    playerName: String,
    team: String
});

var Players = mongoose.model("Players", PostSchema);
module.exports = Players;