### Global Dependencies
node,
npm,
sequelize-cli,
mocha

### Requirements
PostgreSQL database (Postgres.app is good for local testing on a Mac)

### Setup
~~~~ 
git clone https://mikecoram@bitbucket.org/mikecoram/prepare.git
npm install
npm install -g sequelize-cli mocha
~~~~
Set up a postgreSQL database and then edit config/config.json.
~~~~
sequelize db:migrate
~~~~
Add domain and subdomain to hosts file (etc/hosts)
~~~~
127.0.0.1       testapp.dev
127.0.0.1       admin.testapp.dev
127.0.0.1       api.testapp.dev
~~~~

### Sequelize
Creating a new model (generates model and migration):
~~~~
sequelize model:create --name Name --attributes "attr:type"
~~~~

Apply all migrations
~~~~
sequelize db:migrate
~~~~

Undo last migration
~~~~
sequelize db:migrate:undo
~~~~

### Notable
Edit config/config.json to configure database and email settings
Edit app name etc. in lib/constants.js
Create a credentials.json file in the config folder like so:
~~~~
{
    "cookieSecret": "your secret"
    "sessionSecret": "your secret",
}
~~~~

### Running
~~~~
npm start
~~~~

### Testing
~~~~
npm test
~~~~