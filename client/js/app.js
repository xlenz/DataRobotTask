'use strict';

(function () {
    var app = angular.module('todoApp', []);

    function randomNumbers() {
        var arr = [];
        var duplicateIds = [];
        var duplicates = {};

        var maxAttempts = drtConfig.numbersCount * drtConfig.attemptsToGenerateEachNumber; //just in case...
        for (var i = 1; i <= maxAttempts && arr.length < drtConfig.numbersCount; i++) {
            var randomNumber = drtUtils.getRandomInt(drtConfig.minNumber, drtConfig.maxNumber);
            if (!drtUtils.arrHasVal(arr, randomNumber)) {
                arr.push(randomNumber);
            }
        }

        if (arr.length !== drtConfig.numbersCount) {
            console.error(drtConfig.minNumber, drtConfig.maxNumber, drtConfig.numbersCount, arr);
            throw new Error('failed to generate random numbers..');
        }

        while (drtConfig.duplicatesCount * 2 > duplicateIds.length && duplicateIds.length < arr.length) {
            var randSourceId = drtUtils.getRandomInt(0, drtConfig.numbersCount - 1);
            var randTargetId = drtUtils.getRandomInt(0, drtConfig.numbersCount - 1);

            var isDuplicatingNumber = false;

            if (randSourceId !== randTargetId && !drtUtils.arrHasVal(duplicateIds, randTargetId)) {
                if (drtConfig.duplicateSameNumberMoreThanOnce) {
                    isDuplicatingNumber = true;
                } else if (!drtUtils.arrHasVal(duplicateIds, randSourceId)) {
                    isDuplicatingNumber = true;
                }
            }

            if (isDuplicatingNumber) {
                var dupNumber = arr[randSourceId];
                arr[randTargetId] = dupNumber;
                if (duplicates[dupNumber] === undefined) {
                    duplicates[dupNumber] = [];
                }

                duplicateIds.push(randSourceId);
                duplicateIds.push(randTargetId);

                if (!drtUtils.arrHasVal(duplicates[dupNumber], randSourceId)) {
                    duplicates[dupNumber].push(randSourceId);
                }
                if (!drtUtils.arrHasVal(duplicates[dupNumber], randTargetId)) {
                    duplicates[dupNumber].push(randTargetId);
                }
            }
        }

        console.log(duplicates);
        return {
            arr: arr,
            duplicates: duplicates
        };
    }

    app.controller('MainCtrl', function ($scope) {
        $scope.areNumbersDisabled = true;
        $scope.playerWon = null;
        $scope.showEndgameMessage = false;

        $scope.randomNumbers = [];
        var duplicates = {};
        var duplicatesCount = 0;

        $scope.startGame = function () {
            $scope.showEndgameMessage = false;
            var gameData = randomNumbers();
            $scope.randomNumbers = gameData.arr;
            duplicates = gameData.duplicates;
            duplicatesCount = drtConfig.duplicatesCount;
            $scope.areNumbersDisabled = false;
        };

        function gameOver() {
            $scope.areNumbersDisabled = true;
            $scope.playerWon = false;
            $scope.showEndgameMessage = true;
        }

        function victory() {
            $scope.areNumbersDisabled = true;
            $scope.playerWon = true;
            $scope.showEndgameMessage = true;
        }

        $scope.numberClick = function (id) {
            if ($scope.areNumbersDisabled) {
                return;
            }
            var dupNumber = $scope.randomNumbers[id];
            if (duplicates[dupNumber] !== undefined && duplicates[dupNumber].length > 1) {
                var dupIdx = duplicates[dupNumber].indexOf(id);
                duplicates[dupNumber].splice(dupIdx, 1);
                $scope.randomNumbers.splice(id, 1);
                duplicatesCount--;
                if (duplicatesCount === 0) {
                    victory();
                }
            } else {
                gameOver();
            }
        };
    });
})();
