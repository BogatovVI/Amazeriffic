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
            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (let i = toDos.length - 1; i > -1; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                })
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(3)")){
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
            } else if ($element.parent().is(":nth-child(4)")) {
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