### Global Dependencies
node,
npm,
sequelize-cli,
mocha

### Requirements
PostgreSQL database (Postgres.app for Mac is very convenient)

### Setup
~~~~ 
git clone https://mikecoram@bitbucket.org/mikecoram/prepare.git
npm install
npm install -g sequelize-cli mocha
~~~~
Set up a postgreSQL database
Edit config/config.json

### Running
~~~~
npm start
~~~~

### Testing
~~~~
npm test
mocha // alternative
~~~~