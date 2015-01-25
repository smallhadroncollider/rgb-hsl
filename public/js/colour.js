(function () {
    "use strict";

    var R = require("../vendor/ramda/ramda");

    module.exports = {
        hsl: function (r, g, b) {
            r = r / 255;
            g = g / 255;
            b = b / 255;

            var rgb = [r, g, b];
            var cMax = R.max(rgb);
            var cMin = R.min(rgb);
            var c = cMax - cMin;

            var l = (cMax + cMin) / 2;
            var s = c === 0 ? 0 : (c / (1 - Math.abs((2 * l) - 1)));
            var h;

            if (c) {
                if (r >= g && r >= b) {
                    h = 60 * (((g - b)/c) % 6);
                } else if (g >= r && g >= b) {
                    h = 60 * (((b - r)/c) + 2);
                } else if (b >= r && b >= g) {
                    h = 60 * (((r - g)/c) + 4);
                }
            } else {
                h = 0;
            }

            return [h, s, l];
        }
    };
}());
