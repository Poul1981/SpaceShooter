$(function () {
    let enemy = $(".enemy");
    let shooter = $(".shooter");
    let missile = $(".missel");
    let bomb = $(".bomb");
    let shooter_bar = $(".shooter_bar");
    let enemy_bar = $(".enemy_bar");
    let popup = $(".popup");
    let pop_content = $(".popup_content");
    let closed = $(".popup_close");
    // let left_arrow = $(".arrow_left");
    // let right_arrow = $(".arrow_right");

    ////////////////////////////////
    let trigger = $(".popup_trigger");
    trigger.on("click", modalWindow);
    ////////////////////////////////

    //// закрыть модальное окно
    closed.on("click", (event) => {
        popup.removeClass("active");
        pop_content.removeClass("active");
        event.preventDefault();
    });
    ////////////////////////////////////////////////////////////////
    $(window).resize(() => {
        distance = $(".container").height() - 70;
        console.log(`дистанция -${distance}`);
        duration = distance / speed;
        console.log(`продолжительность полета -${duration}`);
    });
    ////////////////////////////////

    let direction = 50;//скорость движения защитника
    let speed = 1;// скорость движения бомбы 1000px/sec

    let distance = $(".container").height() - 70; //расстояние полета ракеты/бомбы
    let duration = distance / speed;//продолжительность полета ракеты/бомбы
    console.log(`продолжительность полета -${duration}`);
    let enemy_life = 200;
    let shooter_life = 200;

    //идентификатор движения
    let move;
    //flag for button
    let down = false;

    missile.hide();
    bomb.hide();
    let timerForBomb = setInterval(lanchBomb, 500);

    function lanchBomb() {
        let positionEnemy = enemy.position().left;
        let bomb = $("<div class='bomb'></div>");
        $(".container").prepend(bomb);
        bomb.css("left", positionEnemy + 40);
        bomb.animate({ top: `+=${distance}px` }, duration, "linear");
        setTimeout(() => {
            //определяем результат бомбардировки
            let bomb1 = document.querySelectorAll(".bomb");
            // console.log(`bombs count ${bomb1.length}`);
            let shooter1 = document.querySelector(".shooter");
            if (testCollision(bomb1[0], shooter1) || testCollision(bomb1[1], shooter1)) {
                //бомба попала в цель
                // bomb.remove();
                shooter.css({
                    "background": "url(img/unoDamage.png) no-repeat center",
                    "object-fit": "cover",
                    "background-size": "contain",
                });
                shooter_life -= 5;
                doDamage(shooter_bar, shooter_life);
                setTimeout(() => {
                    shooter.css({
                        "background": "url(img/uno1.png) no-repeat center",
                        "object-fit": "cover",
                        "background-size": "contain",
                    });
                }, 300);
            }
            bomb.width(100).height(100);
            bomb.css({
                "background": "url(img/boom.png) no-repeat center",
                "object-fit": "cover"
            });
            bomb.remove();
        }, duration);
    }

    function doDamage(bar, life) {
        bar.width(life);
        //проконтроллировать изменение размеров контейнера!
        distance = $(".container").height() - 70
        ////////////////////////////////

        if (life < 1) {
            // alert(`${bar.attr("data-desc")} победил!`)
            let message = bar.attr("data-desc");
            modalWindow(message);
        }
    }

    function modalWindow(mes) {
        popup.addClass("active");
        pop_content.addClass("active");
        if (mes == "Враг") {
            $(".popup_title").text("Поражение!")
            $(".popup_text p").text("Защитник пал под натиском врага...")
            shooter.hide();
        }
        else {
            clearInterval(timerForBomb);
            enemy.css("animation-play-state", "paused");
            enemy.hide();
        }
    }

    function testCollision(div1, div2) {
        let i = div1.getBoundingClientRect();
        let j = div2.getBoundingClientRect();
        return i.top + i.height > j.top &&
            i.left + i.width > j.left &&
            i.bottom - i.height < j.bottom &&
            i.right - i.width < j.right;
    }

    $("html").keydown(function (event) {
        let pos = shooter.position().left;
        let container_width = $(".container").width();

        //button to left
        if (event.which == "37" && pos > -10) {
            moveLeftOreRight(-direction, pos, container_width);
        }

        //button to right
        if (event.which == "39" && pos < (container_width - 80)) {
            moveLeftOreRight(direction, pos, container_width);
        }
    });

    //toch-screen
    // shooter.on("touchmove", (e) => {
    //     // if (down) return;
    //     // down = true;
    //     clearInterval(move);
    //     console.log("left");
    //     e.stopPropagation();
    //     let pos = shooter.position().left + 72;
    //     let container_width = $(".container").width();
    //     let toch = parseInt(e.changedTouches[0].clientX);
    //     let vector = Math.abs(toch - pos);
    //     // console.log("pos = " + pos);
    //     // console.log("toch = " + toch);
    //     // let vector = toch - pos;
    //     // if (vector < 0 && vector > -20) vector = -20;
    //     // if (vector >= 0 && vector < 20) vector = 20;
    //     if (pos > -10 && pos < (container_width)) {
    //         // shooter.css("left", (pos + vector / 1));
    // if ((toch - pos) > 0) {
    //     shooter.animate({ left: `+=${vector * 2}` }, 50, "linear");
    // }
    //         else {
    //             shooter.animate({ left: `-=${vector * 2}` }, 50, "linear");
    //         }
    //     }
    // });

    // Шутер летит к месту прикосновения
    $(".container").on("click", (e) => {
        let posX = shooter.offset().left + 50;
        let posY = shooter.offset().top;
        // lanchMissile(pos);
        // console.log("start");
        let x = parseInt(e.clientX);
        let y = parseInt(e.clientY);
        let go = x - posX;
        if (y > posY) {
            shooter.animate({ left: `+=${go}px` }, 50, "linear");
        }
        e.stopPropagation();

    });

    // 

    shooter.on("touchend", () => {
        shooter.stop(true);
        down = false;
        let pos = shooter.position().left;
        let container_width = $(".container").width();
        if (pos < -15) {
            shooter.css("left", 30);
        };
        if (pos > container_width - 80) {
            shooter.css("left", container_width - 100);
        }
    });

    //toch-screen right
    // right_arrow.on("touchmove", (e) => {
    //     clearInterval(move);
    //     console.log("right");
    //     e.stopPropagation();
    //     let pos = shooter.position().left;
    //     let toch = parseInt(e.changedTouches[0].clientX);
    //     let vector = ((toch - pos) <= 20) ? 0 : (toch - pos);
    //     // if (vector <= 0) vector = 0;
    //     let container_width = $(".container").width();
    //     if (pos < (container_width - 80)) {
    //         // moveLeftOreRight(direction, pos, container_width);
    //         shooter.css("left", (pos + vector / 3));
    //     }
    // });

    //если клавиша отжата
    $("html").keyup(function (event) {
        let pos = shooter.position().left;
        if (event.which == "37" || event.which == "39") {
            down = false;
            clearInterval(move);
        }
        if (event.which == "32") {
            lanchMissile(pos);
        }
    });

    /// для тач-скрина запуск ракеты
    $(".container").on("click", (e) => {
        let pos = shooter.position().left;
        lanchMissile(pos);
        // console.log("start");
        e.stopPropagation();
    });


    function moveLeftOreRight(direction, pos, width) {
        if (down) return;
        down = true;
        // clearInterval(move);
        move = setInterval(() => {
            shooter.css("left", pos);
            pos += direction;
            if (pos < -20 || pos > (width - 80)) {
                clearInterval(move);
            }
        }, 100);
    }
    //запуск ракеты
    function lanchMissile(pos) {
        let mis = $("<div class='missel'></div>");
        $(".container").append(mis);
        mis.css("left", pos + 45);
        mis.animate({ top: `-=${distance}px` }, duration, "linear");
        // mis.animate({ top: "-=900px" }, { duration: 800, easing: "linear" });
        setTimeout(() => {
            //результат попадания
            let missel1 = document.querySelectorAll(".missel");
            // console.log(`missel count ${missel1.length}`);
            let enemy1 = document.querySelector(".enemy");
            if (testCollision(missel1[1], enemy1)) {
                //если ракета попала во врага
                mis.remove();
                enemy.css({
                    "background": "url(img/catUfoDamage.png) no-repeat center",
                    "object-fit": "cover",
                    "background-size": "contain",
                });
                enemy_life -= 5;
                doDamage(enemy_bar, enemy_life);
                setTimeout(() => {
                    enemy.css({
                        "background": "url(img/catUfo.png) no-repeat center",
                        "object-fit": "cover",
                        "background-size": "contain",
                    });
                }, 300);
            }
            mis.remove()
        }, duration);//через какое время ракета самоуничтожается
    }
})

