(function () {
    "use strict";

    var R = require("../vendor/ramda/dist/ramda");

    var normalise = R.curry(function (min, max, val) {
        if (val > max) {
            return max;
        } else if (val < min) {
            return min;
        }

        return val;
    });

    var normaliseSL = normalise(0, 1);

    module.exports = {
        hsl: function (red, green, blue) {
            red = red / 255;
            green = green / 255;
            blue = blue / 255;

            var rgb = [red, green, blue];
            var cMax = R.max(rgb);
            var cMin = R.min(rgb);
            var chroma = cMax - cMin;

            var lightness = normaliseSL((cMax + cMin) / 2);
            var saturation = normaliseSL(chroma === 0 ? 0 : (chroma / (1 - Math.abs((2 * lightness) - 1))));
            var hue;

            if (chroma) {
                if (red >= green && red >= blue) {
                    hue = 60 * (((green - blue)/chroma) % 6);
                } else if (green >= red && green >= blue) {
                    hue = 60 * (((blue - red)/chroma) + 2);
                } else if (blue >= red && blue >= green) {
                    hue = 60 * (((red - green)/chroma) + 4);
                }
            } else {
                hue = 0;
            }

            return [hue, saturation, lightness];
        }
    };
}());
