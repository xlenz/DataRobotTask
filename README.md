# DataRobotTask

## How to run
App has been tested on Windows only. Browser: Chrome.

1. Ensure you have working npm, bower, protractor.
2. `bower install`
3. `npm start`
4. `npm test`
5. [http://localhost:5000](http://localhost:5000)

## Task Description
[See full description](https://gist.github.com/bratchenko/990f024e11fd09e6b6bf)

The task is to create a simple web application that does following:

1. It shows 10 random numbers to user. They must have duplicates among them.
2. User should click on numbers that have duplicates and they are removed from the list.
3. If user clicks on a number that doesn't have duplicate in the list, "Game over" message
   is displayed and user can't click on numbers anymore.
4. If user successfully removes all the duplicate numbers, "Victory" message is displayed.

Please, make it look nice by using some styling.

Then write end-to-end tests for this application.

* Use http://flask.pocoo.org/ for writing backend of the application.
* Use http://angular.github.io/protractor/ to write end-to-end tests for the application.
