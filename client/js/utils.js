'use strict';

(function () {
    var drtUtils = {
        arrHasVal: function (arr, val) {
            return arr.some(function (el) {
                return el === val;
            });
        },

        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    window.drtUtils = drtUtils;
})();
