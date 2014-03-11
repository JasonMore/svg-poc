svg-poc
=====================

Several small proof of concepts for using angular.js with svg

setup
=====================

Things you'll need

1. node.js - http://www.nodejs.org
2. homebrew - http://brew.sh/ (mac)
3. Install mongo - "brew install mongo" or http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
4. Install Redis - "brew install redis" or http://cook.coredump.me/post/18886668039/brew-install-redis
5. Install Web-driver "brew install chromedriver"
6. Install mocha "sudo npm install -g mocha"
7. Install karma "sudo npm install -g karma"
8. Install supervisor "sudo npm install -g supervisor"
9. Install node project dependencies "npm install"

running the app
=====================
1. start mongo run "mongod"
2. start redis run "redis-server"
3. Run app "npm run startDev"

running client tests
=====================
1. "karma start"

running server tests
=====================
1. "npm run test-server"

running e2e server tests
=====================
1. "npm run test-e2e"