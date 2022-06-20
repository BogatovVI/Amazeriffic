let mongoose = require("mongoose");

let UserSchema = mongoose.Schema({
    username: String,
    id: String
});
let User = mongoose.model("User", UserSchema);
module.exports = User;