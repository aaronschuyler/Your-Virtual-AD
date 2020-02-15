var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    sport: String
});
PostSchema.index({
    sport: 1
}, {
    unique: true,
});
var Sport = mongoose.model("Sport", PostSchema);
module.exports = Sport;
