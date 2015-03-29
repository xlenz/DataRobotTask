'use strict';

var drtConfig = {
    appUrl: 'http://localhost:5000',
    minNumber: 0,
    maxNumber: 9,
    numbersCount: 10,
    duplicatesCount: 3
};

var xpaths = {};
xpaths.numberContainer = '//*[contains(@class,"numbersContainer")]';
xpaths.numbersItemList = xpaths.numberContainer + '//ul[contains(@class,"randomNumbers")]/li';
xpaths.gameResultText = xpaths.numberContainer + '//*[contains(@class,"gameResultText")]';
xpaths.startGameButton = '//*[contains(@class,"controllBar")]/button';

describe('drtTests', function () {
    beforeEach(function () {
        browser.get(drtConfig.appUrl);
    });

    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Task.md');
    });

    it('should have a header', function () {
        var h1 = element(by.css('.gameContainer>h1'));
        expect(h1.isDisplayed()).toBe(true);
        expect(h1.getText()).toEqual('FIND DUPLICATES');
    });

    it('should have start game button', function () {
        var startGameBtn = element(by.xpath(xpaths.startGameButton));
        expect(startGameBtn.isDisplayed()).toBe(true);
        expect(startGameBtn.getText()).toEqual('Start Game');
        expect(startGameBtn.isEnabled()).toBe(true);
    });

    it('should be hidden game field, message, overlay', function () {
        shouldGameOverlayAndMessageBeShown(false);
        assertNumbersCount(0);
    });

    it('should be possible to start a game', function () {
        var startGameBtn = element(by.xpath(xpaths.startGameButton));
        startGameBtn.click();

    });

    it('should be possible to win and win again', function () {
        playGame(true);
        playGame(true);
    });

    it('should be possible to lose and lose again', function () {
        playGame(false);
        playGame(false);
    });

    it('should be possible to win then lose', function () {
        playGame(true);
        playGame(false);
    });

    it('should be possible to lose then win', function () {
        playGame(false);
        playGame(true);
    });

    it('should be possible to remove some duplicates before game over and play again', function () {
        playGame(false, 1);
        playGame(false, 2);
    });
});

function shouldGameOverlayAndMessageBeShown(shown) {
    expect(element(by.xpath(xpaths.numberContainer + '//*[contains(@class,"gameResultOverlay")]')).isDisplayed()).toBe(shown);
    expect(element(by.xpath(xpaths.gameResultText)).isDisplayed()).toBe(shown);
}

function assertNumbersCount(count) {
    element.all(by.xpath(xpaths.numbersItemList)).then(function (items) {
        expect(items.length).toBe(count);
    });
}

function playGame(winGame, clickDupsBeforeLose) {
    var textArr = [];
    var dups = [];
    var notDups = [];
    var numbersArr = [];

    if (!winGame) {
        if (clickDupsBeforeLose === undefined) {
            clickDupsBeforeLose = 0;
        } else if (!(clickDupsBeforeLose >= 0 && clickDupsBeforeLose <= drtConfig.duplicatesCount)) {
            console.warn('cannot click on duplicates before game over, invalid duplicates count provided: ' + clickDupsBeforeLose);
        }
    }

    var startGameBtn = element(by.xpath(xpaths.startGameButton));
    startGameBtn.click();
    expect(startGameBtn.isEnabled()).toBe(false);
    shouldGameOverlayAndMessageBeShown(false);
    assertNumbersCount(drtConfig.numbersCount);

    var listItems;
    browser.controlFlow().execute(function () {
        listItems = element.all(by.xpath(xpaths.numbersItemList));
    });
    browser.controlFlow().execute(function () {
        listItems.each(function (el, idx) {
            textArr.push(el.getText());
        });
    });
    browser.controlFlow().execute(function () {
        textArr.forEach(function (promise) {
            promise.then(function (text) {
                numbersArr.push(parseInt(text));
            });
        });
    });
    browser.controlFlow().execute(function () {
        expect(numbersArr.length).toEqual(drtConfig.numbersCount);
        numbersArr.sort();

        for (var i = 0; i < numbersArr.length; i++) {
            if (numbersArr[i] === numbersArr[i + 1]) {
                dups.push(numbersArr[i]);
            } else if (numbersArr[i] !== numbersArr[i - 1]) {
                notDups.push(numbersArr[i]);
            }
        }

        expect(dups.length).toEqual(drtConfig.duplicatesCount);
    });
    browser.controlFlow().execute(function () {
        var endGameText;
        if (winGame) {
            endGameText = 'VICTORY';
            for (var i = 0; i < dups.length; i++) {
                element.all(by.xpath('//ul[contains(@class,"randomNumbers")]/li/span[text()="' + dups[i] + '"]')).first().click();
            }
        } else {
            endGameText = 'GAME OVER';

            for (var i = 0; i < dups.length && i < clickDupsBeforeLose; i++) {
                element.all(by.xpath('//ul[contains(@class,"randomNumbers")]/li/span[text()="' + dups[i] + '"]')).first().click();
            }
            element(by.xpath('//ul[contains(@class,"randomNumbers")]/li/span[text()="' + notDups[0] + '"]')).click();

            assertNumbersCount(drtConfig.numbersCount - clickDupsBeforeLose);
        }

        expect(startGameBtn.isEnabled()).toBe(true);
        shouldGameOverlayAndMessageBeShown(true);
        expect(element(by.xpath(xpaths.gameResultText)).getText()).toEqual(endGameText);
    });
}

