// длительность игры
let time = 60;

// панель выбора уровня сложности
document.addEventListener("click", function(e) {
    if (e.target.className == "complexity_item") {
        document.getElementById("complexity").innerHTML = e.target.innerHTML;
        var x = document.getElementsByClassName("complexity_item");
        for (var i = 0; i < x.length; i++) {
            x[i].style.backgroundColor = '#ebebeb';
        }
        e.target.style.backgroundColor = '#999999';
    }
});

// рандом
function random(max) {
    return Math.floor(Math.random() * (max));
}

// настройка игры перед началом
function gameSetting() {
    // выбор имени игрока
    var input = document.getElementById("nickname").value;
    if (input != "") {
        document.getElementById("nickname_container").innerHTML = input;
        document.getElementById("nickname").style.backgroundColor = '#80d350';
    }

    // вывод таблицы игр и рекорда
    let record = JSON.parse(localStorage.getItem(input));
    if (record != null) {
        var highScore = 0; // рекорд игрока
        record.forEach(element => {
            if (parseInt(element.score) > highScore) highScore = element.score;

            // таблица игр игрока
            var score = document.getElementById("score_sidebar").innerHTML;
            document.getElementById("score_sidebar").innerHTML = score + '<p> Имя игрока: ' + element.nickname + '<br> Счет: ' + element.score + '<br> Время и дата игры: ' + element.currentTime + '</p>';
        });
        document.getElementById("record_container").innerHTML = highScore;
    } else {
        document.getElementById("record_container").innerHTML = '0';
    }
}

// смена цветовой темы
document.getElementById("theme").onclick = function() {
    document.getElementById("settings").classList.toggle('darkTheme');
    document.getElementById("header").classList.toggle('darkTheme');
    document.getElementById("wrapper").classList.toggle('darkTheme');
}

//--------------------- НАЧАЛО ИГРЫ -----------------------

// проверка произведения настройки; запуск и остановка таймера
document.getElementById("start_button").onclick = function() {
    if ((document.getElementById("nickname_container").innerHTML != "") && (document.getElementById("complexity").innerHTML != "")) {
        if (document.getElementById("start_button").innerHTML == "Закончить") {
            time = 0;
        } else {
            countDown();
        }
        if (document.getElementById("start_button").innerHTML == "Перезапустить") {
            time = 20;
        }
        document.getElementById("start_button").innerHTML = "Закончить";
        document.getElementById("cards__body").style.display = 'block';
        document.getElementById("task_container").style.display = 'block';
        genCards();
    } else {
        alert("Произведите настройку игры, чтобы начать");
    }
}


// ход таймера и связанные с ним события
function countDown() {
    var timeinterval = setInterval(updateTimer, 1000);
    document.getElementById("score").innerHTML = '0';

    function updateTimer() {
        timer.innerHTML = time + ' сек';
        time--;

        animatedShifts();

        // конец игры
        if (time < 0) {
            clearInterval(timeinterval);
            gamesEnd();
            let result = gameResult();

            // перезапись общего результата с учетом нового
            if (record != null) {
                var playersScores = record;
            } else {
                var playersScores = [];
            }
            playersScores.push(result);
            localStorage.setItem(nickname, JSON.stringify(playersScores));

            // перезапись таблицы игр и рекорда
            var highScore = 0;
            document.getElementById("score_sidebar").innerHTML = '';
            playersScores.forEach(element => {
                if (parseInt(element.score) > highScore) highScore = element.score;
                var score = document.getElementById("score_sidebar").innerHTML;
                document.getElementById("score_sidebar").innerHTML = score + '<p> Имя игрока: ' + element.nickname + '<br> Счет: ' + element.score + '<br> Время и дата игры: ' + element.currentTime + '</p>';
            });
            document.getElementById("record_container").innerHTML = highScore;
        }
    }
}

// анимация сдвигов
function animatedShifts() {
    if ((time % 2 == 0) && (document.getElementById("complexity").innerHTML == "Средний")) {
        var i = time % 8;
        document.getElementById("card_container" + i).classList.add('animateInTime');
    }
}

// объявление конца игры
function gamesEnd() {
    timer.innerHTML = 'Время вышло';
    document.getElementById("cards__body").style.display = 'none';
    document.getElementById("start_button").innerHTML = "Перезапустить";
    document.getElementById("task_container").style.display = 'none';
    document.getElementById("answer_container").style.display = 'none';
}

// запись результата игры
function gameResult() {
    let nickname = document.getElementById("nickname_container").innerHTML;
    let score = document.getElementById("score").innerHTML;
    let record = JSON.parse(localStorage.getItem(nickname));
    let result = {
        nickname,
        score,
        currentTime: new Date()
    }
    return result;
}

// генерация уровня
function genCards() {
    var colorArr = ['#ff69b4', '#9400d3', '#000080', '#87ceeb', '#008000', '#ffff00', '#ff8c00', '#ff0000', '#808080'];
    var wordArr = ['РОЗОВЫЙ', 'ФИОЛЕТОВЫЙ', 'СИНИЙ', 'ГОЛУБОЙ', 'ЗЕЛЕНЫЙ', 'ЖЕЛТЫЙ', 'ОРАНЖЕВЫЙ', 'КРАСНЫЙ', 'СЕРЫЙ'];
    var colorArrCopy = colorArr.slice();
    var wordArrCopy = wordArr.slice();
    var colorWCopy = colorArr.slice();
    var cardsBC = [];
    var cardsWC = [];
    var cardsW = [];
    var cB = 0;
    var cW = 0;
    var w = 0;
    var level = document.getElementById("complexity").innerHTML;

    switch (level) {
        case "Легкий":
        case "Средний":
            for (var i = 0; i < 8; i++) {
                cB = random(colorArrCopy.length);
                cardsBC.push(colorArrCopy[cB]);
                var c = colorArrCopy[cB];
                colorArrCopy.splice(cB, 1);
                cW = random(colorWCopy.length);
                while (c === colorWCopy[cW]) {
                    cW = random(colorWCopy.length);
                }
                cardsWC.push(colorWCopy[cW]);
                colorWCopy.splice(cW, 1);
                w = random(wordArrCopy.length);
                cardsW.push(wordArrCopy[w]);
                wordArrCopy.splice(w, 1);
            }
            break;
        case "Сложный":
            for (var i = 0; i < 6; i++) {
                cB = random(colorArrCopy.length);
                cardsBC.push(colorArrCopy[cB]);
                var c = colorArrCopy[cB];
                colorArrCopy.splice(cB, 1);
                cW = random(colorWCopy.length);
                while (c === colorWCopy[cW]) {
                    cW = random(colorWCopy.length);
                }
                cardsWC.push(colorWCopy[cW]);
                colorWCopy.splice(cW, 1);
                w = random(wordArrCopy.length);
                cardsW.push(wordArrCopy[w]);
                wordArrCopy.splice(w, 1);
            }
            break;
    }

    // вывод задания соответствующего уровню
    switch (level) {
        case "Легкий":
            document.getElementById("text_task").innerHTML = 'Найдите карточки, на которых слово обозначает этот цвет:';
            break;
        case "Средний":
            document.getElementById("text_task").innerHTML = 'Найдите карточки этого цвета:';
            break;
        case "Сложный":
            document.getElementById("text_task").innerHTML = 'Перетащите в зеленое поле карточки, на которых буквы этого цвета:';
            document.getElementById("cards__body").style.columnCount = '1';
            document.getElementById("cards__body").style.width = '50%';
            document.getElementById("answer_container").style.display = 'block';
            break;
    }

    var wordLevel = genLevel(cardsW, cardsBC, cardsWC, colorArr, wordArr, level);
    document.getElementById("answer").innerHTML = wordLevel;
    updateCards(cardsBC, cardsWC, cardsW, wordLevel, level);
    makeGrag();
}

function makeGrag() {
    var arr = document.querySelectorAll('.card_container');
    arr.forEach(e => {
        e.ondragstart = drag;
    });
}

// генерация правильного ответа
function genLevel(cardsW, cardsBC, cardsWC, colorArr, wordArr, level) {
    if (level == "Легкий") {
        var ind = random(cardsW.length);
        var value = cardsW[ind];
        var color = colorArr[wordArr.indexOf(value)];
        document.getElementById("color").style.backgroundColor = color;
    }
    if (level == "Средний") {
        var ind = random(cardsBC.length);
        var color = cardsBC[ind];
        document.getElementById("color").style.backgroundColor = color;
        var value = cardsW[ind];
    }
    if (level == "Сложный") {
        var ind = random(cardsWC.length);
        var color = cardsWC[ind];
        document.getElementById("color").style.backgroundColor = color;
        var value = cardsW[ind];
    }
    return value;
}

// вывод сгенерированного уровня на экран
function updateCards(cardsBC, cardsWC, cardsW, wordLevel, level) {
    // выбор количества карточек в зависимости от уровня
    var n;
    switch (level) {
        case "Легкий":
            n = 8;
            break;
        case "Средний":
            n = 8;
            break;
        case "Сложный":
            n = 6;
            break;
    }

    cards__body.innerHTML = "";
    for (var i = 0; i < n; i++) {
        var card = document.createElement('div');
        card.setAttribute("class", "card_container");
        card.setAttribute("id", "card_container" + i);
        var levelScore;
        switch (level) {
            case "Легкий":
                levelScore = 1;
                break;
            case "Средний":
                levelScore = 2;
                break;
            case "Сложный":
                levelScore = 3;
                card.draggable = "true";
                break;
        }

        // создания проверки верности ответа
        if (level != "Сложный") {
            card.onclick = function() {
                if (this.innerHTML === wordLevel) {
                    this.innerHTML = 'Правильно';
                    scoreCount(true, levelScore);
                } else {
                    this.classList.add('animateEnd');
                    scoreCount(false, levelScore);
                }
            }
        }

        card.style.color = cardsWC[i];
        card.style.backgroundColor = cardsBC[i];
        card.innerHTML = cardsW[i];
        cards__body.append(card);
    }

}

function drag(e) {
    e.dataTransfer.setData('id', e.target.id);
}
// подсчет очков в зависимости от уровня
function scoreCount(correct, levelScore) {
    var s = score.innerHTML;
    if (correct) {
        document.getElementById("score").innerHTML = Number(s) + 2 * levelScore;
        genCards();
    } else if (s > 0) {
        score.innerHTML = Number(s) - 1 * levelScore;
    }
}


// ---------------- ПЕРЕТАСКИВАНИЕ --------------------------

const zone1 = document.getElementById('cards__body');
const zone2 = document.getElementById('answer_container');

zone2.ondragover = allowDrop;

function allowDrop(event) {
    event.preventDefault();
}

zone2.ondrop = drop;

function drop(event) {
    let levelScore = 3;
    let itemId = event.dataTransfer.getData('id');
    console.log(itemId);
    if (document.getElementById(itemId).innerHTML === document.getElementById("answer").innerHTML) {
        document.getElementById("result").innerHTML = 'Правильно';
        document.getElementById("result").style.display = 'block';
        setTimeout(sayHello, 1000);
        document.getElementById(itemId).style.display = 'none';
        scoreCount(true, levelScore);
    } else {
        document.getElementById("result").innerHTML = 'Неправильно';
        document.getElementById("result").style.display = 'block';
        setTimeout(sayHello, 1000);
        scoreCount(false, levelScore);
    }
}

function sayHello() {
    document.getElementById("result").style.display = 'none';
}
