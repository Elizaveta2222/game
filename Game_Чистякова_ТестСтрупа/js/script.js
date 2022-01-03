document.addEventListener("click", function(e) {
    if (e.target.className == "complexity_item") {
        document.getElementById("complexity").innerHTML = e.target.innerHTML;
    }
});

function random(max) {
    return Math.floor(Math.random() * (max));
}

let time = 20;

function gameSetting() {
    var input = document.getElementById("nickname").value;
    if (input != "") {
        document.getElementById("nickname_container").innerHTML = input;
    }
    let record = JSON.parse(localStorage.getItem(input));
    if (record == null) {
        document.getElementById("record_container").innerHTML = '0';
    } else {
        document.getElementById("record_container").innerHTML = record.score;
    }
}
document.getElementById("theme").onclick = function() {
    document.getElementById("settings").classList.toggle('darkTheme');
    document.getElementById("header").classList.toggle('darkTheme');
    document.getElementById("wrapper").classList.toggle('darkTheme');


}

document.getElementById("start_button").onclick = function() {
    if ((document.getElementById("nickname_container").innerHTML != "") && (document.getElementById("complexity").innerHTML != "")) {
        countDown();
        if (document.getElementById("start_button").innerHTML == "Закончить") {
            time = 0;
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

function countDown() {
    var timeinterval = setInterval(updateTimer, 1000);
    document.getElementById("score").innerHTML = '0';

    function updateTimer() {
        timer.innerHTML = time + ' сек';
        time--;
        if ((time % 2 == 0) && (document.getElementById("complexity").innerHTML == "Сложный")) {
            var i = time % 8;
            document.getElementById("card_container" + i).classList.add('animateInTime');
        }

        if (time < 0) {
            clearInterval(timeinterval);
            timer.innerHTML = 'Время вышло';
            document.getElementById("cards__body").style.display = 'none';
            document.getElementById("start_button").innerHTML = "Перезапустить";
            document.getElementById("task_container").style.display = 'none';
            let nickname = document.getElementById("nickname_container").innerHTML;
            let score = document.getElementById("score").innerHTML;
            let result = {
                nickname,
                score,
                currentTime: new Date()
            }
            let record = JSON.parse(localStorage.getItem(nickname));
            let recordScore = 0;
            if (record != null) {
                recordScore = record.score;
            }
            if ((parseInt(recordScore) < parseInt(score))) {
                localStorage.setItem(nickname, JSON.stringify(result));
                document.getElementById("record_container").innerHTML = score;
            }
        }
    }
}

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

    if (level == "Легкий") {
        for (var i = 0; i < 8; i++) {
            cardsBC.push("#FFFFFF");
            var c = colorArrCopy[cB];
            colorArrCopy.splice(cB, 1);
            cW = random(colorWCopy.length);
            cardsWC.push(colorWCopy[cW]);
            colorWCopy.splice(cW, 1);
            w = random(wordArrCopy.length);
            cardsW.push(wordArrCopy[w]);
            wordArrCopy.splice(w, 1);
        }
    } else {
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
    }

    var wordLevel = genLevel(cardsW, colorArr, wordArr);
    updateCards(cardsBC, cardsWC, cardsW, wordLevel);
}

function genLevel(cardsW, colorArr, wordArr) {
    var ind = random(cardsW.length);
    var value = cardsW[ind];
    var color = colorArr[wordArr.indexOf(value)];
    document.getElementById("color").style.backgroundColor = color;
    return value;
}

function updateCards(cardsBC, cardsWC, cardsW, wordLevel) {
    cards__body.innerHTML = "";
    for (var i = 0; i < 8; i++) {
        var card = document.createElement('div');
        card.setAttribute("class", "card_container");
        card.setAttribute("id", "card_container" + i);
        var level = document.getElementById("complexity").innerHTML;
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
                break;
        }

        card.onclick = function() {
            if (this.innerHTML === wordLevel) {
                this.innerHTML = 'Правильно';
                scoreCount(true, levelScore);
            } else {
                this.classList.add('animateEnd');
                scoreCount(false, levelScore);
            }
            //проверяем совпадение слова
        }
        card.style.color = cardsWC[i];
        card.style.backgroundColor = cardsBC[i];
        card.innerHTML = cardsW[i];
        cards__body.append(card);
    }
}

function scoreCount(correct, levelScore) {
    var s = score.innerHTML;
    if (correct) {
        document.getElementById("score").innerHTML = Number(s) + 2 * levelScore;
        genCards();
    } else if (s > 0) {
        score.innerHTML = Number(s) - 1 * levelScore;
    }
}