(function () {
    "use strict";

    var $ = require("./select");

    var view = require("./scene");
    var dt = require("./dt");
    var cubes = require("./cubes");

    view.initialise(1000, 600, 0x808080);
    view.appendTo(document.body);

    var number = 12;
    view.getCamera().position.z = number * 6;

    var group = cubes.initialise(number);
    view.getScene().add(group);

    $("hsl").onclick = cubes.toHSL;
    $("rgb").onclick = cubes.toRGB;

    var saturationSlider = $("saturation");

    saturationSlider.oninput = function () {
        $("saturation-value").innerHTML = saturationSlider.value;
    };
    saturationSlider.onchange = function () {
        cubes.saturation(saturationSlider.value);
        $("saturation-value").innerHTML = saturationSlider.value;
    };

    cubes.toRGB();
    view.render();

    var rotate = 0.1 / Math.PI;
    dt.add(function () {});

    window.onkeydown = function (e) {
        switch (e.keyCode) {
            case 37: group.rotation.y -= rotate; e.preventDefault(); break; // right
            case 38: group.rotation.x -= rotate; e.preventDefault(); break; // up
            case 39: group.rotation.y += rotate; e.preventDefault(); break; // left
            case 40: group.rotation.x += rotate; e.preventDefault(); break; // down

            case 68: view.getCamera().position.x += 1; e.preventDefault(); break; // d
            case 87: view.getCamera().position.z -= 1; e.preventDefault(); break; // w
            case 65: view.getCamera().position.x -= 1; e.preventDefault(); break; // a
            case 83: view.getCamera().position.z += 1; e.preventDefault(); break; // s
        }
    };
}());
