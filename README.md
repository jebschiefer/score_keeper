# score_keeper

Web app for keeping track of game scores.

## Requirements
- Nodejs version 8
- Firebase credentials

## Technologies
- [Nodejs](https://nodejs.org/)
- [Express](http://expressjs.com/): web app framework
- [Typescript](http://www.typescriptlang.org/): provides useful things such as optional types on top of JavaScript
- [Handlebars](http://handlebarsjs.com/): HTML templates
- [Firebase](https://firebase.google.com/): database

## Setup
- Install nodejs
- Obtain firebase credentials
- Checkout code
- Install dependencies: `npm install`
- Create `<project_root>/config/firebase.json` with credentials
- Create `<project_root>.env` (example below)
- Start app: `npm start`
- Open http://localhost:8080

## Sample .env
```
# Used for creating session
SECRET=<random_string>

# USERNAME and PASSWORD are used to log in
USERNAME=<username>
PASSWORD=<password>

# URL of the firebase database
DATABASE=<firebase_database_url>
```
