(function () {
    "use strict";

    var view = require("./scene");
    var dt = require("./dt");
    var cubes = require("./cubes");

    view.initialise(1000, 600, 0x808080);
    view.appendTo(document.body);

    var number = 12;
    view.getCamera().position.z = number * 6;

    var group = cubes.initialise(number);
    view.getScene().add(group);

    cubes.toRGB();
    view.render();

    /**
     * Interaction
     */
    var $ = require("./select");

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


    // add generic function to keep rerender
    // this is dumb, should only do it while key down
    dt.add(function () {});

    var rotate = 0.1 / Math.PI;
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
