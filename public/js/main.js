(function (d) {
    "use strict";

    var R = require("../vendor/ramda/ramda");
    var three = require("../vendor/threejs/build/three");
    var $ = require("./select");
    var colour = require("./colour");

    var scene = new three.Scene();
    var camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new three.WebGLRenderer();
    renderer.setSize(1000, 600);
    renderer.setClearColor(0x808080, 1);
    document.body.appendChild(renderer.domElement);

    var number = 12;
    var factor = 255 / number;

    var range = R.range(0, number);

    var size = 2;
    var gap = 2;
    var offset = number * ((size + gap) / 2);

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

    var lift = R.liftN(3, R.curryN(3, create));
    var cubes = lift(range, range, range);

    var group = new three.Group();
    group.add.apply(group, cubes);
    scene.add(group);

    var dt = (function () {
        var self = {},
            id = 0,
            funcs = {},
            time = 0,
            loop = function (now) {
                requestAnimationFrame(loop);
                var values = R.values(funcs);

                if (values.length) {
                    R.forEach(function (func) {
                        func(now - time);
                    }, values);

                    renderer.render(scene, camera);
                }

                time = now;
            };

        loop(time);

        self.add = function (func) {
            id++;
            funcs[id] = func;
            return id;
        };

        self.remove = function (id) {
            delete(funcs[id]);
        };

        self.animate = function (object, property, newValue, length) {
            var id = self.add(function (dt) {
                if (length <= 0) {
                    self.remove(id);
                    object[property] = newValue;
                }

                var diff = newValue - object[property];
                object[property] += diff / (length/dt);

                length = length - dt;
            });
        };

        return self;
    }());

    dt.add(function () {});

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

    $("hsl").onclick = toHSL;
    $("rgb").onclick = toRGB;

    var saturationSlider = $("saturation");

    saturationSlider.oninput = function () {
        $("saturation-value").innerHTML = saturationSlider.value;
    };
    saturationSlider.onchange = function () {
        saturation(saturationSlider.value);
        $("saturation-value").innerHTML = saturationSlider.value;
    };


    camera.position.z = number * 6;

    toRGB();
    renderer.render(scene, camera);

    var rotate = 0.1 / Math.PI;

    window.onkeydown = function (e) {
        switch (e.keyCode) {
            case 37: group.rotation.y -= rotate; e.preventDefault(); break; // right
            case 38: group.rotation.x -= rotate; e.preventDefault(); break; // up
            case 39: group.rotation.y += rotate; e.preventDefault(); break; // left
            case 40: group.rotation.x += rotate; e.preventDefault(); break; // down

            case 68: camera.position.x += 1; e.preventDefault(); break; // d
            case 87: camera.position.z -= 1; e.preventDefault(); break; // w
            case 65: camera.position.x -= 1; e.preventDefault(); break; // a
            case 83: camera.position.z += 1; e.preventDefault(); break; // s
        }
    };
}(this.document))
