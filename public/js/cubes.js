(function () {
    "use strict";

    var R = require("../vendor/ramda/ramda");
    var three = require("../vendor/threejs/build/three");
    var colour = require("./colour");
    var dt = require("./dt");

    var number, factor, range, size, gap, offset, lift, cubes, group;

    var position = function (val) {
        return (val * (size + gap)) - offset;
    };

    var value = function (x) {
        return Math.round(x * factor);
    };

    var create = function (r, g, b) {
        var rgb = R.map(value, [r, g, b]);

        var color = "rgb(" + rgb.join(",") + ")";
        var geometry = new three.BoxGeometry(size, size, size);
        var material = new three.MeshBasicMaterial({ color: color, transparent: true, opacity: 1 });

        r = position(r);
        g = position(g);
        b = position(b);

        var cube = new three.Mesh(geometry, material);

        cube.userData.rgb = [r, g, b];
        cube.userData.hsl = colour.hsl.apply(null, rgb);

        return cube;
    };

    var initialise = function (num) {
        number = num;
        factor = 255 / number;
        range = R.range(0, number);
        size = 2;
        gap = 2;
        offset = number * ((size + gap) / 2);

        lift = R.liftN(3, R.curryN(3, create));
        cubes = lift(range, range, range);

        group = new three.Group();
        group.add.apply(group, cubes);

        return group;
    };

    var toRGB = function () {
        R.forEach(function (cube) {
            dt.animate(cube.position, "x", cube.userData.rgb[0], 5000);
            dt.animate(cube.position, "y", cube.userData.rgb[1], 5000);
            dt.animate(cube.position, "z", cube.userData.rgb[2], 5000);
        }, cubes);
    };

    var toHSL = function () {
        R.forEach(function (cube) {
            var x = (cube.userData.hsl[2] * number * size * gap * 2) - offset * 1.5;

            var r = cube.userData.hsl[1] * number * 2;
            var theta = ((cube.userData.hsl[0] / 360) * 2 * Math.PI) + (1.2 * Math.PI);
            var y = r * Math.cos(theta);
            var z = r * Math.sin(theta);

            dt.animate(cube.position, "x", x, 5000);
            dt.animate(cube.position, "y", y, 5000);
            dt.animate(cube.position, "z", z, 5000);
        }, cubes);
    };

    var toHSLCube = function () {
        R.forEach(function (cube) {
            dt.animate(cube.position, "x", position((cube.userData.hsl[0] / 360) * factor), 5000);
            dt.animate(cube.position, "y", position(cube.userData.hsl[1] * factor), 5000);
            dt.animate(cube.position, "z", position(cube.userData.hsl[2] * factor), 5000);
        }, cubes);
    };

    var saturation = function (val) {
        R.forEach(function (cube) {
            if (cube.userData.hsl[1] > val) {
                dt.animate(cube.material, "opacity", 1, 1000);
            } else {
                dt.animate(cube.material, "opacity", 0.1, 1000);
            }
        }, cubes);
    };

    module.exports = {
        initialise: initialise,
        toHSL: toHSL,
        toHSLCube: toHSLCube,
        toRGB: toRGB,
        saturation: saturation
    };
}());
