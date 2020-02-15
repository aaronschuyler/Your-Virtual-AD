var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  username: String,
    password: String,
    accessLevel: String,
    team: String,
    organization: String,
    email: String,
    phone: String
});

PostSchema.index({
  username: 1
}, {
  unique: true,
});

var User = mongoose.model("User", PostSchema);
module.exports = User;