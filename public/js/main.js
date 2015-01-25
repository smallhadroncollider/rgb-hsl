(function () {
    "use strict";

    var view = require("./scene");
    var dt = require("./dt");
    var cubes = require("./cubes");

    view.initialise(window.innerWidth, 500, 0x808080);
    view.appendTo(document.body);

    var number = 10;
    view.getCamera().position.z = number * 6;

    var group = cubes.initialise(number);
    group.rotation.x = Math.PI / 4;
    group.rotation.y = - Math.PI / 4;
    view.getScene().add(group);

    cubes.toRGB();
    view.render();

    /**
     * Interaction
     */
    var $ = require("./select");
    var R = require("../vendor/ramda/ramda");


    $("hsl").onclick = cubes.toHSL;
    $("rgb").onclick = cubes.toRGB;

    var setupSlider = function (type, minMax) {
        var slider = $(type + "-" + minMax);
        var valueText = $(type + "-" + minMax + "-value");

        slider.oninput = function () {
            valueText.innerHTML = slider.value;
        };

        slider.onchange = function () {
            cubes.setHSLLimit(type, minMax, slider.value);
            valueText.innerHTML = slider.value;
        };
    };

    var lift = R.liftN(2, R.curryN(2, setupSlider));
    lift(["saturation", "lightness"], ["max", "min"]);

    var rotate = 0.1 / Math.PI;

    var animating = true;
    var animate = $("animate");

    animate.addEventListener("change", function () {
        animating = animate.checked;
    });

    dt.add(function (dt) {
        if (animating) {
            group.rotation.x += Math.PI / (8000/dt);
            group.rotation.y += Math.PI / (8000/dt);
        }
    });

    var camera = view.getCamera();

    window.onkeydown = function (e) {
        var pd = e.preventDefault.bind(e);

        switch (e.keyCode) {
            case 37: group.rotation.y -= rotate; pd(); break; // right
            case 38: group.rotation.x -= rotate; pd(); break; // up
            case 39: group.rotation.y += rotate; pd(); break; // left
            case 40: group.rotation.x += rotate; pd(); break; // down

            case 68: camera.position.x += 1; pd(); break; // d
            case 87: camera.position.z -= 1; pd(); break; // w
            case 65: camera.position.x -= 1; pd(); break; // a
            case 83: camera.position.z += 1; pd(); break; // s
        }
    };
}());
