(function () {
    "use strict";

    var R = require("../vendor/ramda/dist/ramda");
    var three = require("../vendor/threejs/build/three");
    var colour = require("./colour");
    var dt = require("./dt");

    var number, factor, range, size, gap, offset, lift, cubes, group;

    var rgbPosition = function (val) {
        return (val * (size + gap)) - offset;
    };

    var hslPosition = function (hsl) {
        var blockSize = number * ((size + gap) * 2);

        var x = ((hsl[2] - 0.5) * blockSize); // adjust by -0.5 to center on 0

        var r = hsl[1] * number * 2;

        var theta = ((hsl[0] / 360) * 2 * Math.PI); // get value in radians
        theta += (1.2 * Math.PI); // rotate to be with blue at front

        var y = r * Math.cos(theta);
        var z = r * Math.sin(theta);

        return [x, y, z];
    };

    var value = function (x) {
        return Math.round(x * factor);
    };

    var create = function (rGrid, gGrid, bGrid) {
        var rgb = R.map(value, [rGrid, gGrid, bGrid]);

        var color = "rgb(" + rgb.join(",") + ")";
        var geometry = new three.BoxGeometry(size, size, size);
        var material = new three.MeshBasicMaterial({ color: color, transparent: true, opacity: 1 });

        var cube = new three.Mesh(geometry, material);

        var hsl = colour.hsl.apply(null, rgb);

        cube.userData.rgb = rgb;
        cube.userData.rgbCoordinates = R.map(rgbPosition, [rGrid, gGrid, bGrid]);
        cube.userData.hsl = hsl;
        cube.userData.hslCoordinates = hslPosition(hsl);

        return cube;
    };

    var initialise = function (num) {
        number = num;
        factor = 255 / (number - 1);
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
            var coords = cube.userData.rgbCoordinates;

            dt.animate(cube.position, "x", coords[0], 5000);
            dt.animate(cube.position, "y", coords[1], 5000);
            dt.animate(cube.position, "z", coords[2], 5000);
        }, cubes);
    };

    var toHSL = function () {
        R.forEach(function (cube) {
            var coords = cube.userData.hslCoordinates;

            dt.animate(cube.position, "x", coords[0], 5000);
            dt.animate(cube.position, "y", coords[1], 5000);
            dt.animate(cube.position, "z", coords[2], 5000);
        }, cubes);
    };

    var defaults = {
        saturation: {
            min: 0,
            max: 1
        },
        lightness: {
            min: 0,
            max: 1
        },
        red: {
            min: 0,
            max: 255
        },
        green: {
            min: 0,
            max: 255
        },
        blue: {
            min: 0,
            max: 255
        }
    };

    var limits;

    var renderLimits = function () {
        R.forEach(function (cube) {
            var hsl = cube.userData.hsl,
                rgb = cube.userData.rgb;

            if (
                hsl[1] >= limits.saturation.min &&
                hsl[2] >= limits.lightness.min &&
                hsl[1] <= limits.saturation.max &&
                hsl[2] <= limits.lightness.max &&

                rgb[0] >= limits.red.min &&
                rgb[0] <= limits.red.max &&
                rgb[1] >= limits.green.min &&
                rgb[1] <= limits.green.max &&
                rgb[2] >= limits.blue.min &&
                rgb[2] <= limits.blue.max
            ) {
                dt.animate(cube.material, "opacity", 1, 1000);
            } else {
                dt.animate(cube.material, "opacity", 0, 1000);
            }
        }, cubes);
    };

    var setLimit = function (type, minMax, val) {
        limits[type][minMax] = val;
        renderLimits();
    };

    var setLimits = function (limitSet) {
        R.forEach(function (limit) {
            limits[limit[0]][limit[1]] = limit[2];
        }, limitSet);

        renderLimits();
    };

    var resetLimits = function () {
        limits = R.clone(defaults);
    };

    resetLimits();

    module.exports = {
        initialise: initialise,
        toHSL: toHSL,
        toRGB: toRGB,
        setLimit: setLimit,
        setLimits: setLimits,
        resetLimits: function () {
            resetLimits();
            renderLimits();
        }
    };
}());
