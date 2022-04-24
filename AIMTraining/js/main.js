window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
//---Константы---//
let diff = 1;
let count = 0;
let clicks = 0;
let clicksOnTarget = 0;
let timerId;
let timer2Id;
let IsTraining = false;
//---------------//


//------Функции--------//


//Установка сложности//
function setDifficulty() {
    let difficult = document.getElementById("setDifficulty").value;
    console.log(difficult);
    switch(difficult){
        case 'normal': diff = 1; console.log(diff); break;
        case 'hard': diff = 1.3; console.log(diff); break;
        case 'nightmare': diff = 1.5; console.log(diff); break;
    }
}
//____________________//


//Счётчик мишеней//
function makeCounter() {
    let count = 0;
    return function () {
        return count++;
    }
};
//_______________//

//Счётчик кликов//
document.addEventListener("click", () => {
    clicks++;
    console.log(clicks);
});
//_____________//

//Функция создания мишени//
function createTarget(params) {
    let count = counter();
    // случайно задаём координаты
    x = Math.round(75 + Math.random() * window.innerWidth * 0.85);
    y = Math.round(75 + Math.random() * window.innerHeight * 0.75);
    // Создаём мишень
    target = new Target(x, y, count, params);
}
//______________________//

//Конец тренировки//
function endTraining() {
    var targets = document.getElementsByClassName('container');
    while (targets[0]) {
        targets[0].parentNode.removeChild(targets[0]);
    }
    IsTraining = false;
    if(clicks < clicksOnTarget) {
        clicks = clicksOnTarget;
    }
    clicks === 0 || clicksOnTarget === 0? alert("Вы не сделали выстрелов по мишени") : 
    //вывод результата
    alert(`        Вы набрали ${count} очков за ${clicksOnTarget} попаданий.
        Среднее количество очков за выстрел = ${(count/clicksOnTarget).toFixed(2)}.
        Процент попадайний ${(100 * (clicksOnTarget / clicks)).toFixed(2)}% (${clicksOnTarget} / ${clicks})`);

    count = 0;
    clicks = 0;
    clicksOnTarget = 0;
}
//______________//

//-------------------------//

let counter = makeCounter();

window.onload = function () {

    //тренировка по статичным мишеням
    document.getElementById("startStatic").addEventListener("click", () => {
        if (!IsTraining) {
            //задаём начальные параметры
            IsTraining = true;
            clicks = -1;
            count = 0;
            clicksOnTarget = 0;
            setDifficulty();
            createTarget(); createTarget();

            //создаём мишени
            timerId = setInterval(() => {
                createTarget();
            }, 1000 / diff);

            //конец тренировки
            timer2Id = setTimeout(() => {
                clearInterval(timerId);
                if(IsTraining === true) {
                    endTraining();
                }
                console.log(123);
                IsTraining = false;
                //удаляем оставшиеся элементы
            }, 10000);
        } else {
            alert("Тренировка идёт в данный момент");
        }
    });


    //тренировка по статичным мишеням
    document.getElementById("startMoving").addEventListener("click", () => {
        if (!IsTraining) {
            //задаём начальные параметры
            IsTraining = true;
            clicks = -1;
            count = 0;
            clicksOnTarget = 0;
            setDifficulty();
            createTarget('moving'); createTarget('moving');

            //создаём мишени
            timerId = setInterval(() => {
                createTarget('moving');
            }, 750 / diff);

            //конец тренировки
            timer2Id = setTimeout(() => {
                clearInterval(timerId);
                //удаляем оставшиеся элементы
                if(IsTraining) {
                    endTraining();
                }
            }, 10000);
        } else {
            alert("Тренировка идёт в данный момент");
        }
    });


    //Принудительное прекращение тренировки
    document.getElementById("cancel").addEventListener("click", () => {
        if(IsTraining){
            clearInterval(timerId);
            clearTimeout(timer2Id);
            //удаляем оставшиеся элементы
            endTraining();
        }
    });
}
