let main = function () {
    "use strict";
    let toDos = [
        "Закончить писать эту книгу",
        "Вывести Грейси на прогулку в парк",
        "Ответить на электронные письма",
        "Подготовиться к лекции в понедельник",
        "Обновить несколько новых задач",
        "Купить продукты"
    ];
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
                toDos.forEach(function (todo){
                    $content.append($("<li>").text(todo));
                })
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(3)")) {
                $("main .content").append($(document.createElement('input')).prop({
                    className: 'text'
                }));
                $("main .content").append($(document.createElement('button')).prop({
                    className: 'add-text'
                }));
                $(".add-text").on('click', function (){
                    toDos.push($('.text').val());
                });
            }
            return false;
        });
    });
    $(".tabs a:first-child span").trigger("click");
};

main();