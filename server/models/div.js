var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    divName: String
});

var Div = mongoose.model("Div", PostSchema);
module.exports = Div;