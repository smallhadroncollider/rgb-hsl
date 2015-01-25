(function () {
    "use strict";

    var three = require("../vendor/threejs/build/three");

    var renderer, scene, camera;

    var initialise = function (width, height, background) {
        renderer = new three.WebGLRenderer();
        renderer.setSize(width, height);

        if (background) {
            renderer.setClearColor(background, 1);
        }

        scene = new three.Scene();
        camera = new three.PerspectiveCamera(75, width/height, 0.1, 1000);
    };

    var appendTo = function (element) {
        if (!renderer) {
            throw new Error("Renderer has not been initialised");
        }

        element.appendChild(renderer.domElement);
    };

    module.exports = {
        initialise: initialise,
        appendTo: appendTo,
        render: function () {
            renderer.render(scene, camera);
        },
        getScene: function () {
            return scene;
        },
        getCamera: function () {
            return camera;
        }
    };
}());
