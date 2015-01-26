(function () {
    "use strict";

    var R = require("../vendor/ramda/dist/ramda");
    var scene = require("./scene");

    var dt = function () {
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

                    scene.render();
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
    };

    module.exports = dt();
}());
