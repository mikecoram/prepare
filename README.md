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
Set up a postgreSQL database and then edit config/config.json.
~~~~
db:migrate:all
~~~~

### Running
~~~~
npm start
~~~~

### Testing
~~~~
npm test
~~~~