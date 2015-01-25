(function (document) {
    "use strict";

    var select = function (id) {
        return document.getElementById(id);
    };

    module.exports = select;
}(document));
