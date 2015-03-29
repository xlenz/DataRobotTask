'use strict';

(function () {
    var app = angular.module('drt', []);

    function randomNumbers() {
        var arr = [];
        var duplicateIds = [];
        var duplicates = {};

        //random numbers array
        var maxAttempts = drtConfig.numbersCount * drtConfig.attemptsToGenerateEachNumber;
        for (var i = 1; i <= maxAttempts && arr.length < drtConfig.numbersCount; i++) {
            var randomNumber = drtUtils.getRandomInt(drtConfig.minNumber, drtConfig.maxNumber);
            if (!drtUtils.arrHasVal(arr, randomNumber)) {
                arr.push(randomNumber);
            }
        }

        //make sure random numbers arrays is ok
        if (arr.length !== drtConfig.numbersCount) {
            console.error(drtConfig.minNumber, drtConfig.maxNumber, drtConfig.numbersCount, arr);
            throw new Error('failed to generate random numbers..');
        }

        //duplicate some numbers
        var maxArrIdx = drtConfig.numbersCount - 1;
        var duplicatesAndNumberCount = calcDuplicatesAndNumber(duplicates);
        while (drtConfig.maxDuplicatesCount > duplicatesAndNumberCount.duplicatesCount && duplicatesAndNumberCount.numbersUsed < drtConfig.numbersCount) {
            var randSourceId = drtUtils.getRandomInt(0, maxArrIdx);
            var randTargetId = drtUtils.getRandomInt(0, maxArrIdx);

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

                duplicateIds.push(randSourceId);
                duplicateIds.push(randTargetId);

                if (duplicates[dupNumber] === undefined) {
                    duplicates[dupNumber] = [];
                }
                if (!drtUtils.arrHasVal(duplicates[dupNumber], randSourceId)) {
                    duplicates[dupNumber].push(randSourceId);
                }
                if (!drtUtils.arrHasVal(duplicates[dupNumber], randTargetId)) {
                    duplicates[dupNumber].push(randTargetId);
                }
                duplicatesAndNumberCount = calcDuplicatesAndNumber(duplicates);
            }
        }

        return {
            arr: arr,
            duplicates: duplicates,
            duplicatesCount: duplicatesAndNumberCount.duplicatesCount
        };
    }

    function calcDuplicatesAndNumber(duplicates) {
        var duplicatesCount = 0;
        var numbersUsed = 0;
        angular.forEach(duplicates, function (value, key) {
            duplicatesCount += value.length - 1;
            numbersUsed += value.length;
        });
        return {
            numbersUsed: numbersUsed,
            duplicatesCount: duplicatesCount
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
            duplicatesCount = gameData.duplicatesCount;
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

        $scope.numberClick = function (id, num) {
            if ($scope.areNumbersDisabled) {
                return;
            }
            if (duplicates[num] !== undefined && duplicates[num].length > 1) {
                var dupIdx = duplicates[num].indexOf(id);
                duplicates[num].splice(dupIdx, 1);
                $scope.randomNumbers.splice(id, 1);
                duplicatesCount--;
                if (duplicatesCount === 0) {
                    victory();
                }
            } else {
                gameOver();
            }
        };

        $scope.isTouch = function () {
            return ('ontouchstart' in document);
        };
    });
})();
