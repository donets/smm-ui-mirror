* checkout to \<smm_root\>
* install ruby (if you have provlems with ssl: https://gist.github.com/luislavena/f064211759ee0f806c88
* install compass/sass: http://compass-style.org/install/
* cd \<smm_root\>
* npm install -g grunt-cli
* npm install -g bower
* npm install -g protractor
* npm install
* bower install
* to run the service on localhost:9000: grunt serve

To run all tests automatically:

* cd <smm_root>
* run ``` webdriver-manager update ``` to update your global selenium webdriver jars for protractor (should be done once)
after you’ve updated your selenium jars run ``` webdriver-manager start ``` in a separate command prompt shell or via gnu screen (for linux/mac users)
* and then ``` grunt test ```
* (Optionally) you might want to run e2e test suites separately without building frontend project from scratch, each time you’ve changed something. So, you have to build frontend project with ``` grunt clean concurrent:test ``` once, and then you can launch test suites runner with ``` grunt connect:test protractor ```.
