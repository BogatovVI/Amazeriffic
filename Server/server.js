let express = require("express"),
    http = require("http"),
    app = express();
const {connection} = require("mongoose");
let mongoose = require("mongoose");
let mongoDB = 'mongodb://localhost/Amazeriffic';
mongoose.connect(mongoDB);
let ToDoSchema = mongoose.Schema({
    description: String,
    tags: [ String ]
});
let ToDo = mongoose.model("ToDo", ToDoSchema);
app.use(express.static(__dirname + "/Client"));
let server = http.createServer(app).listen(8000);
app.use(express.urlencoded());
app.get("/todos.json", function (req, res) {
    ToDo.find({}, function (err, toDos){
        res.json(toDos);
    });
});
app.post("/todos", function (req, res) {
    console.log(req.body);
    let newToDo = new ToDo({"description":req.body.description, "tags":req.body.tags});
    newToDo.save(function (err, result) {
        if (err !== null) {
            console.log(err);
            res.send("ERROR");
        } else {
            ToDo.find({}, function (err, result) {
                if (err !== null) {
                    res.send("ERROR");
                }
                res.json(result);
            });
        }
    });
});