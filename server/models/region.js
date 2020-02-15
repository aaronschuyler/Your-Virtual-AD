var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  regionName: String
    
});

var Region = mongoose.model("Region", PostSchema);
module.exports = Region;