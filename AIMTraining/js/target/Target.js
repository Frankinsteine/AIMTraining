
// Класс описывает мишени
class Target {
    //Описание статичной мишени
    Target = {
        divName: "container",
        imgRadius: 80,
        imgName: "src/target.png",
        className: "Target"
    }
    //Описание движущейся мишени
    MovingTarget = {
        divName: "container",
        imgRadius: 60,
        imgName: "src/MovingTarget.png",
        className: "MovingTarget"
    }

    MouseOver = false;

    constructor(x, y, id, params, size = 10) {
        // в зависимости от переданного параметра устанавливаем статичную или динамичную мишень
        if (params === 'moving') {
            params = this.MovingTarget;
        } else {
            params = this.Target;
        }

        if (!document.getElementById(id)) {
            this.mainDiv = document.createElement('div');
            this.mainDiv.className = params.divName;
            this.mainDiv.id = id;
            this.mainDiv.style.left = (x - params.imgRadius - 7) + "px";
            this.mainDiv.style.top = (y - params.imgRadius - 7) + "px";
            document.body.appendChild(this.mainDiv);
        }
        this.imgId = document.createElement('img');
        this.imgId.src = params.imgName;
        this.imgId.className = params.className;
        this.imgId.style.width = size / 10 * params.imgRadius * 2 + "px";
        this.imgId.style.height = size / 10 * params.imgRadius * 2 + "px";
        this.mainDiv = document.getElementById(id);
        this.mainDiv.appendChild(this.imgId);
        this.x = x;
        this.y = y;
        this.size = size;
        // если мишень динамическая, то устанавливаем движение
        if (params.className === 'MovingTarget') {
            this.move();
        };
        // добавляем событие выстрела
        this.mainDiv.addEventListener("click", (event) => {
            count += this.shot(event.clientX, event.clientY, params);
            clicksOnTarget++;
            this.mainDiv.removeChild(this.imgId);
        });
    }

    //Выстрел по мишени
    shot(x, y, params) {
        let distance = 10 * Math.sqrt(Math.pow((this.x - x - 16), 2) + Math.pow((this.y - y - 16), 2)) / params.imgRadius;
        let result;
        //если статичная
        if (params.className === 'Target') {
            if (distance < 0.5) {
                return 11
            }
            if (distance <= 10) {
                result = 10 - Math.trunc(distance) * this.size / 10;
                return result;
            }
            if (distance > 10) {
                return 0;
            }
        }
        // если динамическая
        distance *= 0.69;
        if (distance < 0.2) {
            return 10
        }
        if (distance <= 7) {
            result = 9 - Math.trunc(distance) * this.size / 10;
            return result;
        }
        if (distance > 7) {
            return 0;
        }
    }
    //Движение мишени
    move() {
        // задаём случайные координаты для мишени 
        let x = Math.round(50 + Math.random() * window.innerWidth * 0.85);
        let y = Math.round(50 + Math.random() * window.innerHeight * 0.75);

        // задаём смещение по осям
        let dx = (x - this.x) / 250;
        let dy = (y - this.y) / 250;

        //изменяем координаты центра через малые промежутки времени
        let timerId = setInterval(() => {
            this.x += dx;
            this.y += dy;
            // колдовство О_0
            requestAnimationFrame(() => {
                this.mainDiv.style.left = this.x - this.MovingTarget.imgRadius + "px";
                this.mainDiv.style.top = this.y - this.MovingTarget.imgRadius + "px";
            });
        }, 20);

        // Прекращаем движение в одну сторону и заново рекурсивно вызываем функцию!
        //                                         вот тута
        //                                          |||
        setTimeout(() => { clearInterval(timerId); this.move(); }, 3000);
    }
}