'use strict';

(function () {
    var app = angular.module('todoApp', []);

    function randomNumbers() {
        var arr = [];
        var duplicateIds = [];
        var minNumber = 0;
        var maxNumber = 9;
        var numbersCount = 10;
        var duplicatesCount = 3;
        var duplicateSameNumberMoreThanOnce = false;

        for (var i = 1; i <= 1000 && arr.length < numbersCount; i++) {
            var randomNumber = getRandomInt(minNumber, maxNumber); //range
            if (!arrContainsNumber(arr, randomNumber)) {
                arr.push(randomNumber);
            }
        }

        if (arr.length !== numbersCount) {
            console.error(minNumber, maxNumber, numbersCount, arr);
            throw new Error('failed to generate random numbers..');
        }

        while (duplicatesCount * 2 > duplicateIds.length && duplicateIds.length < arr.length) {
            var randSourceId = getRandomInt(0, numbersCount - 1);
            var randTargetId = getRandomInt(0, numbersCount - 1);

            var duplicateNumber = false;

            if (randSourceId !== randTargetId && !arrContainsNumber(duplicateIds, randTargetId)) {
                if (duplicateSameNumberMoreThanOnce) {
                    duplicateNumber = true;
                } else if (!arrContainsNumber(duplicateIds, randSourceId)) {
                    duplicateNumber = true;
                }
            }

            if (duplicateNumber) {
                arr[randTargetId] = arr[randSourceId];
                duplicateIds.push(randSourceId);
                duplicateIds.push(randTargetId);
                //console.log(arr[randTargetId]);
            }
        }

        console.log(arr);
        return arr;
    }

    function arrContainsNumber(arr, number) {
        return arr.some(function (el) {
            return el === number;
        })
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    app.controller('MainCtrl', function ($scope) {
        $scope.randomNumber = randomNumbers;

    });
})();
