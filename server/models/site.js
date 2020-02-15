var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  siteName: String,
    organization: String,
    adress: String
    
});

var Site = mongoose.model("Site", PostSchema);
module.exports = Site;