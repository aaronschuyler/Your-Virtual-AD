var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    regionName: String

});
PostSchema.index({
    regionName: 1
}, {
    unique: true,
});
var Region = mongoose.model("Region", PostSchema);
module.exports = Region;
