let toDoObjects = [
    {
        "description" : "Купить продукты",
        "tags" : [ "шопинг", "рутина" ]
    },
    {
        "description" : "Сделать несколько новых задач",
        "tags" : [ "писательство", "работа" ]
    },
    {
        "description" : "Подготовиться к лекции в понедельник",
        "tags" : [ "работа", "преподавание" ]
    },
    {
        "description" : "Ответить на электронные письма",
        "tags" : [ "работа" ]
    },
    {
        "description" : "Вывести Грейси на прогулку в парк",
        "tags" : [ "рутина", "питомцы" ]
    },
    {
        "description" : "Закончить писать книгу",
        "tags" : [ "писательство", "работа" ]
    }
]

let organizeByTags = function (toDoObjects) {
    let tags = [];
    toDoObjects.forEach(function (toDo) {
        toDo.tags.forEach(function (tag) {
            if (tags.indexOf(tag) === -1) {
                tags.push(tag);
            }
        });
    });
    let tagObjects = tags.map(function (tag) {
        let toDosWithTag = [];
        toDoObjects.forEach(function (toDo) {
            if (toDo.tags.indexOf(tag) !== -1) {
                toDosWithTag.push(toDo.description);
            }
        });
        return { "name": tag, "toDos": toDosWithTag };
    });
    console.log(tagObjects);
};

let test_main = function () {
    "use strict";
    organizeByTags(toDoObjects);
};
$(document).ready(test_main);