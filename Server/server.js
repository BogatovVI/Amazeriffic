let express = require("express"),
    http = require("http"),
    app = express();
const {connection} = require("mongoose");
let mongoose = require("mongoose");
let mongoDB = 'mongodb://localhost/Amazeriffic';
mongoose.connect(mongoDB);
let User = require("../Server/models/user");
let ToDoSchema = mongoose.Schema({
    description: [ String ],
    tags: [ String ],
    owner : { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
let UserController = {};
let ToDosController = {};

// проверка, не существует ли уже пользователь
User.find({}, function (err, result) {
    if (err !== null) {
        console.log("Что-то идет не так");
        console.log(err);
    } else if (result.length === 0) {
        console.log("Создание тестового пользователя...");
        let exampleUser = new User({ "username" : "VladB" });
        exampleUser.save(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Тестовый пользователь сохранен");
            }
        });
    }
});

UserController.index = function (req, res){
    console.log("Вызвано действие индекс");
    res.send(200);
};
// Отобразить пользователя
UserController.show = function (req, res) {
    console.log("вызвано действие: показать");
    res.send(200);
};
// Создать нового пользователя
UserController.create = function (req, res) {
    console.log("вызвано действие: создать");
    res.send(200);
};
// Обновить существующего пользователя
UserController.update = function (req, res) {
    console.log("вызвано действие: обновить");
    res.send(200);
};
// Удалить существующего пользователя
UserController.destroy = function (req, res) {
    console.log("destroy action called");
    res.send(200);
};
module.exports = UserController;

ToDosController.index = function (req, res) {
    let username = req.params.username || null, respondWithToDos;
    respondWithToDos = function (query) {
        ToDo.find(query, function (err, toDos) {
            if (err !== null) {
                res.json(500, err);
            } else {
                res.status(200).json(toDos);
            }
        });
    };
    if (username !== null) {
        User.find({"username": username}, function (err, result) {
            if (err !== null) {
                res.json(500, err);
            } else if (result.length === 0) {
                res.status(404).json({"result_length" : 0});
            } else {
                respondWithToDos({"owner": result[0]._id});
            }
        });
    }else {
        respondWithToDos({});
    }
};

ToDosController.create = function (req, res) {
    let username = req.params.username || null,
        newToDo = new ToDo({"description": req.body.description, "tags": req.body.tags});
    User.find({"username": username}, function (err, result) {
        if (err) {
            res.send(500);
        }else {
            if (result.length === 0) {
                newToDo.owner = null;
            } else {
                newToDo.owner = result[0]._id;
            }
            newToDo.save(function (err, result) {
                if (err !== null) {
                    res.json(500, err);
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });
};

ToDosController.destroy = function (req, res) {
    let id = req.params.id;
    ToDo.deleteOne({"_id": id}, function (err, todo) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (todo.n === 1 && todo.ok === 1 && todo.deletedCount === 1) {
                res.status(200).json(todo);
            } else {
                res.status(404).json({"status": 404});
            }
        }
    });
};

ToDosController.update = function (req, res) {
    let id = req.params.id;
    let newDescription = {$set: {description: req.body.description}};
    ToDo.updateOne({"_id": id}, newDescription, function (err, todo) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (todo.n === 1 && todo.nModified === 1 && todo.ok === 1) {
                res.status(200).json(todo);
            } else {
                res.status(404).json({"status": 404});
            }
        }
    });
};
module.exports = ToDosController;

let ToDo = mongoose.model("ToDo", ToDoSchema);
module.exports = ToDo;
app.use(express.static(__dirname + "/Client"));
app.use('/user/:username', express.static(__dirname + '/Client'));
let server = http.createServer(app).listen(8000);
app.use(express.urlencoded({ extended: true }));
app.get("/users.json", UserController.index);
app.post("/users", UserController.create);
app.get("/users/:username", UserController.show);
app.put("/users/:username", UserController.update);
app.delete("/users/:username", UserController.destroy);
app.get("/user/:username/todos.json", ToDosController.index);
app.post("/user/:username/todos", ToDosController.create);
app.put("/user/:username/todos/:id", ToDosController.update);
app.delete("/user/:username/todos/:id", ToDosController.destroy);
app.get("/todos.json", function (req, res) {
    ToDo.find({ }, function (err, toDos){
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