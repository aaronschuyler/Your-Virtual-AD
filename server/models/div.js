var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    divName: String
});
PostSchema.index({
    divName: 1
}, {
    unique: true,
});
var Div = mongoose.model("Div", PostSchema);
module.exports = Div;
