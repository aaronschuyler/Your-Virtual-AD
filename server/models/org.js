var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ContactSchema = new Schema({
    name: String,
    email: String,
    phone: Number
})
var GymSchema = new Schema({
    gymName: String,
    streetAddress: String,
    addressLine2: String,
    city: String,
    state: String,
    zip: Number,
    sport: String
})
var PostSchema = new Schema({
    orgName: String,
    description: String,
    streetAddress: String,
    addressLine2: String,
    city: String,
    state: String,
    zip: Number,
    contacts: [ContactSchema],
    gymLocations: [GymSchema]
});

var Org = mongoose.model("Org", PostSchema);
module.exports = Org;
