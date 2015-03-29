'use strict';

exports.config = {
    specs: [
        'e2e/**/*.spec.js'
    ],

    //seleniumAddress: 'http://localhost:4444/wd/hub',
    multiCapabilities: [{
        browserName: 'chrome'
    }/*, {
        browserName: 'firefox'
    }*/]
};
