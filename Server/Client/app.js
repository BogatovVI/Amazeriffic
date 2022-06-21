let liaWithDeleteOnClick = function(todo) {
    let $todoListItem = $("<li>").text(todo.description),
        $todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);
    $todoRemoveLink.text("Удалить");
    console.log("todo._id: " + todo._id);
    console.log("todo.description: " + todo.description);
    $todoRemoveLink.on("click", function () {
        $.ajax({
            "url": "todos/" + todo._id,
            "type": "DELETE"
        }).done(function (response) {
            $(".tabs a:first-child span").trigger("click");
        }).fail(function (err) {
            console.log("error on delete 'todo'!");
        });
        return false;
    });
    $todoListItem.append($todoRemoveLink);
    return $todoListItem;
};

let liaWithEditOnClick = function (todo) {
    let $todoListItem = $("<li>").text(todo.description),
        $todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);
    $todoRemoveLink.text("Редактировать");
    $todoRemoveLink.on("click", function () {
        let newDescription = prompt("Введите новое наименование для задачи",
            todo.description);
        if (newDescription !== null && newDescription.trim() !== "") {
            $.ajax({
                url: "todos/" + todo._id,
                type: "PUT",
                data: { "description": newDescription }
            }).done(function (response) {
                $(".tabs a:nth-child(2) span").trigger("click");
            }).fail(function (err) {
            });
        }
        return false;
    });
    $todoListItem.append($todoRemoveLink);
    return $todoListItem;
};


let main = function (toDoObject) {
    "use strict";
    let toDos = toDoObject.map(function (toDo){
        return toDo.description;
    });
    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            let $element = $(element), $content;
            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();
            if ($element.parent().is(":nth-child(1)")) {//Новые
                $content = $("<ul>");
                for (let i = toDoObject.length - 1; i > -1; i--) {
                    let $todoListItem = liaWithDeleteOnClick(toDoObject[i]);
                    $content.append($todoListItem);
                }
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(2)")) {//Старые
                $content = $("<ul>");
                for (let i = 0; i < toDoObject.length; i++) {
                    let $todoListItem = liaWithEditOnClick(toDoObject[i]);
                    $content.append($todoListItem);
                }
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(3)")){//Вкладка с тегами
                let organizeByTags = function (toDoObject) {
                    let tags = [];
                    toDoObject.forEach(function (toDo) {
                        toDo.tags.forEach(function (tag) {
                            if (tags.indexOf(tag) === -1) {
                                tags.push(tag);
                            }
                        });
                    });
                    return tags.map(function (tag) {
                        let toDosWithTag = [];
                        toDoObject.forEach(function (toDo) {
                            if (toDo.tags.indexOf(tag) !== -1) {
                                toDosWithTag.push(toDo.description);
                            }
                        });
                        return {"name": tag, "toDos": toDosWithTag};
                    });
                };
                let organizedByTagResult = organizeByTags(toDoObject);
                organizedByTagResult.forEach(function (tag) {
                    let $tagName = $("<h3>").text(tag.name), $content = $("<ul>");
                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });
                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });
            } else if ($element.parent().is(":nth-child(4)")) {//Вкладка добавления новых задач
                $("main .content").append("Описание", $(document.createElement('input')).prop({
                    className: 'text-1'
                }));
                $("main .content").append("Тэги", $(document.createElement('input')).prop({
                    className: 'text-2'
                }));
                $("main .content").append($(document.createElement('button')).prop({
                    className: 'add-text'
                }));
                $(".add-text").on('click', function (){
                    let description = $('.text-1').val().split(",");
                    let tags = $('.text-2').val().split(",");
                    let newToDo = {"description":description, "tags":tags};
                    $.post("todos", newToDo, function (result){
                        console.log(result);
                    });
                    toDoObject.push(newToDo);
                    toDos = toDoObject.map(function (toDo) {
                        return toDo.description;
                    });
                });
            }
            return false;
        });
    });
    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});